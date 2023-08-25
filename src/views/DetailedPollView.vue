<template>
    <loading-screen v-show="loadingMain" />
    <div v-show="!loadingMain && loadingFailed">
        <h2 class="errorInfo">
            {{ language?.uiElements.login.loginFirst }}
        </h2>
        <login-signup-view :language="language" />
    </div>
    <blank-detailed-poll-view v-show="loadingMain" :language="language" />
    <div v-show="!loadingMain && !loadingFailed">
        <div v-show="!poll?.allowsEditing" class="archived">
            {{ language?.uiElements.polls.details.editingDisabled }}
        </div>
        <div style="text-align: left">
            <!-- name -->
            <div style="padding: 1ch">
                <div v-show="changes.name == undefined">
                    <h2 style="display: inline">
                        {{ poll?.name }}
                    </h2>
                    <button v-show="mayEdit()" @click="changes.name = poll?.name">
                        <edit-icon class="normalIcon" />
                    </button>
                </div>
                <div v-show="mayEdit() && changes.name != undefined">
                    <label for="nameChange">{{ language?.uiElements.polls.details.pollName }}</label>
                    <input id="nameChange" v-model="changes.name" type="text">
                    <button @click="pushChanges">
                        {{ language?.uiElements.polls.details.save }}
                    </button>
                    <button @click="changes.name = undefined">
                        {{ language?.uiElements.polls.details.cancel }}
                    </button>
                </div>
            </div>
            <div class="info-text">
                <a>ID: {{ pollID }}</a>
                <a>{{
                    language?.uiElements.polls.details.createdBy(poll?.admin.firstName + " " + poll?.admin.lastName)
                }}
                </a>
            </div>
            <!-- description -->
            <div style="margin-top: 1ch" class="footer">
                <label><b>{{ language?.uiElements.polls.create.description }}</b></label>
                <button
                    v-show="mayEdit() && changes?.description == undefined"
                    @click="changes.description = poll?.description"
                >
                    <edit-icon class="normalIcon" />
                </button>
                <br>
                <div v-show="changes?.description == undefined">
                    <p>{{ poll?.description }}</p>
                </div>
                <div v-show="mayEdit() && changes?.description != undefined">
                    <textarea v-model="changes.description" name="description" cols="60" rows="10" /><br>
                    <button @click="pushChanges">
                        {{ language?.uiElements.polls.details.save }}
                    </button>
                    <button @click="changes.description = undefined">
                        {{ language?.uiElements.polls.details.cancel }}
                    </button>
                </div>
            </div>
            <!-- max vote count -->
            <div v-show="mayEdit()">
                <div v-show="changes.maxPerUserVoteCount == undefined">
                    <label>{{ language?.uiElements.polls.details.maxPerUserVoteCount }}
                        <span style="white-space: nowrap">{{
                            language?.uiElements.polls.details.maxPerUserVoteCountDescription
                        }}:
                            {{ poll?.maxPerUserVoteCount }}</span></label>
                    <button v-show="mayEdit()" @click="changes.maxPerUserVoteCount = poll?.maxPerUserVoteCount">
                        <edit-icon class="normalIcon" />
                    </button>
                </div>
                <div v-show="mayEdit() && changes.maxPerUserVoteCount != undefined">
                    <label for="maxPerUserVoteCount">{{
                        language?.uiElements.polls.details.maxPerUserVoteCount
                    }}</label>
                    <input id="maxPerUserVoteCount" v-model="changes.maxPerUserVoteCount" type="number" min="-1">
                    <button @click="pushChanges">
                        {{ language?.uiElements.polls.details.save }}
                    </button>
                    <button @click="changes.maxPerUserVoteCount = undefined">
                        {{ language?.uiElements.polls.details.cancel }}
                    </button>
                </div>
            </div>
            <!-- Allows Maybe -->
            <div v-show="mayEdit()">
                <div v-show="changes.allowsMaybe == undefined">
                    <label>{{ language?.uiElements.polls.create.allowsMaybeLabel }}:
                        {{ poll?.allowsMaybe }}
                    </label>
                    <button v-show="mayEdit()" @click="changes.allowsMaybe = poll?.allowsMaybe">
                        <edit-icon class="normalIcon" />
                    </button>
                </div>
                <div v-show="mayEdit() && changes.allowsMaybe != undefined">
                    <label for="allowsMaybe">{{ language?.uiElements.polls.create.allowsMaybeLabel }}</label>
                    <input id="allowsMaybe" v-model="changes.allowsMaybe" type="checkbox">
                    <button @click="pushChanges">
                        {{ language?.uiElements.polls.details.save }}
                    </button>
                    <button @click="changes.allowsMaybe = undefined">
                        {{ language?.uiElements.polls.details.cancel }}
                    </button>
                </div>
            </div>
            <!-- allows Editing -->
            <div v-show="mayEditAllowEditing()">
                <div v-show="changes.allowsEditing == undefined">
                    <label>{{ language?.uiElements.polls.create.allowsEditingLabel }}:
                        {{ poll?.allowsEditing }}
                    </label>
                    <button v-show="mayEditAllowEditing()" @click="changes.allowsEditing = poll?.allowsEditing">
                        <edit-icon class="normalIcon" />
                    </button>
                </div>
                <div v-show="mayEditAllowEditing() && changes.allowsEditing != undefined">
                    <label for="allowsEditing">{{ language?.uiElements.polls.create.allowsEditingLabel }}</label>
                    <input id="allowsEditing" v-model="changes.allowsEditing" type="checkbox">
                    <button @click="pushChanges">
                        {{ language?.uiElements.polls.details.save }}
                    </button>
                    <button @click="changes.allowsEditing = undefined">
                        {{ language?.uiElements.polls.details.cancel }}
                    </button>
                </div>
            </div>
        </div>

        <!-- share -->
        <div style="text-align: left; margin-top: 1rem">
            <a @click="share()">
                <h3 style="display: inline">Share
                    <share-icon v-show="!shareLinkCopied" class="normalIcon" />
                </h3>
                <h3 v-show="shareLinkCopied" style="display: inline">Copied</h3>
            </a>
        </div>
        <div v-show="!isJoined && poll != undefined" style="text-align: left; margin-top: 1rem">
            <button @click="joinPoll()">
                <h1 style="display: inline">
                    Join
                </h1>
            </button>
        </div>
        <br>

        <!-- Poll options and results -->
        <div v-if="poll != undefined" class="x-scroller poll-main">
            <table>
                <tr>
                    <th class="stickyCol">
                        {{ language?.uiElements.polls.details.userCol }}
                        <button @click="displayUsernameInsteadOfFull = !displayUsernameInsteadOfFull">
                            <switch-icon class="normalIcon" />
                        </button>
                    </th>
                    <th
                        v-for="option in poll?.options" :key="option.id"
                        style="white-space: pre-wrap"
                        class="stickyRow"
                    >
                        {{ optionValue(option) }}
                        <br>
                        ({{ getVotedForCount(option.id ?? 0) }})
                        <br>
                        <a v-show="mayEdit()" class="deleteOpt" @click="deleteOption(option.id ?? 0)">
                            <small>{{ language?.uiElements.polls.details.delete }}</small>
                        </a>
                    </th>
                    <th v-show="mayEdit()" style="padding: 1rem">
                        <button v-show="!addingOption" @click="addingOption = true">
                            +
                        </button>
                        <div v-show="addingOption" class="addOption">
                            <!-- String poll options -->
                            <div v-show="poll?.type == 0">
                                <label :for="newOption.id + 'value'">{{
                                    language?.uiElements.polls.create.optionValue
                                }}</label>
                                <input :id="newOption.id + 'value'" v-model="newOption.value" type="text">
                            </div>
                            <!-- Date options -->
                            <div v-show="poll?.type == 1">
                                <label :for="newOption.id + 'dateStart'">{{
                                    language?.uiElements.polls.create.optionValue
                                }}</label>
                                <input :id="newOption.id + 'dateStart'" v-model="newOption.dateStart" type="date">
                                <br>
                                <label :for="newOption.id + 'dateEnd'">{{
                                    language?.uiElements.polls.create.optionOptEndValue
                                }}</label>
                                <input :id="newOption.id + 'dateEnd'" v-model="newOption.dateEnd" type="date">
                            </div>
                            <!-- Date time options -->
                            <div v-show="poll?.type == 2">
                                <label :for="newOption.id + 'dateTimeStart'">{{
                                    language?.uiElements.polls.create.optionValue
                                }}</label>
                                <input
                                    :id="newOption.id + 'dateTimeStart'" v-model="newOption.dateTimeStart"
                                    type="datetime-local"
                                >
                                <br>
                                <label :for="newOption.id + 'dateTimeEnd'">{{
                                    language?.uiElements.polls.create.optionOptEndValue
                                }}</label>
                                <input
                                    :id="newOption.id + 'dateTimeEnd'" v-model="newOption.dateTimeEnd"
                                    type="datetime-local"
                                >
                            </div>
                            <br>
                            <button style="padding: 0.5rem" @click="addOption">
                                <save-icon class="normalIcon" />
                            </button>
                            <button @click="addingOption = false">
                                {{ language?.uiElements.polls.details.cancel }}
                            </button>
                        </div>
                    </th>
                </tr>

                <poll-user-vote-row
                    :user-data="userData" :language="language"
                    :user-vote="getVotesByUser()"
                    :poll-data="poll"
                    :note="poll.userNotes?.find((note) => note.userID == userData?.id)"
                    :display-username-instead-of-full="displayUsernameInsteadOfFull"
                    class="currentUserVotes"
                    @voteChange="voteUpdateCallback" @noteChange="noteChangeCallback"
                />
                <poll-user-vote-row
                    v-for="vote in poll?.userVotes" v-show="vote.user.id != userData?.id"
                    :key="vote.user.id" :user-data="userData"
                    :note="poll.userNotes?.find((note) => note.userID == vote.user.id)"
                    :language="language"
                    :user-vote="vote" :poll-data="poll"
                    :display-username-instead-of-full="displayUsernameInsteadOfFull"
                    @voteChange="voteUpdateCallback" @kickedID="userKicked"
                    @noteChange="noteChangeCallback"
                />
                <tr v-show="mayEdit()">
                    <td>
                        <button @click="addUserClick()">
                            {{ language?.uiElements.polls.details.addUserBtn }}
                        </button>
                    </td>
                </tr>
            </table>
        </div>

        <button v-show="mayEdit()" style="background: var(--alert-color)" @click="deletePoll()">
            {{ language?.uiElements.polls.details.deletePollBtn }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { ComplexOption, DetailedPoll, SimpleUser, SimpleUserVotes } from "expoll-lib/extraInterfaces"
import { IUser, PollType, ReturnCode, tOptionId, tUserID, VoteValue } from "expoll-lib/interfaces"
import { languageData } from "@/scripts/languageConstruct"
import SaveIcon from "../assetComponents/SaveIcon.vue"
import EditIcon from "../assetComponents/EditIcon.vue"
import ShareIcon from "../assetComponents/ShareIcon.vue"
import PollUserVoteRow from "../components/PollUserVotes.vue"
import LoadingScreen from "../components/LoadingScreen.vue"
import SwitchIcon from "../assetComponents/SwitchIcon.vue"
import { EditPollRequest } from "expoll-lib/requestInterfaces"
import LoginSignupView from "../components/LoginSignupView.vue"
import BlankDetailedPollView from "../components/Blanks/BlankDetailedPollView.vue"
import * as pollMethods from "@/scripts/poll"
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"

const props = defineProps<{ userData: IUser, language: languageData }>()
const route = useRoute()

const loadingMain = ref(true)
const loadingFailed = ref(false)

const poll = ref<DetailedPoll>()
const newOption = ref<ComplexOption>({})

const addingOption = ref(false)

const changes = ref<EditPollRequest>({ pollID: "" })

const shareLinkCopied = ref(false)

const displayUsernameInsteadOfFull = ref(false)

const isJoined = ref(false)

const isEditing = () => {
    return (addingOption.value || changes.value.name != undefined || changes.value.description != undefined) &&
        poll.value != undefined
}

onMounted(async () => {
    await setup()

    // update votes every 60 seconds
    let intID: any = 0
    intID = setInterval(() => {
        if (route.params.id == undefined && !route.fullPath.includes("polls")) {
            clearInterval(intID)
        }
        setup()
    }, 60 * 1000)
})


const getPollData = async () => {
    const pollData = await pollMethods.getDetailedPoll(pollID())
    if (pollData == undefined) return


    if (pollData.type == PollType.Date) {
        pollData.options = pollData.options.sort((a, b) => {
            return a.dateStart! - b.dateStart!
        })
    } else if (pollData.type == PollType.DateTime) {
        pollData.options = pollData.options.sort((a, b) => {
            return a.dateTimeStart! - b.dateTimeStart!
        })
    }
    for (const user of pollData.userVotes) {
        user.votes = user.votes.sort((a, b) => {
            const aIndex = pollData.options.findIndex((option) => option.id == a.optionID)
            const bIndex = pollData.options.findIndex((option) => option.id == b.optionID)
            return aIndex - bIndex
        })
    }

    poll.value = pollData

    isJoined.value = pollData?.userVotes.find((uv) => {
        return uv.user.id == props.userData?.id
    }) != undefined

    document.title = "Expoll - " + pollData.name
}

const setup = async () => {
    try {
        if (isEditing()) return
        await getPollData()
        await checkAndJoinPoll()

        await getPollData()


        if (poll.value != undefined) changes.value = { pollID: poll.value.pollID }
        loadingFailed.value = poll.value == undefined


        loadingMain.value = false

    } catch (e) {
        loadingMain.value = false
        loadingFailed.value = true
        console.warn(e)
    }
}

const checkAndJoinPoll = async () => {
    if (
        route.query.join == "1" &&
        !isJoined.value &&
        (poll.value?.allowsEditing ?? false)
    ) {
        try {
            await joinPoll()
        } catch (e) {
            console.warn(e)
        }
    }
}

const joinPoll = async () => {
    await pollMethods.joinPoll(pollID())
    window.location.href = "/#/polls/" + poll.value?.pollID
    window.location.reload()
}

const optionValue = (option: any) => {
    let start: string | undefined = ""
    let end: string | undefined = ""
    switch (poll.value?.type) {
        case PollType.String:
            return option.value

        case PollType.Date:
            start = props.language?.uiElements.dateToString(new Date(option.dateStart))
            end = props.language?.uiElements.dateToString(new Date(option.dateEnd))
            return (
                props.language?.uiElements.polls.details.dateStringFormat(
                    start,
                    option.dateEnd == undefined ? undefined : end
                ) ?? ""
            )

        case PollType.DateTime:
            start = props.language?.uiElements.dateTimeToString(new Date(option.dateTimeStart))
            end = props.language?.uiElements.dateTimeToString(new Date(option.dateTimeEnd))
            return (
                props.language?.uiElements.polls.details.dateStringFormat(
                    start,
                    option.dateTimeEnd == undefined ? undefined : end
                ) ?? ""
            )
    }
    return ""
}

const getVotesByUser = () => {
    if (poll.value == undefined) {
        return {
            user: props.userData ?? ({ id: "", firstName: "", lastName: "", username: "" } as SimpleUser),
            votes: []
        } as SimpleUserVotes
    }
    return (
        poll.value.userVotes.find((vote) => vote.user?.id == props.userData?.id) ?? {
            user: props.userData ?? { id: "", firstName: "", lastName: "", username: "" },
            votes: []
        }
    )
}

const pollID = () => {
    return route.params.id as string
}

const mayEdit = () => {
    return (
        ((poll.value?.admin.id == props.userData?.id ?? false) || (props.userData?.admin ?? false)) &&
        (poll.value?.allowsEditing ?? false)
    )
}

const mayEditAllowEditing = () => {
    return (poll.value?.admin.id == props.userData?.id ?? false) || (props.userData?.admin ?? false)
}

const pushChanges = async () => {
    try {
        if (!mayEdit() && !mayEditAllowEditing()) return
        const ret = await pollMethods.pushPollChanges(pollID(), changes.value)
        if (ret == ReturnCode.OK) changes.value = { pollID: pollID() }
        await setup()
    } catch (e) {
        console.error(e)
    }
}

const addOption = () => {
    if (poll.value?.type == PollType.String && newOption.value.value == undefined) return
    if (poll.value?.type == PollType.Date && newOption.value.dateStart == undefined) return
    if (poll.value?.type == PollType.DateTime && newOption.value.dateTimeStart == undefined) return

    if (changes.value.options == undefined) changes.value.options = []
    //  format date to unix timestamp
    if (poll.value?.type == PollType.Date) {
        newOption.value.dateStart = new Date(newOption.value.dateStart!).getTime()
        if (newOption.value.dateEnd != undefined) newOption.value.dateEnd = new Date(newOption.value.dateEnd).getTime()
    }
    if (poll.value?.type == PollType.DateTime) {
        newOption.value.dateTimeStart = new Date(newOption.value.dateTimeStart!).getTime()
        if (newOption.value.dateTimeEnd != undefined) newOption.value.dateTimeEnd = new Date(newOption.value.dateTimeEnd).getTime()
    }

    changes.value.options.push(newOption.value)

    addingOption.value = false
    newOption.value = {}
    pushChanges()
}

const deleteOption = async (optionID: tOptionId) => {
    const option = poll.value?.options.find((opt) => opt.id == optionID)
    if (option == undefined) return
    const deleteConfirm = confirm(props.language?.uiElements.polls.details.deleteConfirm(JSON.stringify(option)))
    if (deleteConfirm) {
        if (changes.value.options == undefined) changes.value.options = []
        changes.value.options.push({ id: optionID })
        await pushChanges()
    }
}

const voteUpdateCallback = async () => {
    await getPollData()
}

const deletePoll = async () => {
    const confirm1 = confirm(props.language?.uiElements.polls.details.deletePollConfirm)
    if (!confirm1) return
    const confirm2 = confirm(props.language?.uiElements.polls.details.deletePollConfirmConfirm)
    if (!confirm2) return

    await pollMethods.deletePoll(pollID())
    window.location.href = "/#/polls"
}

const share = () => {
    // get protocol, hostname and port from window.location
    const url = poll.value?.shareURL ?? ""
    if (navigator.share) {
        navigator
            .share({
                title: "Share Poll",
                url: url
            })
            .then(() => {
                console.log("Thanks for sharing!")
            })
            .catch(console.error)
    } else copyToClipboard(url)
    shareLinkCopied.value = true
}

const copyToClipboard = (text: string) => {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text)
}

