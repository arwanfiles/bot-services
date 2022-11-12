import { Router } from 'express';
import * as processHandlers from './handlers/process.js';
import response from './helpers/response.js';

const router = Router();

router.get('/', (req, res) => response.success(res, 'Bot Processor Restful API'));

router.post('/process', processHandlers.process);

router.all('*', (req, res) => {
    const stacks = router.stack;
    const layers = stacks.filter(x => x.name === 'bound dispatch' && x.regexp.test(req.path));

    const methods = [];
    layers.forEach(layer => {
        for (const method in layer.route.methods) {
            if (layer.route.methods[method] === true && method.toUpperCase() !== '_ALL') {
                methods.push(method.toUpperCase());
            }
        }
    });

    if (methods.length > 0) return response.error(res, 'Method Not Allowed.', null, 405);

    return response.error(res, 'The requested url cannot be found.', null, 404);
});

export default router;
