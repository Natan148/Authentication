"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BankExceptions;
(function (BankExceptions) {
    BankExceptions[BankExceptions["BAD_USERNAME"] = 0] = "BAD_USERNAME";
    BankExceptions[BankExceptions["AUTHENTICATION_FAILED"] = 1] = "AUTHENTICATION_FAILED";
})(BankExceptions = exports.BankExceptions || (exports.BankExceptions = {}));
;
var AccountIdentifier;
(function (AccountIdentifier) {
    AccountIdentifier[AccountIdentifier["BY_ID"] = 0] = "BY_ID";
    AccountIdentifier[AccountIdentifier["BY_USERNAME"] = 1] = "BY_USERNAME";
})(AccountIdentifier = exports.AccountIdentifier || (exports.AccountIdentifier = {}));
;
