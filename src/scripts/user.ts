import axios from "axios"
import { IUser, ReturnCode } from "@/lib/interfaces"
import { CreateUserRequest } from "@/lib/requestInterfaces"

const base = "/api/user"

/**
 * Create a new user
 * @param {{}} data user login data
 * @return {Promise<{string, ReturnCode }>} login key and response code to check for errors
 */
export async function signUp(data: CreateUserRequest): Promise<ReturnCode> {
    try {
        const res = await axios.post(base, data, { withCredentials: true })
        return res.status as ReturnCode

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
        return (await axios.get(base, { withCredentials: true })).data as IUser
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