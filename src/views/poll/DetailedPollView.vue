<template>
    <LoadingScreen v-show="loadingMain" :language="language" :user-data="undefined" />
    <template v-if="!loadingMain && loadingFailed">
        <h2 class="errorInfo">
            {{ language?.uiElements.login.loginFirst }}
        </h2>
        <login-signup-view :language="language" :display-size="displaySize" :failed-loading="failedLoading" />
    </template>
    <blank-detailed-poll-view v-show="loadingMain" :language="language" />
    <template v-if="!loadingMain && !loadingFailed">
        <div v-if="!poll?.allowsEditing" class="archived" style="border-radius: 0.5rem">
            {{ language?.uiElements.polls.details.editingDisabled }}
        </div>
        <button v-show="isPollAdmin()" style="float: right" @click="inEditMode = !inEditMode">
            {{ inEditMode ? "Stop editing" : "Edit" }}
        </button>
        <PollEdit
            v-if="isPollAdmin() && inEditMode && poll != undefined" :language="language"
            :poll-data="poll" :user-data="userData"
            @close="inEditMode = false; setup()"
        />

        <div style="text-align: left">
            <!-- name -->
            <div style="padding: 1ch">
                <h2 style="display: inline">
                    {{ poll?.name }}
                </h2>
            </div>
            <div class="info-text">
                <a>ID: {{ pollID }}</a>
                <a>{{
                    language?.uiElements.polls.details.createdBy(poll?.admin.firstName + " " + poll?.admin.lastName)
                }}
                </a>
            </div>
            <!-- description -->
            <div class="descriptionContainer" style="margin-top: 1ch">
                <label><b>{{ language?.uiElements.polls.details.description }}</b></label>
                <p>{{ poll?.description }}</p>
            </div>
            <br>
            <div v-show="mayEdit()">
                <!-- max vote count -->
                <div>
                    <label>{{ language?.uiElements.polls.details.maxPerUserVoteCount }}
                        <span style="white-space: nowrap">{{
                            language?.uiElements.polls.details.maxPerUserVoteCountDescription
                        }}:
                            {{ poll?.maxPerUserVoteCount }}</span></label>
                </div>
                <!-- Allows Maybe -->
                <div>
                    <label>{{ language?.uiElements.polls.create.allowsMaybeLabel }}:
                        {{ poll?.allowsMaybe }}
                    </label>
                </div>
                <!-- allows Editing -->
                <div>
                    <label>{{ language?.uiElements.polls.create.allowsEditingLabel }}:
                        {{ poll?.allowsEditing }}
                    </label>
                </div>
                <!-- default vote -->
                <div v-if="mayEdit()">
                    <label>{{ language?.uiElements.polls.create.defaultVote }}:
                        {{ voteString(language, poll?.defaultVote) }}
                    </label>
                </div>
            </div>
        </div>

        <div v-show="poll?.privateVoting ?? false">
            <label>{{ language?.uiElements.polls.details.privateVoting }}
            </label>
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
        <div v-if="!isJoined && poll != undefined">
            <label>{{ language.uiElements.polls.details.join.note }}</label>
            <button style="text-align: left; margin-top: 1rem" @click="joinPoll()">
                <h1 style="display: inline">
                    {{ language.uiElements.polls.details.join.button }}
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
                        v-for="option in poll?.options" :id="'option' + option.id"
                        :key="option.id"
                        class="stickyRow"
                        style="white-space: pre-wrap"
                    >
                        <span v-if="relevantOptionID == option.id" class="dot" />
                        {{ optionValue(option) }}
                        <br>
                        ({{ getVotedForCount(option.id ?? 0) }})
                    </th>
                </tr>

                <poll-user-vote-row
                    v-if="isJoined"
                    :display-username-instead-of-full="displayUsernameInsteadOfFull" :language="language"
                    :poll-data="poll"
                    :user-data="userData"
                    :user-vote="getVotesByUser()"
                    :line-index="0"
                    class="currentUserVotes"
                    @noteChange="noteChangeCallback" @voteChange="voteUpdateCallback"
                />
                <poll-user-vote-row
                    v-for="vote in poll?.userVotes" v-show="vote.user.id != userData?.id"
                    :key="vote.user.id" :display-username-instead-of-full="displayUsernameInsteadOfFull"
                    :language="language"
                    :poll-data="poll" :user-data="userData"
                    :user-vote="vote"
                    :line-index="0"
                    @kickedID="userKicked" @noteChange="noteChangeCallback"
                    @voteChange="voteUpdateCallback"
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
    </template>
</template>

<script lang="ts" setup>
import ShareIcon from "../../assetComponents/ShareIcon.vue"
import PollUserVoteRow from "../../components/poll/PollUserVotes.vue"
import LoadingScreen from "../../components/utils/LoadingScreen.vue"
import SwitchIcon from "../../assetComponents/SwitchIcon.vue"
import type { EditPollRequest } from "@/types/requests"
import LoginSignupView from "../../components/login/LoginSignupView.vue"
import BlankDetailedPollView from "../../components/Blanks/BlankDetailedPollView.vue"
import * as pollMethods from "@/scripts/poll"
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import PollEdit from "@/components/poll/PollEdit.vue"
import type { ComplexOption, DetailedPoll, PollSimpleUser, SimpleUserVotes } from "@/types/poll"
import type { tOptionId, tUserID } from "@/types/constants"
import { voteString } from '@/scripts/vote'
import type { DisplaySize } from '@/scripts/displayHelper'
import type { languageData } from '@/scripts/languageConstruct'
import { type IUser, PollType, VoteValue } from '@/types/bases'

const props = defineProps<{ userData: IUser, language: languageData, displaySize: DisplaySize, failedLoading: boolean }>()
const route = useRoute()

