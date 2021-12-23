"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollType = exports.ReturnCode = void 0;
var ReturnCode;
(function (ReturnCode) {
    ReturnCode[ReturnCode["OK"] = 200] = "OK";
    ReturnCode[ReturnCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ReturnCode[ReturnCode["MISSING_PARAMS"] = 400] = "MISSING_PARAMS";
    ReturnCode[ReturnCode["INVALID_PARAMS"] = 400] = "INVALID_PARAMS";
    ReturnCode[ReturnCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ReturnCode[ReturnCode["INVALID_LOGIN_KEY"] = 401] = "INVALID_LOGIN_KEY";
    ReturnCode[ReturnCode["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    ReturnCode[ReturnCode["CONFLICT"] = 409] = "CONFLICT";
    ReturnCode[ReturnCode["INVALID_TYPE"] = 409] = "INVALID_TYPE";
    ReturnCode[ReturnCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(ReturnCode = exports.ReturnCode || (exports.ReturnCode = {}));
var PollType;
(function (PollType) {
    PollType[PollType["String"] = 0] = "String";
    PollType[PollType["Date"] = 1] = "Date";
    PollType[PollType["DateTime"] = 2] = "DateTime";
})(PollType = exports.PollType || (exports.PollType = {}));
//# sourceMappingURL=interfaces.js.map