import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodeCleanup from 'node-cleanup';
import routes from './routes.js';
import logger from './services/logger.js';
import { init } from './services/whatsapp.js';

const app = express();
const port = parseInt(process.env.APP_PORT ?? 3002);

app.use(cors());
app.use(express.json());
app.use('/', routes);

const listenerCallback = () => {
    init();
    // createSession('yenni');
    logger.info(`Server is listening on port ${port}`);
};

app.listen(port, listenerCallback);

nodeCleanup((code, signal) => {
    logger.info(`Server close with code: ${code} - ${signal}`);
});

export default app;
