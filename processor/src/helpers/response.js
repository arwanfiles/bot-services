const response = (res, statusCode = 200, success = false, message = '', data = null) => {
    res.status(statusCode);

    const json = {
        success,
        message
    };
    if (data !== null) json.data = data;

    res.json(json);

    res.end();
};

const success = (res, message = '', data = null, code = 200) => {
    return response(res, code, true, message, data);
};

const error = (res, message = '', data = null, code = 500) => {
    return response(res, code, false, message, data);
};

export default { success, error };
