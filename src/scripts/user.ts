import axios from "axios"
import { IUser, ReturnCode } from "expoll-lib/interfaces"
import { CreateUserRequest } from "expoll-lib/requestInterfaces"

const base = "/api/user"

/**
 * Create a new user
 * @param {{}} data user login data
 * @return {Promise<{string, ReturnCode }>} login key and response code to check for errors
 */
export async function signUp(data: CreateUserRequest): Promise<{ loginKey?: string; code: ReturnCode }> {
    try {
        const res = await axios.post(base, data, { withCredentials: true })
        const loginKey = res.data.loginKey
        return {
            loginKey: loginKey,
            code: res.status as ReturnCode
        }
    } catch (e: any) {
        return { loginKey: undefined, code: e.response.status }
    }
}

/**
 * Get user data via cookie
 * @param {string?} loginKey if loginkey is not stored as cookie but as raw value, it can be passed here
 * @return {IUser} return user data
 */
export async function getUserData(loginKey?: string): Promise<IUser | undefined> {
    try {
        if (loginKey != undefined) {
            // TODO missing transformation to new path
            return (await axios.post("/api/auth/simple", { loginKey: loginKey.replace(" ", "") })).data as IUser
        } else return (await axios.get(base, { withCredentials: true })).data as IUser
    } catch (e: any) {
        return undefined
    }
}

/**
 * delete user if logged in
 */
export async function deleteUser() {
    try {
        await axios.delete(base, { withCredentials: true })
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
        return (await axios.get(base + "/personalizeddata", { withCredentials: true })).data
    } catch (e) {
        console.warn(e)
        return undefined
    }
}
