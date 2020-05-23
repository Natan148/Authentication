import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import blacklist from 'blacklist';

// Import routs
import accountsRoute from './routes/accounts.router';
import actionsRoute from './routes/actions.router';

mongoose.connect(
    "mongodb://localhost:27017/bank",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to db")
)

const app = express();
app.use(express.json());
app.use(cors());
app.use('/accounts', accountsRoute);
app.use('/actions', actionsRoute);

app.get('/', (req: Request, res: Response) => {
    res.send("Bank");
})

app.get('/natan', (req: Request, res: Response) => {
    res.send('natan')
})

app.listen(4000, () => console.log('Server running...'));