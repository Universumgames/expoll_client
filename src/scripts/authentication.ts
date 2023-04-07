import * as webauthnJson from "@github/webauthn-json"
import axios from "axios"
import { ReturnCode } from "expoll-lib/interfaces"

const base = "/api/auth"

/**
 * Register this device for webauthn
 */
export async function register(): Promise<{ success: boolean; error?: string }> {
    const resp = await fetch(base + "/webauthn/register")

    let error = ""
    let success = true

    const publicKeyCredential = await webauthnJson.create(await resp.json())

    // POST the response to the endpoint that calls
    const verificationResp = await fetch(base + "/webauthn/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(publicKeyCredential)
    })

    // Wait for the results of verification
    const verificationJSON = await verificationResp.json()

    // Show UI appropriate for the `verified` status
    if (verificationJSON && verificationJSON.verified) {
        return { success }
    } else {
        success = false
        error = `Oh no, something went wrong! Response: ${JSON.stringify(verificationJSON)}`
        return { success, error }
    }
}

/**
 * login with webauthn
 * @param {{username: string?, mail: string?}} userReq the user credentials (username or mail)
 * @return {Promise}
 */
export async function login(userReq: {
    username?: string
    mail?: string
}): Promise<{ success: boolean; error?: string }> {
    const resp = await fetch(
        base +
            "/webauthn/authenticate" +
            `?${userReq.username != undefined ? "username=" + userReq.username : "mail=" + userReq.mail}`
    )

    const returnData: { success: boolean; error?: string } = { success: true, error: undefined }

    const publicKeyCredential = await webauthnJson.get(await resp.json());

    // POST the response to the endpoint that calls
    // @simplewebauthn/server -> verifyAuthenticationResponse()
    const verificationResp = await fetch(
        base +
            "/webauthn/authenticate" +
            `?${userReq.username != undefined ? "username=" + userReq.username : "mail=" + userReq.mail}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(publicKeyCredential)
        }
    )

    // Wait for the results of verification
    const verificationJSON = await verificationResp.json()


    // Show UI appropriate for the `verified` status
    if (verificationJSON && verificationJSON.verified) {
        return returnData
    } else {
        returnData.error = `Oh no, something went wrong! Response: ${JSON.stringify(verificationJSON)}`
        return returnData
    }
}

/**
 * Login with otp and receive a session cookie
 * @param {String} otp the one time password
 * @return {Promise<number>} returns axios request status
 */
export async function otpLogin(otp:string): Promise<number> {
    return await (await axios.post(base + "/simple", { otp: otp }, { withCredentials: true })).status
}

/**
 * rename a webauthn token
 * @param {string} credentialID the credential to rename
 * @param {string} newName the new name for the credential
 * @return {Promise} returns axios request
 */
export async function rename(credentialID: string, newName: string) {
    return await axios.post(
        base + "/webauthn/edit",
        { credentialID: credentialID, newName: newName },
        { withCredentials: true }
    )
}

/**
 * delete a webauthn token
 * @param {string} credentialID the credential to delete
 */
export async function deleteWebauthn(credentialID: string) {
    await fetch(base + "/webauthn", {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ credentialID: credentialID })
    })
}

/**
 * get list of webauthn authenticators
 * @return {any[]} get list of webauthn authenticators
 */
export async function getWebauthnList(): Promise<any[]> {
    try {
        return (await axios.get(base + "/webauthn/list", { withCredentials: true })).data.authenticators
    } catch (e) {
        console.warn(e)
        return []
    }
}

/**
 * Logout all session from current user (deletes all sessions in database)
 */
export async function logoutAllSessions() {
    try {
        await fetch(base + "/logoutAll", {
            method: "DELETE",
            credentials: "include"
        })
    } catch (e) {
        console.warn(e)
    }
}

/**
 * logout/delete specific session
 * @param {long} nonce the first 4 characters of the session that should be deleted
 */
export async function deleteSession(nonce: string) {
    try {
        await fetch(base + "/logout", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nonce: nonce }),
            credentials: "include"
        })
    } catch (e) {
        console.warn(e)
    }
}

/**
 * Logout if logged in
 */
export async function logout() {
    try {
        await axios.delete(base + "/logout", { withCredentials: true })
    } catch (error) {
        console.error(error)
    }
}

/**
 * Requesting a loginmail being send to the users mail address
 * @param {string} mail the registered user's mail address
 * @return {ReturnCode} returns OK if user exists and mail has been sent, appropriate code otherwise
 */
export async function requestLoginMail(mail: string): Promise<ReturnCode> {
    try {
        await axios.post(base + "/simple", {
            mail: mail.toLowerCase().replace(" ", "")
        })
        return ReturnCode.OK
    } catch (e: any) {
        return e.response.status
    }
}

export interface OIDCConnection {
    name: string
    mail: string | undefined
    subject: string
}

/**
 * 
 * @return {Promise<OIDCConnection[]>} returns a list of OIDC connections
 */
export async function getOIDCConnections(): Promise<OIDCConnection[]> {
    try {
        return (await axios.get(base + "/oidc/connections", { withCredentials: true })).data
    } catch (e) {
        console.warn(e)
        return []
    }
}