const loadingMain = ref(true)
const loadingFailed = ref(false)

const poll = ref<DetailedPoll>()

const addingOption = ref(false)
const changes = ref<EditPollRequest>({ pollID: "" })
const shareLinkCopied = ref(false)
const displayUsernameInsteadOfFull = ref(false)
const isJoined = ref(false)
const inEditMode = ref(false)

const pollID = computed(() => {
    return route.params.id as string
})

const relevantOptionID = computed(() => {
    return getRelevantOptionID()
})

const isEditing = () => {
    return (addingOption.value || changes.value.name != undefined || changes.value.description != undefined) &&
        poll.value != undefined
}

onMounted(async () => {
    loadingMain.value = true
    await setup()

    //if(!loadingMain.value && loadingFailed.value){
    //    ExpollStorage.outstandingJoinPollID = pollID.value
    //    await router.push("/login")
    //    return
    //}

    scrollToNextOption()

    // update votes every 60 seconds
    let intID = 0
    intID = setInterval(() => {
        if (pollID.value == undefined) {
            clearInterval(intID)
        }
        setup()
    }, 60 * 1000) as any
})

const scrollToNextOption = () => {
    const optionID = getRelevantOptionID()
    if (optionID == undefined) return
    const optionToScrollTo: HTMLElement =
        document.getElementById("option" + optionID) ?? document.body
    optionToScrollTo.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
    })
}

const getRelevantOptionID = (): tOptionId | undefined => {
    if (poll.value?.type == PollType.String) return undefined
    const dateCalc = (option: ComplexOption) => {
        const dateRaw = option.dateStart ?? option.dateTimeStart
        let date = new Date(dateRaw ?? 0)
        date.setDate(date.getDate() + 1)
        return date
    }

    const option = poll.value?.options.find((option) => dateCalc(option) > new Date())
    return option?.id
}


const getPollData = async () => {
    const pollData = await pollMethods.getDetailedPoll(pollID.value)
    console.log(pollData)
    if (pollData == undefined) return

    // sort options
    if (pollData.type == PollType.Date) {
        pollData.options = pollData.options.sort((a, b) => {
            return (a.dateStart ?? 0) - (b.dateStart ?? 0)
        })
    } else if (pollData.type == PollType.DateTime) {
        pollData.options = pollData.options.sort((a, b) => {
            return (a.dateTimeStart ?? 0) - (b.dateTimeStart ?? 0)
        })
    }
    for (const user of pollData.userVotes) {
        user.votes = user.votes.sort((a, b) => {
            const aIndex = pollData.options.findIndex((option) => option.id == a.optionID)
            const bIndex = pollData.options.findIndex((option) => option.id == b.optionID)
            return aIndex - bIndex
        })
    }

    pollData.userVotes = pollData.userVotes.sort((a, b) =>
        a.user.joinedTimestamp - b.user.joinedTimestamp
    )

    poll.value = pollData

    isJoined.value = pollData.userVotes.find((uv) => {
        return uv.user.id == props.userData.id
    }) != undefined

    document.title = "Expoll - " + pollData.name
}

const setup = async () => {
    try {
        console.log("1")
        if (isEditing()) return
        console.log("2")
        await getPollData()
        console.log("3")
        await checkAndJoinPoll()

        console.log("4")
        await getPollData()

        if (poll.value != undefined) changes.value = { pollID: poll.value.pollID }
        loadingFailed.value = poll.value == undefined


        loadingMain.value = false

    } catch (e) {
        loadingMain.value = false
        loadingFailed.value = true
        console.error(e)
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
            console.error(e)
        }
    }
}

const joinPoll = async () => {
    await pollMethods.joinPoll(pollID.value)
    window.location.href = "/#/polls/" + poll.value?.pollID
    window.location.reload()
}

const optionValue = (option: ComplexOption) => {
    return poll.value != undefined ? pollMethods.optionToString(option, poll.value, props.language) : ""
}

const getVotesByUser = () => {
    if (poll.value == undefined) {
        return {
            user: props.userData ?? ({
                id: "",
                firstName: "",
                lastName: "",
                username: "",
                joinedTimestamp: 0
            } as PollSimpleUser),
            votes: []
        } as unknown as SimpleUserVotes
    }
    return (
        poll.value.userVotes.find((vote) => vote.user?.id == props.userData?.id) ?? {
            user: props.userData ?? { id: "", firstName: "", lastName: "", username: "" },
            votes: []
        }
    ) as SimpleUserVotes
}

const mayEdit = () => {
    return (
        ((poll.value?.admin.id == props.userData.id) || (props.userData.admin)) &&
        (poll.value?.allowsEditing ?? false)
    )
}

const isPollAdmin = () => {
    return (poll.value?.admin.id == props.userData.id) || (props.userData.admin)
}

const voteUpdateCallback = async () => {
    await getPollData()
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
    poll.value.userVotes = poll.value.userVotes.filter((ele) => ele.user.id != userID) ?? []
}

const noteChangeCallback = async () => {
    await setup()
}

const addUserClick = async () => {
    const userInfo = prompt(props.language?.uiElements.polls.details.addUserBtn, "id, mail, username")
    if (userInfo == null || userInfo == "") return
    await pollMethods.pushPollChanges(pollID.value, { pollID: pollID.value, userAdd: [userInfo] })
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
  border-spacing: 0.5rem;
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

}

th:first-child {
  border-right: thin solid var(--bg-color);
}

.dot {
  height: 25px;
  width: 25px;
  background-color: var(--primary-color);
  border-radius: 50%;
  display: inline-block;
}

.descriptionContainer {
  background-color: var(--secondary-color);
  padding: 1rem;
  border-radius: var(--default-border-radius);
}
</style>
