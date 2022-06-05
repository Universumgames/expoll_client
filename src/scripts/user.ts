import axios from "axios"
import { IUser, ReturnCode } from "expoll-lib/interfaces"
import { CreateUserRequest } from "expoll-lib/requestInterfaces"

/**
 * Create a new user
 * @param {{}} data user login data
 * @return {Promise<{string, ReturnCode }>} login key and response code to check for errors
 */
export async function signUp(data: CreateUserRequest): Promise<{ loginKey?: string; code: ReturnCode }> {
    try {
        const res = await axios.post("/api/user", data, { withCredentials: true })
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
 * Requesting a loginmail being send to the users mail address
 * @param {string} mail the registered user's mail address
 * @return {ReturnCode} returns OK if user exists and mail has been sent, appropriate code otherwise
 */
export async function requestLoginMail(mail: string): Promise<ReturnCode> {
    try {
        await axios.post("/api/user/login", {
            mail: mail.toLowerCase().replace(" ", "")
        })
        return ReturnCode.OK
    } catch (e: any) {
        return e.response.status
    }
}

/**
 * Get user data via cookie
 * @param {string?} loginKey if loginkey is not stored as cookie but as raw value, it can be passed here
 * @return {IUser} return user data
 */
export async function getUserData(loginKey?: string): Promise<IUser | undefined> {
    if (loginKey != undefined) {
        return (await axios.post("/api/user/login", { loginKey: loginKey })).data as IUser
    } else return (await axios.get("/api/user", { withCredentials: true })).data as IUser
}

/**
 * Logout if logged in
 */
export async function logout() {
    try {
        await axios.post("/api/user/logout", { withCredentials: true })
    } catch (error) {
        console.error(error)
    }
}

/**
 * delete user if logged in
 */
export async function deleteUser() {
    try {
        await axios.delete("/api/user", { withCredentials: true })
    } catch (error) {
        console.error(error)
    }
}
