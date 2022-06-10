import { startAuthentication, startRegistration } from "@simplewebauthn/browser"

/**
 * Register this device for webauthn
 */
export async function register(): Promise<{ success: boolean; error?: string }> {
    const resp = await fetch("/api/webauthn/register")

    console.log(resp)

    let error = ""
    let success = true

    let attResp
    try {
        // Pass the options to the authenticator and wait for a response
        attResp = await startRegistration(await resp.json())
    } catch (errorC: any) {
        // Some basic error handling
        if (errorC.name === "InvalidStateError") {
            error = "Error: Authenticator was probably already registered by user"
        } else {
            error = errorC
        }

        success = false
        return { success, error }
    }

    // POST the response to the endpoint that calls
    // @simplewebauthn/server -> verifyRegistrationResponse()
    const verificationResp = await fetch("/api/webauthn/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(attResp)
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
        "/api/webauthn/authenticate" +
            `?${userReq.username != undefined ? "username=" + userReq.username : "mail=" + userReq.mail}`
    )

    const returnData: { success: boolean; error?: string } = { success: true, error: undefined }

    let asseResp
    try {
        // Pass the options to the authenticator and wait for a response
        asseResp = await startAuthentication(await resp.json())
    } catch (error: any) {
        // Some basic error handling
        returnData.error = error
        returnData.success = false
        return returnData
    }

    // POST the response to the endpoint that calls
    // @simplewebauthn/server -> verifyAuthenticationResponse()
    const verificationResp = await fetch(
        "/api/webauthn/authenticate" +
            `?${userReq.username != undefined ? "username=" + userReq.username : "mail=" + userReq.mail}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(asseResp)
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
