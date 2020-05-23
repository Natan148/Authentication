import { MongoBank } from "./MongoBank";
import moment from 'moment';
import { TransactionInterface, AccountInterface, DBHandlerInterface, BankExceptions, AccountIdentifier } from "./Interfaces.f";
import { resolve } from "dns";
import { rejects } from "assert";
import { threadId } from "worker_threads";

const PASS_MIN_LENGTH = 5;
const PASS_MAX_LENGTH = 10;
const SUM_MAX_VAL = 100000;
const SUM_MAX_DIGITS_AFTER_POINT = 2;
 
export class BankActions {
    bankDB: DBHandlerInterface;
    
    constructor(url: string, dbName:string, collectionName: string) {
        this.bankDB = new MongoBank(url, dbName, collectionName);
    }

    register = (accountDetails: AccountInterface): Promise<void> => {
        return new Promise<void> 
        ((resolve: () => void, reject: (err: {status: number, msg: string}) => void) => {
            console.log(`Try to register a new account: ${accountDetails} ==> ${moment().format()}`);
            this.areAccountDetailsValid(accountDetails)
            .then(areValid => {
                if (!areValid) {
                    console.log('One of the details is invalid.');
                    reject({status: 400, msg: `One of the details is invalid`});
                    return;
                }
                this.bankDB.addAccount(accountDetails)
                .then(() => {
                    console.log(`The account was added to the db ==> ${moment().format()}`);
                    resolve()
                })
                .catch(errMsg => {
                    console.log(`There was an error: ${errMsg} ==> ${moment().format()}`);
                    reject({status: 500, msg: 'There was an error during the registration process'});
                })
            })
            .catch(err => reject(err));
        })
    }

    login = (userName: string, password: string): Promise<void> => {
        console.log(`Try to login with username ${userName} and pass ${password} ==> ${moment().format()}`)
        return new Promise<void>
        ((resolve: () => void, reject: (err: {status: number, msg: string}) => void) => {
            this.isUserNameExists(userName)
            .then(isExist => {
                if (!isExist) {
                    console.log(`The username ${userName} does not exist ==> ${moment().format()}`);
                    reject({status: 400, msg: 'The username or the password is incorrect'});
                    return;
                }
                this.accountAuthentication(userName, password, AccountIdentifier.BY_USERNAME)
                .then(result => {
                    if (result) {
                        console.log('Logged in successfully ==> ' + moment().format())
                        resolve()
                    } else {
                        console.log('The password is incorrect ==> ' + moment().format())
                        reject({status: 400, msg: 'The username or the password is incorrect'});
                    }
                })
            })
            .catch(err => reject(err));
        })
    }

    getAccount = (identifier: string, identifierType: AccountIdentifier): Promise<AccountInterface> => {
        console.log(`Try to get account with identifier ${identifier} ==> ${moment().format()}`);
        return new Promise<AccountInterface>
        ((resolve: (account: AccountInterface) => void, reject: (err: {status: number, msg: string}) => void) => {
            this.bankDB.getAccount(identifier, identifierType)
            .then(account => {
                console.log(`Get account successfully ==> ${moment().format()}`);
                resolve(account)
            })
            .catch(err => {
                console.log(`There was an error during getAccount: ${err} ==> ${moment().format()}`);
                reject(err)}
            );
        })
    }

    getAllAccounts = (): Promise<AccountInterface[]> => {
        console.log(`Try get all accounts ==> ${moment().format()}`);
        return new Promise<AccountInterface[]>
        ((resolve: (accounts: AccountInterface[]) => void, reject: (err: {status: number, msg: string}) => void) => {
            this.bankDB.getAllAccounts()
            .then(accounts => {
                console.log(`Get all account successfully ==> ${moment().format()}`);
                resolve(accounts)
            })
            .catch(err => {
                console.log(`There was an error during getAllAccounts ${err} ==> ${moment().format()}`);
                reject(err)}
            );
        })
    }

