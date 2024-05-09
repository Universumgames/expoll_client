import { apiFetch } from "@/scripts/apiRequests"
const base = "/auth"

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