import Joi from '@hapi/joi';

export const registerValidation = (data: any) => {
    return  Joi.object().keys({
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        username: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(6).required(),
        balance: Joi.number().max(1000000).min(0),
        email: Joi.string().min(6).max(100).required().email(),
    }).validate(data)
}

export const loginValidation = (data: any) => {
    return  Joi.object().keys({
        username: Joi.string().min(3).max(50).required(),
        password: Joi.string().max(50).required(),
    }).validate(data)
}

export const passwordValidation = (data: any) => {
    return  Joi.object().keys({
        password: Joi.string().max(50).required(),
    }).validate(data)
}

export const usernameValidation = (data: any) => {
    return  Joi.object().keys({
        username: Joi.string().min(3).max(50).required()
    }).validate(data)
}