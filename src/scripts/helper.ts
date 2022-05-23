import axios from "axios"

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
