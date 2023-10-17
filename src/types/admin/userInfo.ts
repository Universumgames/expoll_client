import { tUserID } from "@/types/constants"

export interface UserInfo {
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