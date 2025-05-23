import type { UserInfo } from "@/types/admin/userInfo"
import type { ComplexOption, DetailedPoll, PollEdit, PollSummary, VoteChange } from "@/types/poll"
import type { NotificationPreferences } from "@/types/notification"
import type { tPollID, tUserID } from "@/types/constants"
import { type PollType, VoteValue } from '@/types/bases'

export interface CreateUserRequest {
    firstName: string
    lastName: string
    mail: string
    username: string
    captcha?: string
    appAttest?: string
    useURL: boolean
    forApp: boolean
    redirect: boolean
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
    polls: PollSummary[]
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
    defaultVote: VoteValue
    useUTC: boolean
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
    polls: PollSummary[]
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
