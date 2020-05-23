import mongoose, { Schema, Document } from 'mongoose';

export interface IWhitelist extends Document {
  token: string;
  date: Date;
}

const Whitelist: Schema = new Schema({
  token: {type: String, required: true, unique: true},
  date: { type: Date, default: Date.now() },
});

export default mongoose.model<IWhitelist>('Whitelist', Whitelist);