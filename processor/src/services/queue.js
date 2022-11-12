import Queue from 'bull';

const queue = new Queue('bot-respond');

export default queue;
