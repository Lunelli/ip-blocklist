export class APIError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}
