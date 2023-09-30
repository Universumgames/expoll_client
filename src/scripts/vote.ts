import { ReturnCode } from "@/lib/interfaces"
import { VoteRequest } from "@/lib/requestInterfaces"
import ExpollStorage from "@/scripts/storage"

/**
 * Helper method to vote
 * @param {VoteRequest} req the vote request object
 * @return {ReturnCode} the returncode from the server
 */
export async function vote(req: VoteRequest): Promise<ReturnCode> {
    try {
        const jwt = ExpollStorage.jwt
        if (!jwt) return 401
        const rc = (await fetch(ExpollStorage.backendUrl + "/api/vote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify(req)
        })).status
        return rc
    } catch (e: any) {
        return e.response.status
    }
}
