import { APIError } from "./error/api_error";
import { validateIPFormat } from "./shared/common";
import { fetchRawBlocklist } from "./client";
import { cacheBlocklist, checkCachedBlocklist, getBlocklistCacheLastUpdate } from "./cache";

export async function verifyBlocklist(params: { ip: string }): Promise<boolean | APIError> {
    const { ip: _ip } = params;
    const ip = _ip.trim();

    const valid = await validateIPFormat(ip);
    if (valid instanceof APIError) {
        return valid;
    }

    const cachedResult = await checkCachedBlocklist(ip);
    if (cachedResult !== null) {
        return cachedResult;
    }

    const rawContent = await fetchRawBlocklist();
    const lastUpdateMs = await getBlocklistCacheLastUpdate();
    const content = formatRawIpBlocklistResponse(rawContent);
    if (content instanceof APIError) {
        return content;
    }

    // if the cache is not up to date, update it
    if (content.lastUpdateMs !== lastUpdateMs) {
        await cacheBlocklist(content.ips, content.lastUpdateMs);
    }

    const refreshedCacheResult = await checkCachedBlocklist(ip);
    if (refreshedCacheResult === null) {
        return new APIError('Failed to verify IP');
    }

    return refreshedCacheResult;
}


function formatRawIpBlocklistResponse(response: string): { lastUpdateMs: number, ips: string[] } | APIError {
    try {
        const lines = response.split('\n');
        const headers = lines.filter(x => x.includes('#'));
        const lastUpdateHeader = headers.find(x => x.includes('Last update:'));
        if (!lastUpdateHeader) {
            return new APIError('Failed to read IP blocklist last update header');
        }
        const lastupdate = lastUpdateHeader.replace('# Last update:', '').trim();
        const lastUpdateMs = new Date(lastupdate).getTime();
        const ips = lines.filter(x => !x.includes('#')).map(x => x.split('\t')[0]);
        return { lastUpdateMs, ips };
    } catch (exception: unknown) {
        const msg = 'Failed to read IP blocklist raw content';
        console.error(msg, exception);
        return new APIError(msg);
    }
}
