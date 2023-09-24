import { PollType, ReturnCode, tPollID, tUserID } from "@/lib/interfaces"
import { CreatePollRequest, DetailedPollResponse, EditPollRequest, PollOverview } from "@/lib/requestInterfaces"
import { replacer } from "./helper"
import { ComplexOption, DetailedPoll } from "@/lib/extraInterfaces"
import { languageData } from "@/scripts/languageConstruct"
import ExpollStorage from "@/scripts/storage"

const base = "/api/poll"

/**
 * Get all polls the user has joined or created
 * @return {PollOverview} an overview over all of the user's polls
 */
export async function getPollOverviews(): Promise<PollOverview | undefined> {
    try {
        return fetch(base, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + ExpollStorage.jwt
            }
        }).then(res => res.json())
    } catch {
        return undefined
    }
}

/**
 * Get detailed inforamtion about a specific poll
 * @param {tPollID} pollID the id of the poll
 * @return {DetailedPoll} detailed information about specified poll
 */
export async function getDetailedPoll(pollID: tPollID): Promise<DetailedPollResponse | undefined> {
    try {
        const response = await fetch(base + "?pollID=" + pollID, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + ExpollStorage.jwt
            }
            //body: JSON.stringify({ pollID: pollID })
        })
        return response.json()
    } catch (e) {
        console.error(e)

        return undefined
    }
}

/**
 * leave a poll
 * @param {tPollID} pollID the pollID the current user wants to leave from
 */
export async function leavePoll(pollID: tPollID) {
    try {
        const data: EditPollRequest = { pollID: pollID }
        await fetch(base + "/leave", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + ExpollStorage.jwt
            },
            body: JSON.stringify(data)
        })
    } catch (e) {
        console.error(e)
    }
}

/**
 * Remove a user from a poll, only works as poll admin or general admin
 * @param {tPollID} pollID the poll the user should be removed from
 * @param {tUserID} userID the user to remove
 */
export async function removeUserFromPoll(pollID: tPollID, userID: tUserID) {
    try {
        const data: EditPollRequest = { pollID: pollID, userRemove: [userID] }
        await fetch(base, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + ExpollStorage.jwt
            },
            body: JSON.stringify(data)
        })
    } catch (e) {
        console.error(e)
    }
}

/**
 * create a publicly visible note for a user in a certain poll
 * @param {tPollID} pollID the affected poll
 * @param {tUserID} userID the user the note is for
 * @param {string} note the note for the user in that poll
 */
export async function editUserNote(pollID: tPollID, userID: tUserID, note: string) {
    try {
        const data: EditPollRequest = {
            pollID: pollID,
            notes: [{ userID: userID, note: note }]
        }
        await fetch(base, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + ExpollStorage.jwt
            },
            body: JSON.stringify(data)
        })
    } catch (e) {
        console.error(e)
    }
}

/**
 * join a poll and add them to your overview
 * @param {tPollID} pollID the poll to join
 */
export async function joinPoll(pollID: tPollID) {
    try {
        await fetch(base + "/join", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + ExpollStorage.jwt
            },
            body: JSON.stringify({ pollID: pollID })
        })
    } catch (e) {
        console.error(e)
    }
}

/**
 * push changes to server
 * @param {tPollID} pollID the poll the changes go to
 * @param {changes} changes changes on th epoll
 * @return {ReturnCode} http code
 */
export async function pushPollChanges(pollID: tPollID, changes: EditPollRequest): Promise<ReturnCode> {
    try {
        changes.pollID = pollID
        const response = await fetch(base, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + ExpollStorage.jwt
            },
            body: JSON.stringify(changes, replacer)
        })
        return response.status
    } catch (e) {
        console.error(e)
        return ReturnCode.INTERNAL_SERVER_ERROR
    }
}

/**
 * Delete a poll you have the right to
 * @param {tPollID} pollID the poll to be deleted
 */
export async function deletePoll(pollID: tPollID) {
    try {
        const data: EditPollRequest = { pollID: pollID, delete: true }
        await fetch(base, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + ExpollStorage.jwt
            },
            body: JSON.stringify(data)
        })
    } catch (e) {
        console.error(e)
    }
}

/**
 * create a fresh poll
 * @param {CreatePollRequest} data request data for poll creation
 * @return {Promise<ReturnCode>} the return code from the http request
 */
export async function createPoll(data: CreatePollRequest): Promise<ReturnCode> {
    try {
        const response = await fetch(base, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + ExpollStorage.jwt
            },
            body: JSON.stringify(data, replacer)
        })
        return response.status
    } catch (e: any) {
        console.error(e)
        return e.response.status
    }
}


export function optionToString(option: ComplexOption, pollData: DetailedPoll, language: languageData): string {
    let start: string | undefined = ""
    let end: string | undefined = ""
    switch (pollData.type) {
        case PollType.String:
            return option.value!
        case PollType.Date:
            start = language.uiElements.dateToString(new Date(option.dateStart!))
            end = language.uiElements.dateToString(new Date(option.dateEnd ?? 0))
            return (
                language.uiElements.polls.details.dateStringFormat(
                    start,
                    option.dateEnd == undefined ? undefined : end
                ) ?? ""
            )

        case PollType.DateTime:
            start = language.uiElements.dateTimeToString(new Date(option.dateTimeStart!))
            end = language.uiElements.dateTimeToString(new Date(option.dateTimeEnd ?? 0))
            return (
                language.uiElements.polls.details.dateStringFormat(
                    start,
                    option.dateTimeEnd == undefined ? undefined : end
                ) ?? ""
            )
    }
}