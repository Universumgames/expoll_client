import axios from "axios"
import { MailRegexEntry } from "expoll-lib/extraInterfaces"

/**
 * get meta info from /api/metaInfo endpoint
 * @return {any} returns meta info object
 */
export async function getMetaInfo(): Promise<any> {
    return await axios.get("/api/metaInfo")
}

/**
 * Get wether or not the user has activated darkmode
 * @return {boolean} returns true when darkmode is enabled
 */
export function isDarkMode(): boolean {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
}

/**
 * Pass this method to JSON.stringify to parse datetime to utc
 * @param {Any} key sadf
 * @param {Any} value sdf
 * @return {String}
 */
export function replacer(key: any, value: any) {
    // @ts-ignore
    // eslint-disable-next-line no-invalid-this
    if (this[key] instanceof Date) {
        // @ts-ignore
        // eslint-disable-next-line no-invalid-this
        return this[key].toUTCString()
    }

    return value
}

/**
 * Check if a mail is not banned
 * @param {String} mail the mial adress to check
 * @param {MailRegexEntry[]} regexRules not allowed mail adresss
 * @return {boolean} returns true if mail is allowed, false otherwise
 */
export function mailIsAllowed(mail: string, regexRules: MailRegexEntry[]): boolean {
    let res = true
    for (const regex of regexRules) {
        if ((mail.match(regex.regex) && regex.blacklist) || (!mail.match(regex.regex) && !regex.blacklist)) {
            res = false
        }
    }
    return res
}
