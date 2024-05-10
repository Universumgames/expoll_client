import ExpollStorage from "@/scripts/storage"
import type { MailRegexEntry } from "@/types/other"
import { apiFetch } from "@/scripts/apiRequests"

/**
 * get meta info from /api/metaInfo endpoint
 * @return {any} returns meta info object
 */
export async function getMetaInfo(): Promise<unknown> {
    return await apiFetch({ uri: "/metaInfo" }).then(res => res.json())
}

/**
 * Get wether or not the user has activated darkmode
 * @return {boolean} returns true when darkmode is enabled
 */
export function isDarkMode(): boolean {
    const storage = ExpollStorage.darkMode
    if (storage != null) {
        return storage
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
}

/**
 * Pass this method to JSON.stringify to parse datetime to utc
 * @param {unknown} key sadf
 * @param {unknown} value sdf
 * @return {String}
 */
export function replacer(key: unknown, value: unknown): unknown {
    // @ts-ignore array access is normally not allowed
    // eslint-disable-next-line no-invalid-this
    if (this[key] instanceof Date) {
        // @ts-ignore array access is normally not allowed
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


/**
 * Capitalize the first letter of the string
 * @param {string} string
 * @return {string}
 */
export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
}


/**
 * If text is longer than maxLength, it will be shortened to maxLength-3 and "..." will be appended
 * @param text
 * @param maxLength
 */
export function limitLength(text: string, maxLength: number): string {
    if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + "..."
    }
    return text
}

/**
 * Check if the user is on a mobile device
 * @return {boolean} returns true if user is on mobile device
 */
/*
export function isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}*/