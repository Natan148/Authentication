export enum BankExceptions { BAD_USERNAME, AUTHENTICATION_FAILED };

export enum AccountIdentifier { BY_ID, BY_USERNAME };

export interface TransactionInterface {
    date: string;
    time: string;
    sumOfTransaction: number;
    balanceAfterTransaction: number;
}

export interface AccountInterface {
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    status: string;
    mailAddress: string;
    balance: number;
    transactionsHistory: TransactionInterface[];
}

export interface DBHandlerInterface {
    addAccount: (accountDetails: AccountInterface) => Promise<void>;
    delAccount: (id: string) => Promise<void>;
    updateBalance: (id: string, sumToUpdate: number) => Promise<void>;
    getBalance: (id: string) => Promise<number>;
    getAccount: (identifier: string, identifierType: AccountIdentifier) => Promise<AccountInterface>
    getAllAccounts: () => Promise<AccountInterface[]>;
    getTransactions: (id: string) => Promise<TransactionInterface[]>;
    isUserNameExists: (userName: string) => Promise<boolean>;
}