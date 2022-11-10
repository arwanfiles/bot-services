import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { createSession, init } from './services/whatsapp.js';

const app = express();
const port = parseInt(process.env.PORT ?? 8000)

app.use(cors());
app.use(express.json());
app.use('/', routes);

const listenerCallback = () => {
    init();
    console.log(`Server is listening on port ${port}`);
}

app.listen(port, listenerCallback);
export default app;

