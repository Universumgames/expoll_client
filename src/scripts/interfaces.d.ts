export declare type tUserID = number;
export declare type tPollID = string;
export declare type tOptionId = number;
export declare type tDate = Date;
export declare type tDateTime = Date;
export declare enum ReturnCode {
    OK = 200,
    BAD_REQUEST = 400,
    MISSING_PARAMS = 400,
    INVALID_PARAMS = 400,
    UNAUTHORIZED = 401,
    INVALID_LOGIN_KEY = 401,
    NOT_ACCEPTABLE = 406,
    CONFLICT = 409,
    INVALID_TYPE = 409,
    INTERNAL_SERVER_ERROR = 500
}
export interface ISession {
    key: string;
    expiration: tDateTime;
    user: IUser;
}
export interface IUser {
    id: tUserID;
    username: string;
    firstName: string;
    lastName: string;
    mail: string;
    polls: IPoll[];
    votes: IVote[];
    sessions: ISession[];
    admin: boolean;
}
export declare enum PollType {
    String = 0,
    Date = 1,
    DateTime = 2
}
export interface IPoll {
    admin: IUser;
    id: tPollID;
    name: string;
    created: Date;
    updated: Date;
    description: string;
    type: PollType;
    votes: IVote[];
    maxPerUserVoteCount: number;
}
export interface IPollOption {
    poll: IPoll;
    id: tOptionId;
}
export interface IPollOptionString extends IPollOption {
    value: string;
}
export interface IPollOptionDate extends IPollOption {
    dateStart: Date;
    dateEnd?: Date;
}
export interface IPollOptionDateTime extends IPollOption {
    dateTimeStart: Date;
    dateTimeEnd?: Date;
}
export interface IVote {
    id: number;
    user: IUser;
    poll: IPoll;
    optionID: tOptionId;
    votedFor: boolean;
}
//# sourceMappingURL=interfaces.d.ts.map