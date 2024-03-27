import { AdminEditUserRequest, AdminPollListResponse, AdminUserListResponse } from "@/types/requests"
import ExpollStorage from "@/scripts/storage"
import { tUserID } from "@/types/constants"
import { apiFetch } from "@/scripts/apiRequests"

const base = "/admin"

/**
 * get all users as admin
 * @return {Promise<AdminUserListResponse> | undefined} list of all users
 */
export async function getAllUser(): Promise<AdminUserListResponse | undefined> {
    try {
        return apiFetch({
            uri: base + "/users",
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
        return undefined
    }
}

/**
 * get all polls as admin
 * @return {Promise<AdminPollListResponse> | undefined} list of all polls
 */
export async function getAllPolls(): Promise<AdminPollListResponse | undefined> {
    try {
        return apiFetch({
            uri: base + "/polls",
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
        return undefined
    }
}

/**
 * edit a user
 * @param {AdminEditUserRequest} data the edit delta for the user
 */
export async function editUserAdmin(data: AdminEditUserRequest): Promise<void> {
    try {
        await apiFetch({
            uri: base + "/users",
            useAuth: true,
            options: {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        })
    } catch (e) {
        console.error(e)
    }
}

/**
 * delete user as admin, without confirmation
 * @param {tUserID} userID the user to delete
 */
export async function deleteUserAdmin(userID: tUserID): Promise<void> {
    try {
        await apiFetch({
            uri: base + "/users",
            useAuth: true,
            options: {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userID: userID })
            }
        })
    } catch (e) {
        console.error(e)
    }
}
