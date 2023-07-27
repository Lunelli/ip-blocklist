import { APIError } from "../error/api_error";
import { isNotNullable } from "../shared/common";
import { NextFunction, Request, Response } from "express";
import { constants as httpConstants } from 'http2';
import { STATUS_CODES as httpStatusCode } from 'http';

export async function handleAPIRequest<T = unknown, R = unknown>(callback: (p: T) => Promise<R>, req: Request<T>, res: Response, next: NextFunction): Promise<void> {
    try {
        const params = (req.method === 'GET') ? req.params : req.body;
        const result: unknown = await callback.call(null, params);
        if (result instanceof Error) {
            await apiErrorHandler(result, req, res, next);
            return;
        }
        const data = isNotNullable(result) ? result : httpStatusCode[httpConstants.HTTP_STATUS_OK];
        res.status(httpConstants.HTTP_STATUS_OK).send(data);
    } catch (exception: unknown) {
        next(exception);
    }
}

export async function apiErrorHandler<T = unknown>(exception: unknown, req: Request<T>, res: Response, next: NextFunction) {
    if (exception) {
        if (exception instanceof APIError) {
            res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send(exception.message || httpStatusCode[httpConstants.HTTP_STATUS_BAD_REQUEST]);
            return;
        } else {
            console.error('API exception', exception);
            res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send(httpStatusCode[httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR]);
            return;
        }
    }
    next();
}
