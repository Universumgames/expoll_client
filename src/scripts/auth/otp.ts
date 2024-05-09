import { apiFetch } from "@/scripts/apiRequests"
import ExpollStorage from "@/scripts/storage"
import { ReturnCode } from "@/types/constants"
const base = "/auth"

/**
 * Login with otp and receive a session cookie
 * @param {String} otp the one time password
 * @return {Promise<number>} returns axios request status
 */
export async function otpLogin(otp: string): Promise<{ returnCode: number, forApp: boolean }> {
    const response = await apiFetch({
        uri: base + "/simple",
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                otp: otp,
                version: ExpollStorage.appVersion,
                platform: ExpollStorage.platformName.toUpperCase()
            })
        }
    })
    ExpollStorage.jwt = (await response.text())
    return { returnCode: response.status, forApp: response.headers.get("forapp") == "true" }
}

/**
 * Requesting a loginmail being send to the users mail address
 * @param {string} mail the registered user's mail address
 * @return {ReturnCode} returns OK if user exists and mail has been sent, appropriate code otherwise
 */
export async function requestLoginMail(mail: string): Promise<ReturnCode> {
    try {
        const response = await apiFetch({
            uri: base + "/simple",
            options: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ mail: mail.toLowerCase().replace(" ", "") })
            }
        })
        return response.status
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        return e.response.status
    }
}