import { apiFetch } from "@/scripts/apiRequests"
import * as webauthnJson from "@github/webauthn-json"
import { otpLogin } from '@/scripts/auth/otp'

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
export async function loginWebauthn(userReq: {
    username?: string
    mail?: string,
    autofill?: boolean
}): Promise<{ success: boolean; error?: string | undefined }> {
    try {
        console.log("1")
        const resp = await apiFetch({
            uri: base +
              "/webauthn/authenticate" +
              `?${userReq.username != undefined ? "username=" + userReq.username : "mail=" + userReq.mail}`
        })
        const returnData: { success: boolean; error?: string } = { success: true, error: undefined }

        console.log("2")

        const options = await resp.json()
        if (userReq.autofill && window.PublicKeyCredential &&
          PublicKeyCredential.isConditionalMediationAvailable) {
            console.log("3")

            // Is a conditional UI available in this browser?
            //const abortController = new AbortController();
            const cma = await PublicKeyCredential.isConditionalMediationAvailable()
            // eslint-disable-next-line no-constant-condition
            if (cma) {
                options.mediation = "conditional"
                console.log("4")
                //options.signal = abortController.signal
            }
        } else if (userReq.autofill == true) return { success: false, error: "Autofill not supported" }

        console.log(options)
        //debugger
        const publicKeyCredential = await webauthnJson.get(options)
        console.log("4,5")

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
                  body: JSON.stringify(publicKeyCredential),
                  redirect: "manual"
              }
          }
        )
        console.log("5")

        // Wait for the results of verification
        const verificationJSON = await verificationResp.json()
        if(verificationJSON.otp){
            await otpLogin(verificationJSON.otp)
        }


        // Show UI appropriate for the `verified` status
        if (verificationJSON && verificationJSON.verified) {
            console.log("6")
            return returnData
        } else {
            console.log("7")
            returnData.error = `Oh no, something went wrong! Response: ${JSON.stringify(verificationJSON)}`
            return returnData
        }
    }catch (e) {
        console.error(e)
        return { success: false, error: e as any }
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