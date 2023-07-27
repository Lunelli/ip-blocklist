import fetch, { Response } from 'node-fetch';
import { constants as httpConstants } from 'http2';
import { IPBlocklistUrl } from './shared/constants';

export async function fetchRawBlocklist(): Promise<string> {
	try {
		const response = await fetch(IPBlocklistUrl);
		if (!response.ok || response.status !== httpConstants.HTTP_STATUS_OK) {
			throw response;
		}
		const raw = await response.text();
		return raw;
	} catch (error) {
		if (error instanceof Response) {
			const msg = 'Ip Blocklist - HTTP Error Response';
			console.error(msg, error);
			throw new Error(`${msg}: ${error.status} ${error.statusText}`)
		} else {
			throw error;
		}
	}
}
