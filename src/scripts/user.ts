import { CreateUserRequest } from "@/types/requests"
import ExpollStorage from "@/scripts/storage"

import { NotificationPreferences } from "@/types/notification"
import { IUser } from "@/types/bases"
import { ReturnCode } from "@/types/constants"
import { otpLogin } from "@/scripts/authentication"

const base = "/api/user"

/**
 * Create a new user
 * @param {{}} data user login data
 * @return {Promise<{string, ReturnCode }>} login key and response code to check for errors
 */
export async function signUp(data: CreateUserRequest): Promise<ReturnCode> {
    try {
        const response = await fetch(ExpollStorage.backendUrl + base, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        window.location.replace(await response.text())
        return response.status
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        return e.response.status
    }
}

/**
 * Get user data via cookie
 * @return {IUser} return user data
 */
export async function getUserData(): Promise<IUser | undefined> {
    try {
        const jwt = ExpollStorage.jwt
        if (!jwt) return undefined
        return await fetch(ExpollStorage.backendUrl + base, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            }
        }).then(res => res.json())
    } catch (e) {
        return undefined
    }
}

/**
 * delete user if logged in
 */
export async function deleteUser(): Promise<void> {
    try {
        const jwt = ExpollStorage.jwt
        if (!jwt) return
        await fetch(ExpollStorage.backendUrl + base, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            }
        })
    } catch (error) {
        console.error(error)
    }
}

/**
 * get all data the system has over current user
 * @return {any} presonalized data
 */
export async function getPersonalizedData(): Promise<unknown | undefined> {
    try {
        const jwt = ExpollStorage.jwt
        if (!jwt) return undefined
        return await fetch(ExpollStorage.backendUrl + "/api/user/personalizeddata", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            }
        }).then(res => res.json())
    } catch (e) {
        console.error(e)
        return undefined
    }
}

/**
 * get notification preferences
 * @return
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences | undefined> {
    try {
        const jwt = ExpollStorage.jwt
        if (!jwt) return undefined
        return await fetch(ExpollStorage.backendUrl + "/api/notifications/preferences", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            }
        }).then(res => res.json())
    } catch (e) {
        console.error(e)
        return undefined
    }
}

/**
 * set notification preferences
 * @param data
 */
export async function setNotificationPreferences(data: NotificationPreferences): Promise<ReturnCode> {
    try {
        const jwt = ExpollStorage.jwt
        if (!jwt) return ReturnCode.UNAUTHORIZED
        const response = await fetch(ExpollStorage.backendUrl + "/api/notifications/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify(data)
        })
        return response.status
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        return e.response.status
    }
}