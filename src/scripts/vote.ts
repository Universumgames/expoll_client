import { VoteRequest } from "@/types/requests"
import ExpollStorage from "@/scripts/storage"
import { ReturnCode } from "@/types/constants"

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        return e.response.status
    }
}
