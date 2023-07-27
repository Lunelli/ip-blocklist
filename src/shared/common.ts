import { APIError } from "../error/api_error";
import { validIPRegex } from "./constants";

export function isNotNullable<T>(value: T): value is NonNullable<T> {
    return value !== null && typeof value !== 'undefined' && value !== undefined;
}

export async function validateIPFormat(ip: unknown): Promise<boolean | Error> {
    if (!ip || typeof ip !== 'string') {
        return new APIError('Invalid IP type');
    }
    if (!validIPRegex.test(ip)) {
        return new APIError('Invalid IP format');;
    }
    return true;
}
