import { MongoClient, ObjectID } from 'mongodb';
import moment from 'moment'
import { TransactionInterface, DBHandlerInterface, AccountInterface, AccountIdentifier } 
from "./Interfaces.f";
import { resolve } from 'dns';

const URL = "mongodb://localhost:27017/";

export class MongoBank implements DBHandlerInterface {
    dbUrl: string;
    dbName: string;
    collectionName: string;

    constructor(url: string, dbName:string, collectionName: string) {
        this.dbUrl = url;
        this.dbName = dbName;
        this.collectionName = collectionName;
    }
    
    addAccount = (accountDetails: AccountInterface): Promise<void> => {
        return new Promise<void>
        ((resolve: () => void, reject: (err: {status: number, msg: string}) => void) => {
            MongoClient.connect(this.dbUrl, (err, db) => {
                if (err) {reject({status: 500, msg: err.message})};
                var dbo = db.db(this.dbName);
                dbo.collection(this.collectionName).insertOne(accountDetails, (err, res) => {
                  if (err) {reject({status: 500, msg: err.message})};
                  resolve();
                  db.close();
                });
            });
        })
    };

    delAccount = (id: string): Promise<void> => {
        return new Promise<void> 
        ((resolve: () => void, reject: (err: {status: number, msg: string}) => void) => {
            MongoClient.connect(this.dbUrl, (err, db) => {
                if (err) reject({status: 500, msg: err.message});
                const dbo = db.db(this.dbName);
                
                if (ObjectID.isValid(id)) {
                    dbo.collection(this.collectionName).deleteOne({ _id: new ObjectID(id) }, (err, obj) => {
                      if (err) reject({status: 500, msg: err.message});
                      resolve()
                      db.close();
                    });
                } else reject({status: 400, msg: 'Bad id'});
            });
        })
    };

    updateBalance = (id: string, sumToUpdate: number): Promise<void> => {
        return new Promise<void> 
        ((resolve: () => void, reject: (err: {status: number, msg: string}) => void) => {
            MongoClient.connect(this.dbUrl, (err, db) => {
                if (err) reject({status: 500, msg:err.message});
                var dbo = db.db(this.dbName);
                this.getBalance(id)
                .then(currBalance => {
                    if (ObjectID.isValid(id)) {
                        var myquery = { _id: new ObjectID(id) };
                        var newvalues = { $set: {balance: currBalance + sumToUpdate } };
                        dbo.collection(this.collectionName).updateOne(myquery, newvalues, (err, res) => {
                          if (err) reject({status: 500, msg:err.message});
                          db.close();
                          this.updateTransactionsHistory(id, sumToUpdate)
                          .then(() => resolve())
                        });
                    } else reject({status: 400, msg: 'Bad id'})
                });
              });
        })
    };

    updateTransactionsHistory = (id: string, sumOfTransaction: number): Promise<void> => {
        return new Promise<void>
        ((resolve: () => void, reject: (err: {status: number, msg: string}) => void) => {
            MongoClient.connect(this.dbUrl, (err, db) => {
                if (err) reject({status: 500, msg: err.message});
                let dbo = db.db(this.dbName);
                this.getTransactions(id).then(transactions => {
                    this.getBalance(id).then(balance => {
                        let newTransactions: TransactionInterface = {
                            date: moment().format("MMM Do YYYY"),
                            time: moment().format('h:mm:ss a'),
                            sumOfTransaction: sumOfTransaction,
                            balanceAfterTransaction: balance
                        }
                        if (ObjectID.isValid(id)) {
                            var myquery = { _id: new ObjectID(id) };
                            var newvalues = { $set: { transactionsHistory: [...transactions,  newTransactions] } };
                            dbo.collection(this.collectionName).updateOne(myquery, newvalues, (err, res) => {
                              if (err) reject({status: 500, msg: err.message});
                              console.log(`The transactions account ${id} updated ==> ${moment().format()}`);
                              db.close();
                              resolve()
                            });
                        } else reject({status: 400, msg: 'Bad id'})
                    })
                    .catch(err => {reject(err)})
                })
                .catch(err => {reject(err)});
              });
        })
    }

    getBalance = (id: string): Promise<number> => {
        return new Promise<number>
        ((resolve: (balance: number) => void,
         reject: (err: {status: number, msg: string}) => void) => {
            this.getAccount(id, AccountIdentifier.BY_ID)
            .then(account => resolve(+account.balance))
            .catch(err => reject(err))
        })
    };

    getAccount = (identifier: string, identifierType: AccountIdentifier): Promise<AccountInterface> => {
        return new Promise<AccountInterface>
        ((resolve: (account: AccountInterface) => void, reject: (err: {status: number, msg: string}) => void) => {
            MongoClient.connect(this.dbUrl, (err, db) => {
                if (err) {reject({status: 500, msg: err.message})};
                var dbo = db.db(this.dbName);
                let id: undefined | ObjectID;
                if (identifierType === AccountIdentifier.BY_ID) {
                    if (ObjectID.isValid(identifier)) {
                        id = new ObjectID(identifier);
                    } else {
                        reject({status: 400, msg: 'Bad id'});
                        return;
                    }
                }
                let query: any = {};
                let queryKey = id ? '_id' : 'userName';
                query[queryKey] = id ? id : identifier;
                dbo.collection(this.collectionName).findOne(query, (err, result) => {
                    if (err) reject({status: 500, msg: err.message});
                    let account: AccountInterface = result;
                    db.close();
                    if (account === null) reject({status: 400, msg: `Can not find identifier - ${identifier}`});
                    resolve(account)
                });
            }); 
        })
    }

    getAllAccounts = (): Promise<AccountInterface[]> => {
        return new Promise<AccountInterface[] | never>
        ((resolve: (accounts: AccountInterface[]) => void,
         reject: (err: {status: number, msg: string}) => void) => {
            MongoClient.connect(this.dbUrl, (err, db) => {
                if (err) reject({status: 500, msg: err.message});
                var dbo = db.db(this.dbName);
                dbo.collection(this.collectionName).find({}).toArray((err, result) => {
                  if (err) reject({status: 500, msg: err.message});
                  resolve(result);
                  db.close();
                });
            });
        });
    }

    getTransactions = (id: string): Promise<TransactionInterface[]> => {
        return new Promise<TransactionInterface[] | never>
        ((resolve: (transactions: TransactionInterface[]) => void,
         reject: (err: {status: number, msg: string}) => void) => {
            this.getAccount(id, AccountIdentifier.BY_ID)
            .then(account => resolve(account.transactionsHistory))
            .catch(err => reject(err))
        })
    };

    isUserNameExists = (userName: string): Promise<boolean> => {
        return new Promise<boolean>
        ((resolve: (isExists: boolean) => void,
         reject: (err: {status: number, msg: string}) => void) => {
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
        })
    }

    isIdValid = (id: string): Promise<boolean> => {
        return new Promise<boolean>((resolve: (isValid: boolean) => void) => {
            if (ObjectID.isValid(id)) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }
}

const account = {
    firstName: 'nachman',
    lastName: 'sheena',
    status: 'active',
    balance: 34,
    mailAddress: 'natan@gmail.com',
    userName: 'natansheena',
    password: '1234',
    transactionsHistory: []
}
// const id = '5ea15ebbe3e5ed481cfa4951';

const bank = new MongoBank(URL, 'bank', 'accounts');

// bank.isUserNameExists('natansheena')
// .then(isExists => console.log(isExists))
// .catch(err => console.log(err))
// bank.getAllAccounts().then(accounts => console.log(accounts))