/**
 * Get the value of a cookie
 * @param cname the name of the cookie
 */
export function getCookie(cname: string) {
    const name = cname + "="
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(";")
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == " ") {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return undefined
}

/**
 * Set a cookie
 * @param name the name of the cookie
 * @param value cookie data
 */
export function setCookie(name: string, value: string) {
    document.cookie = name + "=" + value + ";path=/"
}

/**
 * Delete a cookie
 * @param name the name of the cookie
 */
export function deleteCookie(name: string) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}