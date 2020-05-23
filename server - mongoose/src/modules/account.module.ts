import mongoose, { Schema, Document } from 'mongoose';
import { ITransaction } from './transaction.module';

export interface IAccount extends Document {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    balance: number;
    email: string;
    date: Date;
}

const Account: Schema = new Schema({
    firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
    lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
    username: { type: String, required: true, minlength: 4, max: 50, unique: true },
    password: { type: String, required: true, minlength : 6 },
    balance: { type: Number, required: true },
    email: { type: String, required: true },
    date: { type: Date, default: Date.now() },
    transactionsHistory: { type: Array<ITransaction>(), default: [] }
});

export default mongoose.model<IAccount>('Account', Account);