import dotenv from 'dotenv';
import { initRedis } from './shared/redis';
import { initExpressApp } from './api/server';

dotenv.config();

async function start(): Promise<void> {
    await initRedis();
    await initExpressApp();
}

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection, reason:', error);
});

export default start();
