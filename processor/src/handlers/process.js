import joi from 'joi';
import response from '../helpers/response.js';

const process = async (req, res) => {
    // validate body
    const schema = joi.object({
        session_id: joi.string().required(),
        message: joi.object().keys({
            from: joi.object().keys({
                id: joi.string().required(),
                name: joi.string().required()
            }).required(),
            type: joi.string().required(),
            original_type: joi.string().optional(),
            content: joi.object().keys({
                text: joi.string().required()
            }).required()
        }).required()
    });

    const validation = schema.validate(req.body);

    if (validation.error) {
        return response.error(res, validation.error.message, null, 422);
    }

    return response.success(res, 'The message has been successfully process.');
};

export { process };
