import express from "express";
import { handleAPIRequest } from "../api";
import { verifyBlocklist } from "../../blocklist";

export async function registerRoutes() {
    const router = express.Router();
    router.get('/:ip', async (...args) => await handleAPIRequest(verifyBlocklist, ...args));
    return router;
}
