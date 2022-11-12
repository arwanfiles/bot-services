import { readdir, rmSync } from 'fs';
import { join } from 'path';
import pino from 'pino';
import baileys, { useMultiFileAuthState, Browsers, delay } from '@adiwajshing/baileys';
import { toDataURL } from 'qrcode';
import __dirname from '../helpers/dirname.js';
import response from '../helpers/response.js';
import logger, { logStream } from './logger.js';
import reformatWhatsappMessage from '../helpers/message.js';

const states = ['connecting', 'connected', 'disconnecting', 'disconnected'];

const sessions = new Map();

const sessionsDir = (id = '') => {
    return join(__dirname, 'sessions', id || '');
};

const isSessionExist = (id) => {};

const getSession = (id) => {
    return sessions.get(id) ?? null;
};

const createSession = async (id, res = null) => {
    const sessionFile = `md_${id}`;
    const log = pino({ level: process.env.WHATSAPP_DEBUG_LEVEL || 'info' }, logStream);

    const { state, saveCreds } = await useMultiFileAuthState(sessionsDir(sessionFile));

    const config = {
        auth: state,
        printQRInTerminal: true,
        logger: log,
        browser: Browsers.ubuntu('Chrome')
    };

    const sock = baileys.default(config);

    sessions.set(id, { ...sock });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const result = reformatWhatsappMessage(m);
        if (result) {
            await delay(1000);
            const body = {
                session_id: id,
                message: result
            };
            logger.debug(body, 'New message received, sending to processor webhook...');
            logger.info(`New message received from ${result.from.id}, sending to processor webhook...`);
        }
    });

    sock.ev.on('connection.update', async (update) => {
        if (update.qr) {
            if (res && !res.headersSent) {
                try {
                    const qr = await toDataURL(update.qr);

                    response.success(res, 'QR code received, please scan the QR code.', { qr });
                    return;
                } catch {
                    response.error(res, 'Unable to create QR code.');
                }
            }

            try {
                await sock.logout();
            } catch {
            } finally {
                deleteSession(id);
            }
        }
    });
};

const deleteSession = (id) => {
    const sessionFile = `md_${id}`;
    const rmOptions = { force: true, recursive: true };

    rmSync(sessionsDir(sessionFile), rmOptions);

    sessions.delete(id);
};

const sendMessage = async (session, receiver, message, delayMs = 1000) => {
    try {
        await delay(parseInt(delayMs));
        return session.sendMessage(receiver, message);
    } catch {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(null);
    }
};

const formatPhone = (phone) => {
    if (phone.endsWith('@s.whatsapp.net')) {
        return phone;
    }

    let formatted = phone.replace(/\D/g, '');

    return (formatted += '@s.whatsapp.net');
};

const getSessions = () => {
    const array = [];
    sessions.forEach((value, key) => {
        array.push({
            id: key,
            session: value
        });
    });
    return array;
};

const init = () => {
    readdir(sessionsDir(), (err, files) => {
        if (err) {
            logger.error('Error reading session directory');
            return;
        }

        for (const file of files) {
            if (!file.startsWith('md_') || file.endsWith('_store')) {
                continue;
            };

            const filename = file.replace('.json', '');
            const sessionId = filename.substring(3);

            createSession(sessionId);
            logger.info({ session_id: sessionId }, 'Successfully restore session');
        }
        logger.info('Successfully init whatsapp');
    });
};

export {
    states,
    isSessionExist,
    getSession,
    getSessions,
    createSession,
    deleteSession,
    sendMessage,
    formatPhone,
    init
};
