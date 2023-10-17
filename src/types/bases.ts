import { tDateTime, tOptionId, tPollID, tUserID } from "@/types/constants"

export interface ISession {
    loginKey: string
    expiration: tDateTime
    userAgent: string
    user: IUser
}

/**
 * User object storing all user data
 */
export interface IUser {
    id: tUserID
    username: string
    firstName: string
    lastName: string
    mail: string
    polls: IPoll[]
    votes: IVote[]
    sessions: ISession[]
    admin: boolean,
    createdTimestamp: tDateTime
}

/* eslint-disable no-unused-vars */
export enum PollType {
    String = 0,
    Date = 1,
    DateTime = 2
}

/**
 * Poll meta data, except vote options and votes
 */
export interface IPoll {
    admin: IUser
    id: tPollID
    name: string
    created: Date
    updated: Date
    description: string
    type: PollType
    votes: IVote[]

    maxPerUserVoteCount: number
    allowsMaybe: boolean
    allowsEditing: boolean
}

/**
 * Base class for a poll option to vote for
 */
export interface IPollOption {
    poll: IPoll
    id: tOptionId
}

/**
 * Poll option for a poll with strings
 */
export interface IPollOptionString extends IPollOption {
    value: string
}

/**
 * Poll Option with date (end optional)
 */
export interface IPollOptionDate extends IPollOption {
    dateStart: Date
    dateEnd?: Date
}

/**
 * Poll option wht datetime (end optional)
 */
export interface IPollOptionDateTime extends IPollOption {
    dateTimeStart: Date
    dateTimeEnd?: Date
}

/**
 * Vote object
 */
export interface IVote {
    id: number
    user: IUser
    poll: IPoll
    optionID: tOptionId
    votedFor: VoteValue
}

export enum VoteValue {
    no = 0,
    yes = 1,
    maybe = 2
}

export interface IPollUserNote {
    user: IUser
    poll: IPoll
    note: string
}