import { PollType, tDate, tDateTime, tOptionId, tPollID, tUserID } from "./interfaces"

export interface ComplexOption {
    id?: number
    value?: string
    dateStart?: tDate
    dateEnd?: tDate
    dateTimeStart?: tDateTime
    dateTimeEnd?: tDateTime
}

export const empty = {
    id: 0,
    value: "",
    dateStart: new Date(),
    dateEnd: undefined,
    dateTimeStart: new Date(),
    dateTimeEnd: undefined
} as ComplexOption

interface SimpleUser {
    id: tUserID
    firstName: string
    lastName: string
    username: string
}

export interface DetailedPoll {
    pollID: tPollID
    admin: SimpleUser
    name: string
    description: string
    userCount: number
    lastUpdated: Date
    created: Date
    type: PollType
    options: any[]
    userVotes: {
        user: SimpleUser
        votes: simpleVote[]
    }[]
}

export interface simpleVote {
    optionID: tOptionId
    votedFor?: boolean
}

export interface PollEdit {
    inviteLink?: string
    pollID: tPollID
    name?: string
    description?: string
    userRemove?: string[]
    votes?: { userID: string; optionID: tOptionId; votedFor: boolean }[]
    options?: {
        optionID?: tOptionId
        value?: string
        dateStart?: tDate
        dateEnd?: tDate
        dateTimeStart?: tDateTime
        dateTimeEnd?: tDateTime
    }[]
}
