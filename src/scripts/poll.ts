import axios from "axios"

import { PollOverview } from "expoll-lib/requestInterfaces"

/**
 * Get all polls the user has joined or created
 * @return {PollOverview} an overview over all of the user's polls
 */
export async function getPollOverviews(): Promise<PollOverview | undefined> {
    try {
        return (await axios.get("/api/poll")).data as PollOverview
    } catch {
        return undefined
    }
}

/**
 * Get detailed inforamtion about a specific poll
 * @param {tPollID} pollID the id of the poll
 * @return {DetailedPoll} detailed information about specified poll
 */
/* export async function getDetailedPoll(pollID: tPollID): Promise<DetailedPollResponse | undefined> {
    try {
    } catch {
        return undefined
    }
    return {} as any
} */
