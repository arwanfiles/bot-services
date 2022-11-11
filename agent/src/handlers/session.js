import joi from 'joi';
import response from '../helpers/response.js';
import { states, getSession, getSessions, deleteSession, createSession } from '../services/whatsapp.js';

const get = (req, res) => {
    const data = getSessions().map((el) => {
        return {
            session_id: el.id,
            user: el.session.user,
            status: states[el.session.ws.readyState]
        };
    });

    return response.success(res, 'Successfully list all session', data);
};

const create = (req, res) => {
    // validate body
    const schema = joi.object({
        session_id: joi.string().required(),
        phone: joi.string().optional()
    });

    const validation = schema.validate(req.body);
    if (validation.error) return response.error(res, validation.error.message, null, 422);

    // create new session
    const { session_id: sessionId } = req.body;
    createSession(sessionId, res);
};

const destroy = async (req, res) => {
    // validate params
    const schema = joi.object({
        id: joi.string().required()
    });

    const validation = schema.validate(req.params);
    if (validation.error) return response.error(res, validation.error.message, null, 422);

    // delete session
    const { id } = req.params;
    const session = getSession(id);
    if (session === null) return response.error(res, `No session found or invalid whatsapp session with id ${id}`, null, 422);

    try {
        await session.logout();
    } catch {
    } finally {
        deleteSession(id);
    }

    return response.success(res, 'Successfully delete session');
};

export { get, create, destroy };
