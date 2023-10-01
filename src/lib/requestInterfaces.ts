import { UserInfo } from "./adminInterfaces"
import { PollType, tPollID, tUserID } from "./interfaces"
import {
    ComplexOption,
    DetailedPoll,
    NotificationPreferences,
    PollEdit,
    SimplePoll,
    VoteChange
} from "./extraInterfaces"

export interface CreateUserRequest {
    firstName: string
    lastName: string
    mail: string
    username: string
    captcha?: string
    appAttest?: string
}

export interface CreateUserResponse {
    loginKey: string
}

export interface UserDataRequest {
    loginKey?: string
}

export interface UserDataResponse {
    id: tUserID
    username: string
    firstName: string
    lastName: string
    mail: string
    active: boolean
    admin: boolean
}

export interface PollOverview {
    polls: SimplePoll[]
}

export interface DetailedPollRequest {
    pollID: tPollID
}

export type DetailedPollResponse = DetailedPoll

export interface CreatePollRequest {
    name: string
    maxPerUserVoteCount: number
    description: string
    type: PollType
    options: ComplexOption[]
    allowsMaybe: boolean
    allowsEditing: boolean
}

export interface CreatePollResponse {
    pollID: tPollID
}

export type EditPollRequest = PollEdit

export type VoteRequest = VoteChange

export interface AdminUserListResponse {
    users: UserInfo[]
    totalCount: number
}

export interface AdminPollListResponse {
    polls: SimplePoll[]
    totalCount: number
}

export interface EditUserRequest {
    delete?: boolean
    mail?: string
    firstName?: string
    lastName?: string
    username?: string
}

export interface AdminEditUserRequest extends EditUserRequest {
    userID: tUserID
    admin?: boolean
}

export type ChangeNotificationRequest = NotificationPreferences
export type ChangeNotificationResponse = NotificationPreferences