    delAccount = (id: string, password: string): Promise<void> => {
        console.log(`Try delete account with id ${id} and pass ${password} ==> ${moment().format()}`);
        return new Promise<void>
        ((resolve: () => void, reject: (err: {status: number, msg: string}) => void) => {
            this.accountAuthentication(id, password, AccountIdentifier.BY_ID)
            .then(result => {
                if (!result) {
                    console.log(`Authentication failed ==> ${moment().format()}`);
                    reject({status: 400, msg: 'The password is incorrect'});
                    return;
                }
                this.bankDB.delAccount(id)
                .then(() => {
                    console.log(`The account was deleted ==> ${moment().format()}`);
                    resolve();
                })
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        })
    }

    addMoney = (id: string, sumToAdd: number): Promise<void> => {
        console.log(`Try to add money with id ${id} and sum ${sumToAdd} ==> ${moment().format()}`);
        return new Promise<void>
        ((resolve: () => void, reject: (err: {status: number, msg: string}) => void) => {
            if (sumToAdd <= 0 || sumToAdd > SUM_MAX_VAL) {
                reject({status: 400, msg: `The sum must be bigger then 0 and less then ${SUM_MAX_VAL}`});
                return;
            }
            this.bankDB.updateBalance(id, sumToAdd)
            .then(() => {
                console.log(`Added money to account id ==> ${moment().format()}`)
                resolve();
            })
            .catch(err => {
                console.log(`There was an error: ${err} ==> ${moment().format()}`);
                reject(err);
            })
        })
    }

    withdrawMoney = (id: string, sumToWithdraw: number): Promise<void> => {
        console.log(`Try to withdraw money with id ${id} and sum ${sumToWithdraw} ==> ${moment().format()}`);
        return new Promise<void>
        ((resolve: () => void, reject: (err: {status: number, msg: string}) => void) => {
            this.bankDB.getBalance(id)
            .then(balance => {
                console.log(`The balance is ${balance} ==> ${moment().format()}`);
                if (balance < sumToWithdraw) {
                    reject({status: 400, msg: 'There is not enough balance'});
                    return;
                }
                if (sumToWithdraw <= 0 || sumToWithdraw > SUM_MAX_VAL) {
                    reject({status: 400, msg: `The sum must be bigger then 0 and less then ${SUM_MAX_VAL}`});
                    return;
                }
                this.bankDB.updateBalance(id, sumToWithdraw * -1)
                .then(() => {
                    console.log(`Withdrew money from account id ==> ${moment().format()}`);
                    resolve();
                })
                .catch(err => {
                    console.log(`There was an error: ${err} ==> ${moment().format()}`);
                    reject(err);
                })
            })
        })
    }

    getTransactions = (id: string): Promise<TransactionInterface[]> => {
        console.log(`Try to get transactions with id ${id} ==> ${moment().format()}`);
        return new Promise<TransactionInterface[]>
        ((resolve: (transactions: TransactionInterface[]) => void,
         reject: (err: {status: number, msg: string}) => void) => {
            this.getTransactions(id)
            .then(transactions => {
                console.log(`Get transactions successfully ${transactions} ==> ${moment().format()}`);
                resolve(transactions);
            })
            .catch(err => {
                console.log(`There was an error: ${err} ==> ${moment().format()}`);
                reject(err);
            })
        })
    }

    accountAuthentication = (identifier: string, password: string, identifierType: AccountIdentifier,
     ): Promise<boolean> => {   
        console.log(`Check account authentication with identifier 
        ${identifier} and pass ${password} ==> ${moment().format()}`);  
        return new Promise<boolean>
        ((resolve: (result: boolean) => void, reject: (err: {status: number, msg: string}) => void) => {
            this.bankDB.getAccount(identifier, identifierType)
            .then(account => {
                let result = account.password === password;
                console.log(`The authentication result is: ${result} ==> ${moment().format()}`);
                resolve(result);
            })
            .catch(err => {
                console.log(`There was an error during the authentication ${err} ==> ${moment().format()}`);
                reject(err);
            })
        })
    }

    areAccountDetailsValid = (accountDetails: AccountInterface): Promise<boolean> => {
        console.log(`Check if account details are valid ${accountDetails} ==> ${moment().format()}`);
        return new Promise<boolean>
        ((resolve: (areValid: boolean) => void, reject: (err: {status: number, msg: string}) => void) => {
            this.isUserNameExists(accountDetails.userName)
            .then(isUserNameExist => {
                this.isPasswordValid(accountDetails.password, isPassValid => {
                    resolve(!(typeof accountDetails.firstName !== 'string' ||
                    accountDetails.firstName.length === 0 ||
                    typeof accountDetails.lastName !== 'string' ||
                    accountDetails.lastName.length === 0 ||
                    typeof accountDetails.balance !== 'number' ||
                    accountDetails.balance < 0 ||
                    accountDetails.balance > SUM_MAX_VAL ||
                    isUserNameExist ||
                    !isPassValid))
                })
            })
            .catch(err => reject(err));
        })
    }

    isUserNameExists = (userName: string): Promise<boolean> => {
        console.log(`Check if username ${userName} exists ==> ${moment().format()}`);
        return new Promise<boolean>
        ((resolve: (isExist: boolean) => void, reject: (err: {status: number, msg: string}) => void) => {
            this.bankDB.isUserNameExists(userName)
            .then(userNameExistence => {
                console.log(`Is exists: ${userNameExistence} ==> ${moment().format()}`);
                resolve(userNameExistence)
            })
            .catch(err =>{
                console.log(`There was an error ${err} ==> ${moment().format()}`);
                reject(err)
            });
        });
    }

    isPasswordValid = (password: string, callback: (isValid: boolean) => any): void => {
        console.log(`Check validate of password ${password} ==> ${moment().format()}`);
        callback(!(typeof password !== 'string' ||
        password.length < PASS_MIN_LENGTH ||
        password.length > PASS_MAX_LENGTH))
    }

    test = () => {
        const account: AccountInterface = {
            firstName: 'nachman',
            lastName: 'sheena',
            status: 'active',
            balance: 34,
            mailAddress: 'natan@gmail.com',
            userName: 'natansheenas',
            password: '122247',
            transactionsHistory: []
        }

        this.register(account).catch(err => console.log(err));
    }
}

const URL = "mongodb://localhost:27017/";

const bank = new BankActions(URL, 'bank', 'accounts');

// bank.isUserNameExists('natansheena', exist => console.log(exist))
// bank.isPasswordValid('n333n', isValid => console.log(isValid))
// bank.login('natansheena', '12334')
// .then(() => console.log('logged in'))
// .catch((err) => console.log(err))