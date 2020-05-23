import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import IAccount from './modules/account.module';
import IWhitelist from './modules/whitelist.module';

export async function verifyToken (req: Request, res: Response, next: NextFunction) {
    console.log(`Verify token ==> ${moment().format()}`);
    const token = req.header('auth-token');
    if (!token) {
        console.log(`There is no token ==> ${moment().format()}`);
        return res.status(401).send("Access denied");
    }

    const tokenObj = await IWhitelist.findOne({token});
    console.log(tokenObj)
    if (!tokenObj) {
        console.log(`The token ${token} does not exists in the whitelist ==> ${moment().format()}`);
        return res.status(401).send("Access denied");
    } 

    try {
        jwt.verify(token, "nnnaaahdyll");
    } catch(err) {
        return res.status(401).send("Invalid token");
    }

    console.log(`Authentication was successfully ==> ${moment().format()}`);
    next();
}