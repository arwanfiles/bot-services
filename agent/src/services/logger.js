import pino from 'pino';
import pretty from 'pino-pretty';

export const logStream = pretty({
    colorize: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss',
    singleLine: true,
    crlf: true
});

const logger = pino({
    level: process.env.APP_DEBUG_LEVEL ?? 'info'
}, logStream);

export default logger;
