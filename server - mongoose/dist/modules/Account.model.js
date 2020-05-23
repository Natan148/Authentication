"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const Account = new mongoose_1.Schema({
    firstName: { type: String, required: true, min: 2, max: 255 },
    lastName: { type: String, required: true, min: 2, max: 255 },
    username: { type: String, required: true, min: 4, max: 255 },
    password: { type: String, required: true, min: 8, max: 255 },
    balance: { type: Number, default: 0 },
    email: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now() },
    transactionsHistory: { type: Array(), default: [] }
});
exports.default = mongoose_1.default.model('Account', Account);
