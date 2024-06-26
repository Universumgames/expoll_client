import type { VoteRequest } from "@/types/requests"
import ExpollStorage from "@/scripts/storage"
import { ReturnCode } from "@/types/constants"
import { VoteValue } from "@/types/bases"
import type { languageData } from "@/scripts/languageConstruct"
import { apiFetch } from "@/scripts/apiRequests"

/**
 * Helper method to vote
 * @param {VoteRequest} req the vote request object
 * @return {ReturnCode} the returncode from the server
 */
export async function vote(req: VoteRequest): Promise<ReturnCode> {
    try {
        const jwt = ExpollStorage.jwt
        if (!jwt) return 401
        const rc = (await apiFetch({
            uri: "/vote",
            useAuth: true,
            options: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(req)
            }
        })).status
        return rc
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        return e.response.status
    }
}

/**
 * Get the string representation of a vote
 * @param {languageData} language the language to use
 * @param {VoteValue} value the value to convert
 * @return {string} the string representation of the vote
 */
export function voteString(language: languageData | null, value: VoteValue | undefined): string | undefined {
    if (value == undefined) return language?.uiElements.polls.votes.unknown

    switch (value) {
        case VoteValue.unknown:
            return language?.uiElements.polls.votes.unknown
        case VoteValue.no:
            return language?.uiElements.polls.votes.no
        case VoteValue.yes:
            return language?.uiElements.polls.votes.yes
        case VoteValue.maybe:
            return language?.uiElements.polls.votes.maybe
    }
}