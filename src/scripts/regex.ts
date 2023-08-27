import axios from "axios"
import { MailRegexEntry } from "@/lib/extraInterfaces"

/**
 * retrive regex rules for login and signup
 * @return {{regex: string, blacklist:boolean}[]} array of regex rules
 */
export async function getLoginRegex(): Promise<MailRegexEntry[]> {
    try {
        return (await axios.get("/api/simple/mailregex")).data.regex
    } catch (e) {
        console.warn(e)
        return []
    }
}

/**
 * replace regex entries with new
 * @param {MailRegexEntry[]} regex all regex entries, that should be in the database
 */
export async function updateRegeAdmin(regex: MailRegexEntry[]) {
    try {
        await axios.post(
            "/api/admin/mailregex",
            {
                mailRegex: regex
            },
            { withCredentials: true }
        )
    } catch (e) {
        console.warn(e)
    }
}

/**
 * get all regex entries as admin
 * @return {Promise<MailRegexEntry[]>} list of all regex entries
 */
export async function getRegexAdmin(): Promise<MailRegexEntry[]> {
    try {
        const data = (await axios.get("/api/admin/mailregex", { withCredentials: true })).data as {
            regex: MailRegexEntry[]
        }
        return data.regex
    } catch (e) {
        console.warn(e)
        return []
    }
}
