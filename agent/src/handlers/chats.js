import joi from 'joi';
import { getSession, sendMessage, formatPhone } from '../services/whatsapp.js';
import response from '../helpers/response.js';

const send = async (req, res) => {
    // validate body
    const schema = joi.object({
        session_id: joi.string().required(),
        receiver: joi.string().required(),
        message: joi.object({
            text: joi.string()
        })
    });

    const validation = schema.validate(req.body);

    if (validation.error) {
        return response.error(res, validation.error.message, null, 422);
    }

    const { session_id: sessionId, receiver: receiverReq, message } = req.body;
    const receiver = formatPhone(receiverReq);

    // check session
    const session = getSession(sessionId);
    if (session == null) return response.error(res, 'No whatsapp session found', null, 403);

    // Send Message
    try {
        // const exists = await isExists(session, receiver);
        // if (!exists) return response.error(res, 'The receiver number is not exists.', 422);

        await sendMessage(session, receiver, message);
        return response.success(res, 'The message has been successfully sent.');
    } catch {
        return response.error(res, 'Failed to send the message.', null, 500);
    }
};

export { send };
