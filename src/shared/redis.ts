import { promisify } from "util";
import { isNotNullable } from "./common";
import { RedisClient, createClient } from "redis";

let client: RedisClient;

export const getRedisClient = () => client;

export function redisHelper() {
    const client = getRedisClient();
    const overwrittenSAdd: <T>(key: string, arg1: T) => Promise<number> = promisify(client.sadd).bind(client);
    return {
        get: promisify(client.get).bind(client),
        set: promisify(client.set).bind(client),
        scard: promisify(client.scard).bind(client),
        sismember: promisify(client.sismember).bind(client),
        sadd: overwrittenSAdd,
    }
}

export async function initRedis() {
    if (!client) {
        const password = getRedisPass();
        client = createClient({
            host: getRedisHost(),
            port: getRedisPort(),
            auth_pass: password,
            password,
        });

        if (password) {
            const auth = promisify(client.auth).bind(client);
            await auth(password);
        }

        registerRedisEvents(client);

    }
    return client;
}

//

function registerRedisEvents(client: RedisClient) {
    client.on('ready', () => {
        console.log('Redis is ready');
    });

    client.on('reconnecting', () => {
        console.log('Redis is reconnecting...');
    });

    client.on('error', (err: unknown) => {
        console.error('Redis error', err);
    });
}

function getRedisHost(): string {
    const host = process.env.REDIS_HOST;
    return (isNotNullable(host)) ? host : 'localhost';
}

function getRedisPass(): string | undefined {
    const password = process.env.REDIS_PASSWORD;
    return (isNotNullable(password)) ? password : undefined;
}

function getRedisPort(): number {
    const port = process.env.REDIS_PORT;
    return (isNotNullable(port)) ? Number.parseInt(port) : 6379;
}
