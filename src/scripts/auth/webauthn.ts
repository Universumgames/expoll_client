import { apiFetch } from "@/scripts/apiRequests"
import * as webauthnJson from "@github/webauthn-json"

const base = "/auth"

/**
 * Register this device for webauthn
 */
export async function registerWebauthn(): Promise<{ success: boolean; error?: string }> {
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
 * setup webauthn autofill
 */
export async function setupWebauthnAutofill(): Promise<void> {
    if (window.PublicKeyCredential &&
        // @ts-ignore
        PublicKeyCredential.isConditionalMediationAvailable) {
        try {

            // Is a conditional UI available in this browser?

            // @ts-ignore
            //const cma = await PublicKeyCredential.isConditionalMediationAvailable()
            // eslint-disable-next-line no-constant-condition
            if (true) {
                //const abortController = new AbortController()
                // If a conditional UI is available, invoke the authenticate() function.
                const publicKeyCredentialRequestOptions = {
                    // Server generated challenge
                    challenge: "test",
                    // The same RP ID as used during registration
                    rpId: "localhost"
                }

                // @ts-ignore
                const credential = await navigator.credentials.get({
                    // @ts-ignore
                    publicKey: publicKeyCredentialRequestOptions,
                    //signal: abortController.signal,
                    // Specify 'conditional' to activate conditional UI
                    // @ts-ignore
                    mediation: "conditional"
                })
                // @ts-ignore
                // eslint-disable-next-line no-debugger
                debugger

                //const {success, error} = await login({})
                //if (success) {

                //}
            }
        } catch (e) {
            console.error(e)
        }
    }
}