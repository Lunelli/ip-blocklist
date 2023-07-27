import 'jest';
import * as fs from 'fs';
import path from "path";
import express from 'express';
import request from 'supertest';
import { initExpressApp } from '../src/api/server';
import { getRedisClient, initRedis } from '../src/shared/redis';

jest.mock(`node-fetch`, () => {
    const rawText = fs.readFileSync(path.join(__dirname, '/assets/rawlistexample.txt'), 'utf8')
    const generateResponse = () => {
        return { ok: true, status: 200, text: () => rawText };
    };
    return jest.fn().mockResolvedValue(generateResponse());
});

// not ideal, gave up on mocking redis, i'd need to take e deeper look at it
jest.mock("redis", () => jest.requireActual("redis-mock"));

describe('IP Blocklist', () => {
    let app: express.Application;

    beforeAll(async () => {
        await initRedis();
        app = await initExpressApp();
    });

    afterEach(async () => {
    });

    it('should check ip param format', async () => {
        const response = await request(app).get('/wrong').send();
        expect(response.text).toBe('Invalid IP format');
    });

    it('should find ip in blocklist', async () => {
        const response = await request(app).get('/45.168.176.34').send();
        expect(response.text).toBe('true');
    });

    it('shoud not find ip in blocklist', async () => {
        const response = await request(app).get('/1.1.1.1').send();
        expect(response.text).toBe('false');
    });

    // more tests... for cache, errors handling, and so on
    
});

