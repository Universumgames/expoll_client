import axios from "axios"
import { tUserID } from "expoll-lib/interfaces"
import { AdminEditUserRequest, AdminPollListResponse, AdminUserListResponse } from "expoll-lib/requestInterfaces"

/**
 * get all users as admin
 * @return {Promise<AdminUserListResponse> | undefined} list of all users
 */
export async function getAllUser(): Promise<AdminUserListResponse | undefined> {
    try {
        return (await axios.get("/api/admin/users", { withCredentials: true })).data
    } catch (e) {
        console.warn(e)
        return undefined
    }
}

/**
 * get all polls as admin
 * @return {Promise<AdminPollListResponse> | undefined} list of all polls
 */
export async function getAllPolls(): Promise<AdminPollListResponse | undefined> {
    try {
        return (await axios.get("/api/admin/polls", { withCredentials: true })).data
    } catch (e) {
        console.warn(e)
        return undefined
    }
}

/**
 * edit a user
 * @param {AdminEditUserRequest} data the edit delta for the user
 */
export async function editUserAdmin(data: AdminEditUserRequest) {
    try {
        await axios.put("/api/admin/users", data)
    } catch (e) {
        console.warn(e)
    }
}

/**
 * delete user as admin, without confirmation
 * @param {tUserID} userID the user to delete
 */
export async function deleteUserAdmin(userID: tUserID) {
    try {
        await axios.delete("/api/admin/user", {
            data: { userID: userID },
            withCredentials: true
        })
    } catch (e) {
        console.warn(e)
    }
}
