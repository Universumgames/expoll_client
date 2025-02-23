import { apiFetch } from "@/scripts/apiRequests"
const base = "/auth"

export interface OIDCConnection {
    id: number
    key: string
    mail: string | undefined
    subject: string
}

export interface OIDCInfo {
    key: string
    imageURI: string
    iconFileName: string
    iconBackgroundColorHex: string
    textColorHex: string
    title: string
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
export async function getAvailableOIDCProviders(): Promise<OIDCInfo[]> {
    try {
        return await apiFetch({
            uri: base + "/oidc/providers",
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