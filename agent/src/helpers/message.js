import logger from '../services/logger.js';

const messageTypeMap = {
    conversation: 'text',
    extendedTextMessage: 'text',
    imageMessage: 'image',
    audioMessage: 'audio',
    documentMessage: 'document',
    locationMessage: 'location'
};

const restructureMessageContent = (content, type) => {
    switch (type) {
    case 'conversation':
        return { text: content };
    case 'locationMessage':
        return { latitude: content.degreesLatitude, longitude: content.degreesLongitude };
    default:
        return content;
    }
};

const reformatWhatsappMessage = (m) => {
    const message = m.messages[0];

    if (
        !message.key.fromMe && // message must from another account
        m.type === 'notify' && // incoming type must be notify
        message.key.remoteJid !== 'status@broadcast' && // skip status stories
        !message.key.remoteJid.includes('@g.us') // skip group message
    ) {
        logger.debug(m, 'Full message content');
        const messageType = Object.keys(message.message)[0];
        const messageContent = Object.values(message.message)[0];
        return {
            from: {
                id: message.key.remoteJid,
                name: message.pushName
            },
            type: messageTypeMap[messageType] ?? 'other',
            originalType: messageType,
            content: restructureMessageContent(messageContent, messageType)
        };
    }

    return null;
};

export default reformatWhatsappMessage;
