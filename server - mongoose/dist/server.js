"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
// Import routs
const accountsRoute = __importStar(require("./routes/accounts"));
mongoose_1.default.connect("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Connected to db"));
const app = express_1.default();
app.use('/accounts', accountsRoute);
app.get('/', (req, res) => {
    res.send("Bank");
});
app.listen(4000, () => console.log('Server running...'));
