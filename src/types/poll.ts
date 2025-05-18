
import type { tDate, tDateTime, tOptionId, tPollID, tUserID } from "@/types/constants"
import { type PollType, VoteValue } from '@/types/bases'

export interface SimpleUser {
    id: tUserID
    firstName: string
    lastName: string
    username: string
}

export interface PollSimpleUser extends SimpleUser {
    joinedTimestamp: number
}

export interface SimpleUserVotes {
    user: PollSimpleUser
    note: string | undefined
    votes: simpleVote[]
}

export interface SimpleUserNote {
    userID: tUserID
    note: string
}

export interface JoinedTimestamp {
    userID: tUserID
    timestamp: tDateTime
}

export interface PollSummary {
    pollID: tPollID
    admin: SimpleUser
    description: string
    userCount: number
    lastUpdated: Date
    type: PollType
    name: string
    allowsEditing: boolean
}

export interface ComplexOption {
    id?: number
    value?: string
    dateStart?: tDate
    dateEnd?: tDate
    dateTimeStart?: tDateTime
    dateTimeEnd?: tDateTime
    timezone?: string
    isNew?: boolean
}

export const empty: ComplexOption = {
    id: 0,
    value: "",
    dateStart: new Date().getTime(),
    dateEnd: undefined,
    dateTimeStart: new Date().getTime(),
    dateTimeEnd: undefined,
    isNew: undefined,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
}

export interface DetailedPoll {
    pollID: tPollID
    admin: SimpleUser
    name: string
    description: string
    maxPerUserVoteCount: number
    userCount: number
    lastUpdated: Date
    created: Date
    type: PollType
    options: ComplexOption[]
    userVotes: SimpleUserVotes[]
    allowsMaybe: boolean
    allowsEditing: boolean
    privateVoting: boolean
    shareURL: string
    defaultVote: VoteValue
    useUTC: boolean
}

export interface simpleVote {
    optionID: tOptionId
    votedFor: VoteValue
}

export interface PollEdit {
    inviteLink?: string
    leave?: boolean
    pollID: tPollID
    name?: string
    description?: string
    maxPerUserVoteCount?: number
    userRemove?: tUserID[]
    userAdd?: string[]
    votes?: { userID: tUserID; optionID: tOptionId; votedFor: VoteValue }[]
    options?: ComplexOption[]
    delete?: boolean
    allowsMaybe?: boolean
    notes?: { userID: tUserID; note: string }[]
    allowsEditing?: boolean
    privateVoting?: boolean
}

export interface VoteChange {
    pollID: tPollID
    optionID: tOptionId
    votedFor: VoteValue
    userID?: tUserID
}