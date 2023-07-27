import { redisHelper } from "./shared/redis";
import { DayInMs } from "./shared/constants";

export async function checkCachedBlocklist(ip: string): Promise<null | boolean> {
    let result: null | number = null;
    const redis = redisHelper();
    const ipsKeys = await redis.scard('ips');
    const hasCache = ipsKeys > 0;
    if (hasCache) {
        const isValidCache = await isBlocklistCacheValid();
        if (isValidCache) {
            result = await redis.sismember('ips', ip);
        }
    }
    return (result === null) ? result : !!result;
}

export async function getBlocklistCacheLastUpdate(): Promise<null | number> {
    const redis = redisHelper();
    const lastUpdateMs = await redis.get('ips_last_update');
    return (lastUpdateMs) ? Number(lastUpdateMs) : null;
}

export async function cacheBlocklist(ips: string[], lastUpdateMs: number): Promise<void> {
    const redis = redisHelper();
    redis.sadd('ips', ips);
    redis.set('ips_last_update', lastUpdateMs.toString());
}

async function isBlocklistCacheValid(): Promise<boolean> {
    let valid = false;
    const lastUpdateMs = await getBlocklistCacheLastUpdate();
    if (lastUpdateMs) {
        const expiration = (lastUpdateMs + DayInMs);
        valid = expiration > new Date().getTime();
    }
    return valid;
}
