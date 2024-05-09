import ExpollStorage from "@/scripts/storage"
import { apiFetch } from "@/scripts/apiRequests"

const base = "/auth"

/**
 * Logout all session from current user (deletes all sessions in database)
 */
export async function logoutAllSessions(): Promise<void> {
    try {
        await apiFetch({
            uri: base + "/logoutAll",
            useAuth: true,
            options: {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        })
    } catch (e) {
        console.error(e)
    }
}

/**
 * logout/delete specific session
 * @param {string} nonce the first 4 characters of the session that should be deleted
 */
export async function deleteSession(nonce: string): Promise<void> {
    try {
        await apiFetch({
            uri: base + "/logout",
            useAuth: true,
            options: {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nonce: nonce }),
                credentials: "include"
            }
        })
    } catch (e) {
        console.error(e)
    }
}

/**
 * Logout if logged in
 */
export async function logout(): Promise<void> {
    try {
        await apiFetch({
            uri: base + "/logout",
            useAuth: true,
            options: {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: "{}"
            }
        })
        ExpollStorage.jwt = null
    } catch (error) {
        console.error(error)
    }
}