const getVotedForCount = (optionID: tOptionId) => {
    let count = 0
    let maybeCount = 0
    for (const userVotes of poll.value?.userVotes ?? []) {
        const vote = userVotes.votes.find((vote) => vote.optionID == optionID) ?? { votedFor: undefined }

        if (vote.votedFor != undefined && vote.votedFor == VoteValue.yes) count++
        if (vote.votedFor != undefined && vote.votedFor == VoteValue.maybe) maybeCount++
    }
    return "" + count + (maybeCount > 0 ? " (+" + maybeCount + ")" : "")
}

const userKicked = (userID: tUserID) => {
    if (poll.value == undefined) return
    poll.value.userVotes = poll.value.userVotes.filter((ele) => ele.user?.id != userID ?? true) ?? []
}

const noteChangeCallback = async () => {
    await setup()
}

const addUserClick = async () => {
    const userInfo = prompt(props.language?.uiElements.polls.details.addUserBtn, "id, mail, username")
    if (userInfo == null || userInfo == "") return
    await pollMethods.pushPollChanges(pollID(), { pollID: pollID(), userAdd: [userInfo] })
    await setup()
}
</script>

<style scoped>
* {
    color: var(--text-color);
}

input {
    background: var(--secondary-color);
}

.addOption,
.addOption > div {
    display: inline;
}

p {
    margin-top: 0;
}

table {
    table-layout: fixed;
}

td > input,
th > input,
.addOption > div > input {
    background: var(--bg-color);
}

a {
    cursor: pointer;
}

.x-scroller {
    overflow-x: auto;
}

.currentUserVotes {
    outline: thin solid var(--primary-color);
}

.deleteOpt {
    text-decoration: underline;
}

.info-text {
    font-style: italic;
    font-size: 0.8rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.archived {
    background-color: var(--alert-color);
    padding: 1ch;
    position: sticky;
    top: 0;
    z-index: 100;
}
</style>

<style>
.stickyCol {
    position: sticky;
    left: 0;
    z-index: 2;
}

.stickyRow {
    position: sticky;
    top: 0;
    z-index: 1;
}

th:first-child {
    width: 40vw;
}

th:first-child {
    border: thin solid var(--text-color);
}
</style>
