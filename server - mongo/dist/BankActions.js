"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MongoBank_1 = require("./MongoBank");
const moment_1 = __importDefault(require("moment"));
const Interfaces_f_1 = require("./Interfaces.f");
const PASS_MIN_LENGTH = 5;
const PASS_MAX_LENGTH = 10;
const SUM_MAX_DIGITS = 6;
class BankActions {
    constructor(url, dbName, collectionName) {
        this.register = (accountDetails) => {
            return new Promise((resolve, rejects) => {
                console.log(`Try to register a new account: ${accountDetails} ==> ${moment_1.default().format()}`);
                this.areAccountDetailsValid(accountDetails, areValid => {
                    if (!areValid) {
                        console.log('One of the details is invalid.');
                        rejects({ msg: `One of the details is invalid ==> ${moment_1.default().format()}` });
                        return;
                    }
                    this.bankDB.addAccount(accountDetails);
                    console.log(`The account was added to the db ==> ${moment_1.default().format()}`);
                    resolve();
                });
            });
        };
        this.login = (userName, password) => {
            console.log(`Try to login with username ${userName} and pass ${password} ==> ${moment_1.default().format()}`);
            return new Promise((resolve, reject) => {
                this.isUserNameExists(userName, isExist => {
                    if (!isExist) {
                        console.log(`The username ${userName} does not exist ==> ${moment_1.default().format()}`);
                        reject(Interfaces_f_1.BankExceptions.BAD_USERNAME);
                        return;
                    }
                    this.accountAuthentication(userName, password, Interfaces_f_1.AccountIdentifier.BY_USERNAME, result => {
                        if (result) {
                            console.log('Logged in successfully ==> ' + moment_1.default().format());
                            resolve();
                        }
                        else {
                            console.log('The password is incorrect ==> ' + moment_1.default().format());
                            reject(Interfaces_f_1.BankExceptions.AUTHENTICATION_FAILED);
                        }
                    });
                });
            });
        };
        this.getAccount = (identifier, identifierType) => {
            return new Promise((resolve, reject) => {
                this.bankDB.getAccount(identifier, identifierType)
                    .then(account => resolve(account))
                    .catch(errMsg => reject(errMsg));
            });
        };
        this.getAllAccounts = () => {
            return new Promise((resolve, reject) => {
                this.bankDB.getAllAccounts()
                    .then(accounts => resolve(accounts))
                    .catch(errMsg => reject(errMsg));
            });
        };
        this.addMoney = (id, sumToAdd) => {
            this.bankDB.updateBalance(id, sumToAdd);
            console.log(`Add money ${sumToAdd} to account id ==> ${moment_1.default().format()}`);
        };
        this.withdrawMoney = (id, sumToWithdraw) => {
            this.bankDB.updateBalance(id, sumToWithdraw * -1);
            console.log(`Withdraw money ${sumToWithdraw} to account id ==> ${moment_1.default().format()}`);
        };
        this.getTransactions = (id, callback) => {
            console.log(`Try to get transactions with id ${id} ==> ${moment_1.default().format()}`);
            this.getTransactions(id, transactions => {
                console.log(`Get transactions ${transactions}`);
                callback(transactions);
            });
        };
        this.accountAuthentication = (identifier, password, identifierType, callback) => {
            if (identifierType === Interfaces_f_1.AccountIdentifier.BY_USERNAME) {
                this.bankDB.getAccount(identifier, Interfaces_f_1.AccountIdentifier.BY_USERNAME)
                    .then(account => {
                    callback(account.password === password);
                });
            }
            else {
                this.bankDB.getAccount(identifier, Interfaces_f_1.AccountIdentifier.BY_ID)
                    .then(account => {
                    callback(account.password === password);
                });
            }
        };
        this.areAccountDetailsValid = (accountDetails, callback) => {
            this.isUserNameExists(accountDetails.userName, (isUserNameExist => {
                this.isPasswordValid(accountDetails.password, isPassValid => {
                    callback(!(typeof accountDetails.firstName !== 'string' ||
                        accountDetails.firstName.length === 0 ||
                        typeof accountDetails.lastName !== 'string' ||
                        accountDetails.lastName.length === 0 ||
                        typeof accountDetails.balance !== 'number' ||
                        accountDetails.balance < 0 ||
                        accountDetails.balance.toString().length > SUM_MAX_DIGITS ||
                        isUserNameExist ||
                        !isPassValid));
                });
            }));
        };
        this.isUserNameExists = (userName, callback) => {
            this.bankDB.isUserNameExists(userName)
                .then(userNameExistence => callback(userNameExistence))
                .catch(err => { throw err; });
        };
        this.isPasswordValid = (password, callback) => {
            callback(!(typeof password !== 'string' ||
                password.length < PASS_MIN_LENGTH ||
                password.length > PASS_MAX_LENGTH));
        };
        this.test = () => {
            const account = {
                firstName: 'nachman',
                lastName: 'sheena',
                status: 'active',
                balance: 34,
                mailAddress: 'natan@gmail.com',
                userName: 'natansheenas',
                password: '122247',
                transactionsHistory: []
            };
            this.register(account).catch(err => console.log(err));
        };
        this.bankDB = new MongoBank_1.MongoBank(url, dbName, collectionName);
    }
}
exports.BankActions = BankActions;
const URL = "mongodb://localhost:27017/";
const bank = new BankActions(URL, 'bank', 'accounts');
// bank.isUserNameExists('natansheena', exist => console.log(exist))
// bank.isPasswordValid('n333n', isValid => console.log(isValid))
// bank.login('natansheena', '12334')
// .then(() => console.log('logged in'))
// .catch((err) => console.log(err))
