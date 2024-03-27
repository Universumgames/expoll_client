import * as webauthnJson from "@github/webauthn-json"
import ExpollStorage from "@/scripts/storage"
import { ReturnCode } from "@/types/constants"
import { apiFetch } from "@/scripts/apiRequests"

const base = "/auth"

/**
 * Register this device for webauthn
 */
export async function register(): Promise<{ success: boolean; error?: string }> {
    const resp = await apiFetch({ uri: base + "/webauthn/register" })

    let error = ""
    let success = true

    const publicKeyCredential = await webauthnJson.create(await resp.json())

    // POST the response to the endpoint that calls
    const verificationResp = await apiFetch({
        uri: base + "/webauthn/register", options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(publicKeyCredential)
        }
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
    const resp = await apiFetch({
        uri: base +
            "/webauthn/authenticate" +
            `?${userReq.username != undefined ? "username=" + userReq.username : "mail=" + userReq.mail}`
    })

    const returnData: { success: boolean; error?: string } = { success: true, error: undefined }

    const publicKeyCredential = await webauthnJson.get(await resp.json())

    // POST the response to the endpoint that calls
    // @simplewebauthn/server -> verifyAuthenticationResponse()
    const verificationResp = await apiFetch({
            uri: base +
                "/webauthn/authenticate" +
                `?${userReq.username != undefined ? "username=" + userReq.username : "mail=" + userReq.mail}`,
            options: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(publicKeyCredential)
            }
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
 * rename a webauthn token
 * @param {string} credentialID the credential to rename
 * @param {string} newName the new name for the credential
 * @return {Promise} returns axios request
 */
export async function rename(credentialID: string, newName: string): Promise<Response> {
    return await apiFetch({
        uri: base + "/webauthn/edit",
        useAuth: true,
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ credentialID: credentialID, newName: newName })
        }
    })
}

/**
 * delete a webauthn token
 * @param {string} credentialID the credential to delete
 */
export async function deleteWebauthn(credentialID: string): Promise<void> {
    await apiFetch({
        uri: base + "/webauthn",
        options: {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ credentialID: credentialID })
        }
    })
}

/**
 * get list of webauthn authenticators
 * @return {any[]} get list of webauthn authenticators
 */
export async function getWebauthnList(): Promise<unknown[]> {
    try {
        const response = await apiFetch({
            uri: base + "/webauthn/list",
            useAuth: true,
            options: {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        })
        return (await response.json()).authenticators
    } catch (e) {
        console.error(e)
        return []
    }
}

/**
 * Logout all session from current user (deletes all sessions in database)
 */
export async function logoutAllSessions(): Promise<void> {
    try {
        await apiFetch({
            uri: base + "/logoutAll",
            useAuth: true,
            options: {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        })
    } catch (e) {
        console.error(e)
    }
}

/**
 * logout/delete specific session
 * @param {string} nonce the first 4 characters of the session that should be deleted
 */
export async function deleteSession(nonce: string): Promise<void> {
    try {
        await apiFetch({
            uri: base + "/logout",
            useAuth: true,
            options: {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nonce: nonce }),
                credentials: "include"
            }
        })
    } catch (e) {
        console.error(e)
    }
}

/**
 * Logout if logged in
 */
export async function logout(): Promise<void> {
    try {
        await apiFetch({
            uri: base + "/logout",
            useAuth: true,
            options: {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        })
        ExpollStorage.jwt = null
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
        return await apiFetch({
            uri: base + "/oidc/connections",
            useAuth: true,
            options: {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        }).then(res => res.json())
    } catch (e) {
        console.error(e)
        return []
    }
}

/**
 * get a list of available OIDC providers
 */
export async function getAvailableOIDCProviders(): Promise<unknown> {
    try {
        return await apiFetch({
            uri: "/auth/oidc/providers",
            useAuth: true,
            options: {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        }).then(res => res.json())
    } catch (e) {
        console.error(e)
        return []
    }
}