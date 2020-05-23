import { Router, Request, Response, NextFunction } from 'express';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../verifyToken';
import { passwordValidation, usernameValidation } from '../validations';
import IAccount from '../modules/account.module';
import IWhitelist from '../modules/whitelist.module';
import { resolve } from 'dns';

const router = Router();
const VERIFY_STRING = "nnnaaahdyll";

router.get('/balance', verifyToken, async (req: Request, res: Response) => {
    console.log(`Try get balance ==> ${moment().format()}`);
    const token = req.header('auth-token');
    if (token) {
        const id = jwt.verify(token, VERIFY_STRING);
        getBalance(id)
        .then(balance =>{
            console.log(`Get balance ${balance} ==> ${moment().format()}`);
            res.send(balance)
        })
        .catch(err => res.status(500).send(err));
    }
})

router.put('/updateBalance/:sum', verifyToken,  (req: Request, res: Response) => {
    const token = req.header('auth-token');
    const sumToUpdate = +req.params.sum;
    console.log(`Try update balance with sum ${sumToUpdate} ==> ${moment().format()}`);
    if (isNaN(sumToUpdate)) return res.status(400).send('Sum must be a number');

    if (token) {
        const id = jwt.verify(token, VERIFY_STRING);
        getBalance(id)
        .then(currBalance => {
            if ((+currBalance + sumToUpdate) < 0) {
                console.log(`There is not enough balance ==> ${moment().format()}`);
                return res.status(400).send('There is not enough balance in the account');
            };
            IAccount.findOneAndUpdate({ _id: id }, { balance: +currBalance + sumToUpdate }, 
                (err, doc) => {
                    if (err) return res.status(500).send(err.message);
                    console.log(`The balance updated successfully ==> ${moment().format()}`);
                    res.sendStatus(200); 
                });
        })
        .catch(err => res.status(500).send(err))
    }
})

router.put('changePass', (req: Request, res: Response) => {
    const details = req.body;
    
})

router.post('/logout', verifyToken, async (req: Request, res: Response) => {
    console.log(`logout with token ${req.header('auth-token')} ==> ${moment().format()}`);
    let result = await IWhitelist.deleteOne({token: req.header('auth-token')});
    res.status(200).send(result);
})

const getBalance = (id: string | object,): Promise<string> => {
    return new Promise<string> 
    ((resolve: (balance: string) => void, reject: (err: string) => void) => {
        IAccount.findById(id, (err, doc) => {
            if (err) return reject(err.message);
            if (doc) resolve(doc.balance.toString())
        });
    })
}

export default router;