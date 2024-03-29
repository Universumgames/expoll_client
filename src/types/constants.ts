/* eslint-disable no-unused-vars */
export type tUserID = string
export type tPollID = string
export type tOptionId = number
export type tDate = number
export type tDateTime = number

export enum ReturnCode {
    OK = 200,
    BAD_REQUEST = 400,
    MISSING_PARAMS = 400,
    INVALID_PARAMS = 400,
    UNAUTHORIZED = 401,
    INVALID_LOGIN_KEY = 401,
    INVALID_CHALLENGE_RESPONSE = 401,
    CAPTCHA_INVALID = 401,
    FORBIDDEN = 403,
    CHANGE_NOT_ALLOWED = 403,
    NOT_ACCEPTABLE = 406,
    USER_EXISTS = 406,
    CONFLICT = 409,
    INVALID_TYPE = 409,
    PAYLOAD_TOO_LARGE = 413,
    TOO_MANY_POLLS = 413,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501
}