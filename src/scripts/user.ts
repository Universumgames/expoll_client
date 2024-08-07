import type { CreateUserRequest } from "@/types/requests"
import ExpollStorage from "@/scripts/storage"

import type { NotificationPreferences } from "@/types/notification"
import type { ISafeSession, IUser } from "@/types/bases"
import { ReturnCode } from "@/types/constants"
import { apiFetch } from "@/scripts/apiRequests"

const base = "/user"

/**
 * Create a new user
 * @param {{}} data user login data
 * @return {Promise<{string, ReturnCode }>} login key and response code to check for errors
 */
export async function signUp(data: CreateUserRequest): Promise<ReturnCode> {
    try {
        const response = await apiFetch({
            uri: base, options: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
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
        return await apiFetch({
            uri: base,
            useAuth: true,
            options: {
                headers: {
                    "Content-Type": "application/json"
                }
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
        await apiFetch({
            uri: base,
            useAuth: true,
            options: {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        })
    } catch (error) {
        console.error(error)
    }
}

/**
 * get notification preferences
 * @return
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences | undefined> {
    try {
        return await apiFetch({
                uri: "/notifications/preferences",
                useAuth: true,
                options: {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            }
        ).then(res => res.json())
    } catch
        (e) {
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
        const response = await apiFetch({
            uri: "/notifications/preferences",
            useAuth: true,
            options: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        })
        return response.status
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        return e.response.status
    }
}

/**
 * get all sessions of the user
 * @return {ISafeSession[]} all sessions
 */
export async function getSessions(): Promise<ISafeSession[]> {
    try {
        return await apiFetch({
            uri: base + "/sessions",
            useAuth: true,
            options: {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        }).then(res => res.json())
    } catch (e) {
        console.error(e)
        return []
    }
}

/**
 * request personal data per mail
 */
export async function requestPersonalData(): Promise<void> {
    try {
        const jwt = ExpollStorage.jwt
        if (!jwt) return
        await apiFetch({
            uri: base + "/requestPersonalData",
            useAuth: true,
            options: {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        })
    } catch (e) {
        console.error(e)
    }
}