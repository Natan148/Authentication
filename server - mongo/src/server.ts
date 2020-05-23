import express, { Application, Request, Response, NextFunction } from 'express';
import { BankActions } from './BankActions';
import { TransactionInterface, AccountInterface, DBHandlerInterface, BankExceptions, AccountIdentifier } from "./Interfaces.f";

const URL = "mongodb://localhost:27017/";
const app: Application = express();
const bank = new BankActions(URL, 'bank', 'accounts');

app.use(express.json());

const loginRequire = (req: Request, res: Response, next: NextFunction) => {
    next()
}

app.use(loginRequire)

app.get('/login/:username/:password', (req: Request, res: Response) => {
    bank.login(req.params.username, req.params.password)
    .then(() => res.sendStatus(200))
    .catch(err => res.status(err.status).send(err))
})

app.post('/register', (req: Request, res: Response) => {
    let newAccount: AccountInterface = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        status: "active",
        balance: req.body.balance,
        mailAddress: req.body.mailAddress,
        userName: req.body.userName,
        password: req.body.password,
        transactionsHistory: []
    }
    bank.register(newAccount)
    .then(() => res.sendStatus(200))
    .catch(err => res.status(err.status).send(err))
})

app.get('/accountById/:id', (req: Request, res: Response) => {
    bank.getAccount(req.params.id, AccountIdentifier.BY_ID)
    .then(account => res.send(account))
    .catch(err => res.status(err.status).send(err));
})

app.get('/accountByUsername/:username', (req: Request, res: Response) => {
    bank.getAccount(req.params.username, AccountIdentifier.BY_USERNAME)
    .then(account => res.send(account))
    .catch(err => res.status(err.status). send(err));
})

app.get('/accounts', (req: Request, res: Response) => {
    bank.getAllAccounts()
    .then(accounts => res.send(accounts))
    .catch(err => res.status(err.status).send(err));
})

app.delete('/delAccount/:id/:password', (req: Request, res: Response) => {
    bank.delAccount(req.params.id, req.params.password)
    .then(() => res.sendStatus(200))
    .catch(err => res.status(err.status).send(err));
})

app.put('/addMoney/:id/:sumToAdd', (req: Request, res: Response) => {
    if (isNaN(+req.params.sumToAdd)) {
        res.status(400).send({status: 400, msg: 'The sum must be a number'});
        return;
    }
    bank.addMoney(req.params.id, +parseInt(req.params.sumToAdd).toFixed(2))
    .then(() => res.sendStatus(200))
    .catch(err => res.status(err.status).send(err));
})

app.put('/withdrawMoney/:id/:sumToWithdraw', (req: Request, res: Response) => {
    if (!/^-{0,1}\d+$/.test(req.params.sumToWithdraw)) {
        res.status(400).send({status: 400, msg: 'The sum must be a number'});
        return;
    }
    bank.withdrawMoney(req.params.id, +parseInt(req.params.sumToWithdraw).toFixed(2))
    .then(() => res.sendStatus(200))
    .catch(err => res.status(err.status).send(err));
})

app.listen(5000, () => console.log('Server running...'));