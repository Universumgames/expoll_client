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
