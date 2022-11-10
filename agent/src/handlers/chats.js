import { getSession, sendMessage, formatPhone } from '../services/whatsapp.js';
import response from '../helpers/response.js';

const send = async (req, res) => {
    const session = getSession('arwanfiles');
    const receiver = formatPhone('6281252733330');
    const message = { text: 'oh hello there' };
    try {
        await sendMessage(session, receiver, message, 1);
        response(res, 200, true, 'The message has been successfully sent.');
    } catch {
        response(res, 500, false, 'Failed to send the message.');
    }

    // try {
    //     const exists = await isExists(session, receiver);
    //     if (!exists) return response(res, 400, false, 'The receiver number is not exists.');

    //     await sendMessage(session, receiver, message, 0);
    //     response(res, 200, true, 'The message has been successfully sent.');
    // } catch {
    //     response(res, 500, false, 'Failed to send the message.');
    // }
}

export { send };
