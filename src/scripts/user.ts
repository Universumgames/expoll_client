import axios from "axios"
import { IUser, ReturnCode } from "./interfaces"

/**
 * Create a new user
 * @param {{}} data user login data
 * @return {Promise<{string, ReturnCode }>} login key and response code to check for errors
 */
export async function signUp(data: {
    firstName: string
    lastName: string
    mail: string
    username: string
}): Promise<{ loginKey?: string; code: ReturnCode }> {
    try {
        const res = await axios.post("/api/user", data)
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
export async function getUserData(loginKey?: string): Promise<IUser> {
    if (loginKey != undefined) {
        return (await axios.post("/api/user/login", { loginKey: loginKey })).data as IUser
    } else return (await axios.get("/api/user", { withCredentials: true })).data as IUser
}
