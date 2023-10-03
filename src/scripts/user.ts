import { IUser, ReturnCode } from "@/lib/interfaces"
import { CreateUserRequest } from "@/lib/requestInterfaces"
import ExpollStorage from "@/scripts/storage"

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
        ExpollStorage.jwt = (await response.json()).jwt
        return response.status

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
    } catch (e: any) {
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
export async function getPersonalizedData(): Promise<any | undefined> {
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