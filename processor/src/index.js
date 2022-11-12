import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodeCleanup from 'node-cleanup';
import routes from './routes.js';
import queue from './services/queue.js';
import logger from './services/logger.js';

const app = express();
const port = parseInt(process.env.APP_PORT ?? 3001);

app.use(cors());
app.use(express.json());
app.use('/', routes);

const listenerCallback = async () => {
    // await queue.add({ name: 'arwanfiles' });
    // await queue.add({ name: 'hello' });
    // // queue.process((job, done) => {
    // //     console.log(job.data);
    // //     done();
    // // });
    logger.info(`Server is listening on port ${port}`);
};

app.listen(port, listenerCallback);

nodeCleanup((code, signal) => {
    logger.info(`Server close with code: ${code} - ${signal}`);
});

export default app;
