import type { tUserID } from "@/types/constants"
import type { IUser } from '@/types/bases'
import type { OIDCConnection } from '@/scripts/auth/oidc.ts'

export interface UserInfo extends IUser {
    id: tUserID
    username: string
    firstName: string
    lastName: string
    mail: string
    admin: boolean
    active: boolean
    superAdmin: boolean
    oidcConnections: OIDCConnection[]
    createdTimestamp: number
    deletedTimestamp: number | null
}