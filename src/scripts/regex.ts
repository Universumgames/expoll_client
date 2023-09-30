import { MailRegexEntry } from "@/lib/extraInterfaces"
import ExpollStorage from "@/scripts/storage"

/**
 * retrive regex rules for login and signup
 * @return {{regex: string, blacklist:boolean}[]} array of regex rules
 */
export async function getLoginRegex(): Promise<MailRegexEntry[]> {
    try {
        return (await (await fetch(ExpollStorage.backendUrl + "/api/simple/mailregex")).json()).regex
    } catch (e) {
        console.error(e)
        return []
    }
}

/**
 * replace regex entries with new
 * @param {MailRegexEntry[]} regex all regex entries, that should be in the database
 */
export async function updateRegeAdmin(regex: MailRegexEntry[]) {
    try {
        const jwt = ExpollStorage.jwt
        if (jwt == null)  return
        await fetch(ExpollStorage.backendUrl + "/api/admin/mailregex", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify({ mailRegex: regex })
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
        if (jwt == null)  return []
        const data = await (await fetch(ExpollStorage.backendUrl + "/api/admin/mailregex", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            }
        })).json()

        return data.regex
    } catch (e) {
        console.error(e)
        return []
    }
}
