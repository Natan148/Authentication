"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const moment_1 = __importDefault(require("moment"));
const Interfaces_f_1 = require("./Interfaces.f");
const URL = "mongodb://localhost:27017/";
class MongoBank {
    constructor(url, dbName, collectionName) {
        this.addAccount = (accountDetails) => {
            return new Promise((resolve, reject) => {
                mongodb_1.MongoClient.connect(this.dbUrl, (err, db) => {
                    if (err) {
                        reject(err.message);
                    }
                    ;
                    var dbo = db.db(this.dbName);
                    dbo.collection(this.collectionName).insertOne(accountDetails, (err, res) => {
                        if (err) {
                            reject(err.message);
                        }
                        ;
                        resolve();
                        db.close();
                    });
                });
            });
        };
        this.delAccount = (id) => {
            return new Promise((resolve, reject) => {
                mongodb_1.MongoClient.connect(this.dbUrl, (err, db) => {
                    if (err)
                        reject(err.message);
                    const dbo = db.db(this.dbName);
                    dbo.collection(this.collectionName).deleteOne({ _id: new mongodb_1.ObjectID(id) }, (err, obj) => {
                        if (err)
                            reject(err.message);
                        resolve();
                        db.close();
                    });
                });
            });
        };
        this.updateBalance = (id, sumToUpdate) => {
            return new Promise((resolve, reject) => {
                mongodb_1.MongoClient.connect(this.dbUrl, (err, db) => {
                    if (err)
                        reject(err.message);
                    var dbo = db.db(this.dbName);
                    this.getBalance(id)
                        .then(currBalance => {
                        var myquery = { _id: new mongodb_1.ObjectID(id) };
                        var newvalues = { $set: { balance: currBalance + sumToUpdate } };
                        dbo.collection(this.collectionName).updateOne(myquery, newvalues, (err, res) => {
                            if (err)
                                reject(err.message);
                            db.close();
                            this.updateTransactionsHistory(id, sumToUpdate)
                                .then(() => resolve());
                        });
                    });
                });
            });
        };
        this.updateTransactionsHistory = (id, sumOfTransaction) => {
            return new Promise((resolve, reject) => {
                mongodb_1.MongoClient.connect(this.dbUrl, (err, db) => {
                    if (err)
                        reject(err.message);
                    let dbo = db.db(this.dbName);
                    this.getTransactions(id).then(transactions => {
                        this.getBalance(id).then(balance => {
                            let newTransactions = {
                                date: moment_1.default().format("MMM Do YYYY"),
                                time: moment_1.default().format('h:mm:ss a'),
                                sumOfTransaction: sumOfTransaction,
                                balanceAfterTransaction: balance
                            };
                            var myquery = { _id: new mongodb_1.ObjectID(id) };
                            var newvalues = { $set: { transactionsHistory: [...transactions, newTransactions] } };
                            dbo.collection(this.collectionName).updateOne(myquery, newvalues, (err, res) => {
                                if (err)
                                    reject(err.message);
                                console.log(`The transactions account ${id} updated ==> ${moment_1.default().format()}`);
                                db.close();
                                resolve();
                            });
                        })
                            .catch(err => { reject(err); });
                    })
                        .catch(err => { reject(err); });
                });
            });
        };
        this.getBalance = (id) => {
            return new Promise((resolve, reject) => {
                this.getAccount(id, Interfaces_f_1.AccountIdentifier.BY_ID)
                    .then(account => resolve(+account.balance))
                    .catch(err => reject(err));
            });
        };
        this.getAccount = (identifier, identifierType) => {
            return new Promise((resolve, reject) => {
                mongodb_1.MongoClient.connect(this.dbUrl, (err, db) => {
                    if (err) {
                        reject(err.message);
                    }
                    ;
                    var dbo = db.db(this.dbName);
                    let query = {};
                    let queryKey = identifierType === Interfaces_f_1.AccountIdentifier.BY_ID ? '_id' : 'userName';
                    query[queryKey] = identifierType === Interfaces_f_1.AccountIdentifier.BY_ID ? new mongodb_1.ObjectID(identifier)
                        : identifier;
                    dbo.collection(this.collectionName).findOne(query, (err, result) => {
                        if (err)
                            reject(err.message);
                        let account = result;
                        db.close();
                        if (account === null)
                            reject(`Can not find identifier - ${identifier}`);
                        resolve(account);
                    });
                });
            });
        };
        this.getAllAccounts = () => {
            return new Promise((resolve, reject) => {
                mongodb_1.MongoClient.connect(this.dbUrl, (err, db) => {
                    if (err)
                        reject(err.message);
                    var dbo = db.db(this.dbName);
                    dbo.collection(this.collectionName).find({}).toArray((err, result) => {
                        if (err)
                            reject(err.message);
                        resolve(result);
                        db.close();
                    });
                });
            });
        };
        this.getTransactions = (id) => {
            return new Promise((resolve, reject) => {
                this.getAccount(id, Interfaces_f_1.AccountIdentifier.BY_ID)
                    .then(account => resolve(account.transactionsHistory))
                    .catch(err => reject(err));
            });
        };
        this.isUserNameExists = (userName) => {
            return new Promise((resolve, reject) => {
                this.getAllAccounts()
                    .then(accounts => {
                    let isExists = false;
                    accounts.forEach(account => {
                        if (account.userName === userName) {
                            isExists = true;
                        }
                    });
                    resolve(isExists);
                })
                    .catch(err => reject(err));
            });
        };
        this.dbUrl = url;
        this.dbName = dbName;
        this.collectionName = collectionName;
    }
}
exports.MongoBank = MongoBank;
const account = {
    firstName: 'nachman',
    lastName: 'sheena',
    status: 'active',
    balance: 34,
    mailAddress: 'natan@gmail.com',
    userName: 'natansheena',
    password: '1234',
    transactionsHistory: []
};
const id = '5ea15ebbe3e5ed481cfa4951';
const bank = new MongoBank(URL, 'bank', 'accounts');
// bank.isUserNameExists('natansheena')
// .then(isExists => console.log(isExists))
// .catch(err => console.log(err))
// bank.getAllAccounts().then(accounts => console.log(accounts))
