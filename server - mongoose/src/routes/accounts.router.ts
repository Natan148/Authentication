import { Router, Request, Response, NextFunction } from 'express';
import moment from 'moment';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import IAccount from '../modules/account.module';
import IWhitelist from '../modules/whitelist.module';
import { registerValidation, loginValidation } from '../validations';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    console.log(`Try register with `, req.body, ` ==> ${moment().format()}`);
    const { error } = registerValidation(req.body);
    if (error) {
        console.log(`The validation filed: ${error.details[0].message} ==> ${moment().format()}`);
        return res.status(400).send(error.details[0].message);
    }

    const userNameExist = await IAccount.findOne({username: req.body.username});
    if (userNameExist) {
        console.log(`The user name ${req.body.username} already exists ==> ${moment().format()}`);
        return res.status(400).send("The username already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const account = new IAccount({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: hashedPass,
        balance: req.body.balance ? req.body.balance : 0
    })

    try {
        const savedAccount = await account.save();
        res.send(savedAccount);
        console.log(`The new account registered successfully ==> ${moment().format()}`);
    } catch(err) {
        console.log(`The registration filed:`, err, ` ==> ${moment().format()}`)
        res.status(400).send(err);
    }
})

router.post('/login', async (req: Request, res: Response) => {
    console.log(`Try login with username ${req.body.username} and pass ${req.body.password} ==> ${moment().format()}`);
    const { error } = loginValidation(req.body);
    if (error) {
        console.log(`The validation filed: ${error.details[0].message} ==> ${moment().format()}`);
        return res.status(400).send(error.details[0].message);
    }

    const account = await IAccount.findOne({username: req.body.username});
    if (!account) {
        console.log(`The user name ${req.body.username} does not exists ==> ${moment().format()}`);
        return res.status(400).send("The user name or password is incorrect");
    }

    const validPass = await bcrypt.compare(req.body.password, account.password);
    if (!validPass) {
        console.log(`The password is incorrect ==> ${moment().format()}`);
        return res.status(400).send("The user name or password is incorrect");
    }
    console.log(`Logged in ==> ${moment().format()}`);
    const token = jwt.sign({_id: account._id}, "nnnaaahdyll");

    new IWhitelist({token}).save();
    
    res.header('auth-token', token).send(token);
})

router.get('/isUsernameExists/:username', async (req: Request, res: Response) => {
    console.log(`Is username ${req.params.username} exists ==> ${moment().format()}`);
    const account = await IAccount.findOne({username: req.params.username});
    if (account) {
        console.log(`Username ${req.params.username} exists ==> ${moment().format()}`);
        return res.status(400).send('The user name already exists');
    }
    console.log(`Username ${req.params.username} does not exists ==> ${moment().format()}`);
    res.sendStatus(200);
})

export default router;