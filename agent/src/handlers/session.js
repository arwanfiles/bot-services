const get = (req, res) => {
    res.send('all session listed here..');
}

const create = (req, res) => {
    res.send('session created!');
}

export { get, create };
