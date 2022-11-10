import { readdir } from 'fs';
import { join } from 'path';
import baileys, { useMultiFileAuthState, Browsers, DisconnectReason, delay } from '@adiwajshing/baileys';
import __dirname from '../helpers/dirname.js';

const sessions = new Map();

const sessionsDir = (sessionId = '') => {
    return join(__dirname, 'sessions', sessionId ? sessionId : '')
};

const isSessionExist = (id) => {};

const getSession = (id) => {
    return sessions.get(id) ?? null;
}

const createSession = async (id) => {
    const sessionFile = `md_${id}`;

    const { state, saveCreds: saveState } = await useMultiFileAuthState(sessionsDir(sessionFile));

    const config = {
        auth: state,
        printQRInTerminal: true,
        browser: Browsers.ubuntu('Chrome')
    }

    const sock = baileys.default(config);

    sessions.set(id, { ...sock });

    sock.ev.on('creds.update', saveState);
}

const sendMessage = async (session, receiver, message, delayMs = 1000) => {
    try {
        await delay(parseInt(delayMs));
        return session.sendMessage(receiver, message);
    } catch {
        return Promise.reject(null);
    }
}

const formatPhone = (phone) => {
    if (phone.endsWith('@s.whatsapp.net')) {
        return phone
    }

    let formatted = phone.replace(/\D/g, '')

    return (formatted += '@s.whatsapp.net')
}

const init = () => {
    readdir(sessionsDir(), (err, files) => {
        if (err) throw err;

        for (const file of files) {
            if (!file.startsWith('md_') || file.endsWith('_store')) {
                continue;
            };

            const filename = file.replace('.json', '');
            const sessionId = filename.substring(3);

            createSession(sessionId);
        }
    })
};

export {
    isSessionExist,
    getSession,
    sendMessage,
    createSession,
    formatPhone,
    init
};
