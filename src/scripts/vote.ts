import axios from "axios"
import { ReturnCode } from "@/lib/interfaces"
import { VoteRequest } from "@/lib/requestInterfaces"

/**
 * Helper method to vote
 * @param {VoteRequest} req the vote request object
 * @return {ReturnCode} the returncode from the server
 */
export async function vote(req: VoteRequest): Promise<ReturnCode> {
    try {
        const rc = await axios.post("/api/vote", req, { withCredentials: true })
        return rc.status
    } catch (e: any) {
        return e.response.status
    }
}
