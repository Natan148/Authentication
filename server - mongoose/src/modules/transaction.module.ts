import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  date: Date;
  sumOfTransaction: number;
  balanceAfterTransaction: number;
}

const Transaction: Schema = new Schema({
  date: { type: Date, default: Date.now() },
  sumOfTransaction: { type: Number, required: true },
  balanceAfterTransaction: { type: Number, required: true }
});

export default mongoose.model<ITransaction>('Transaction', Transaction);