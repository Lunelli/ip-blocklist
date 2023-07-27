import express, { NextFunction, Request, Response } from 'express';
import { apiErrorHandler } from './api';
import { registerRoutes } from './routers/blocklistRouter';
import { isNotNullable } from '../shared/common';

export async function initExpressApp() {
    const app = express();
    app.use(express.json());
    app.use(ignoreFavicon);
    app.use('/', await registerRoutes());
    app.use(apiErrorHandler);

    const port = getExpressPort();
    app.listen(port, () => {
        console.log(`Server ready at: http://localhost:${port}`)
    });

    app.on('error', (error) => {
        console.error('Server error', error);
    });

    return app;
}

function getExpressPort(): number {
    const port = process.env.PORT;
    return (isNotNullable(port)) ? Number.parseInt(port) : 3000;
}


function ignoreFavicon<T = unknown>(req: Request<T>, res: Response, next: NextFunction) {
    if (req.originalUrl.includes('favicon.ico')) {
        res.status(204).end();
        return;
    }
    next();
}
