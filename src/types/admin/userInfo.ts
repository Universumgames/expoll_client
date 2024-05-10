import type { tUserID } from "@/types/constants"
import type { IUser } from '@/types/bases'

export interface UserInfo extends IUser {
    id: tUserID
    username: string
    firstName: string
    lastName: string
    mail: string
    admin: boolean
    active: boolean
    superAdmin: boolean
    oidcConnections: string[]
    createdTimestamp: number
    deletedTimestamp: number | null
}