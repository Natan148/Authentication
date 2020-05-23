"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BankActions_1 = require("./BankActions");
const URL = "mongodb://localhost:27017/";
const app = express_1.default();
const bank = new BankActions_1.BankActions(URL, 'bank', 'accounts');
app.use(express_1.default.json());
app.get('/login/:username/:password', (req, res) => {
    bank.login(req.params.username, req.params.password)
        .then(() => res.send('logged in'))
        .catch(err => res.send('error'));
});
app.get('/register', (req, res) => {
    let newAccount = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        status: "active",
        balance: req.body.balance,
        mailAddress: req.body.mailAddress,
        userName: req.body.userName,
        password: req.body.password,
        transactionsHistory: []
    };
    bank.register(newAccount)
        .then(() => res.sendStatus(200))
        .catch(() => res.status(400).send("One or more of the account details are invalid"));
});
app.listen(5000, () => console.log('Server running...'));
