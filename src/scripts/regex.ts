import ExpollStorage from "@/scripts/storage"
import type { MailRegexEntry } from "@/types/other"
import { apiFetch } from "@/scripts/apiRequests"

/**
 * retrive regex rules for login and signup
 * @return {{regex: string, blacklist:boolean}[]} array of regex rules
 */
export async function getLoginRegex(): Promise<MailRegexEntry[]> {
    try {
        return (await (await apiFetch({
            uri: "/simple/mailregex"
        })).json()).regex
    } catch (e) {
        console.error(e)
        return []
    }
}

/**
 * replace regex entries with new
 * @param {MailRegexEntry[]} regex all regex entries, that should be in the database
 */
export async function updateRegeAdmin(regex: MailRegexEntry[]): Promise<void> {
    try {
        await apiFetch({
            uri: "/admin/mailregex", useAuth: true, options: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ mailRegex: regex })
            }
        })
    } catch (e) {
        console.error(e)
    }
}

/**
 * get all regex entries as admin
 * @return {Promise<MailRegexEntry[]>} list of all regex entries
 */
export async function getRegexAdmin(): Promise<MailRegexEntry[]> {
    try {
        const jwt = ExpollStorage.jwt
        if (jwt == null) return []
        const data = await (await apiFetch({
            uri: "/admin/mailregex",
            useAuth: true, options: {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        })).json()

        return data.regex
    } catch (e) {
        console.error(e)
        return []
    }
}
