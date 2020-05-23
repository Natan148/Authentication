import Joi from '@hapi/joi';

const MAX_DECIMAL = 2;
const MAX_BALANCE = 1000000;

export const namesValidation = (name: string): any => {
    return Joi.object().keys({
        name: Joi.string().min(2).max(50).required(),
    }).validate(
      {name});
}

export const usernameValidation = (username: string): any => {
    return Joi.object().keys({
        username: Joi.string().min(3).max(50).required(),
    }).validate(
      {username});
}

export const passwordValidation = (pass: string): any => {
    return Joi.object().keys({
        pass: Joi.string().min(6).max(50).required(),
    }).validate(
      {pass});
}

export const emailValidation = (email: string): any => {
    return Joi.object().keys({
        email: Joi.string().max(100).email({ tlds: { allow: false } }).required(),
    }).validate(
      {email});
}

export const balanceValidation = (balance: string): string  | void => {
    const separatedNum = balance.split('.'); 
    if (separatedNum[1] && separatedNum[1].length > MAX_DECIMAL) {
        return `The balance must with max ${MAX_DECIMAL} digits decimal`;
    }
    if (isNaN(+balance) || +balance < 0 || +balance > MAX_BALANCE) {
        return `The balance must be a number between 0 to ${MAX_BALANCE}`
    }
}