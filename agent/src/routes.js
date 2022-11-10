import { Router } from 'express';
import * as chatHandlers from './handlers/chats.js';
import * as sessionHandlers from './handlers/session.js';
import response from './helpers/response.js';

const router = Router();

router.get('/', (req, res) => response(res, 200, true, 'Bot Agent'));
router.get('/chats', chatHandlers.send);
router.get('/sessions', sessionHandlers.get);
router.post('/sessions', sessionHandlers.create);

router.all('*', (req, res) => response(res, 404, false, 'The requested url cannot be found.'));

export default router;