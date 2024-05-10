<template>
    <tr>
        <th class="stickyCol" @click="editNote">
            {{ displayName }}
            <small>{{ pollData?.admin.id == userVote?.user?.id ?? false ? "(admin)" : "" }}</small><br>
            <small>{{ noteString }}</small>
        </th>
        <td v-for="voteOpt in userVote?.votes" :key="voteOpt.optionID">
            <a
                :class="isEditable() ? 'changeable' : ''" tabindex="0"
                @click="change(voteOpt.optionID)" @keyup="(e) => {
                    if (e.keyCode == 13) change(voteOpt.optionID)
                }
                "
            >{{ voteString(language!, voteOpt.votedFor) }}</a><br>
            <small v-show="errorMsg != '' && voteOpt.votedFor" class="errorInfo">{{ errorMsg }}</small>
        </td>
        <td v-show="loggedUserIsSelectedUser() || pollData.admin.id == userData.id || userData.admin">
            <button v-show="removeUserBtnVisible" class="leaveBtn" @click="removeUser">
                {{
                    loggedUserIsSelectedUser()
                        ? language?.uiElements.polls.details.leavePollBtn
                        : language?.uiElements.polls.details.kickFromPollBtn
                }}
            </button>
            <button v-show="!removeUserBtnVisible" class="leaveBtn btn-disabled" @click="editingDisabledNote">
                {{
                    loggedUserIsSelectedUser()
                        ? language?.uiElements.polls.details.leavePollBtn
                        : language?.uiElements.polls.details.kickFromPollBtn
                }}
            </button>
        </td>
    </tr>
</template>

<script setup lang="ts">
import type { languageData } from "@/scripts/languageConstruct"
import { vote, voteString } from "@/scripts/vote"
import type { VoteRequest } from "@/types/requests"
import { editUserNote, leavePoll, removeUserFromPoll } from "@/scripts/poll"
import { computed, ref } from "vue"
import type { DetailedPoll, SimpleUserVotes } from "@/types/poll"
import type { IUser } from "@/types/bases"
import { ReturnCode, type tOptionId } from "@/types/constants"

interface Props {
    userData: IUser
    language?: languageData
    userVote: SimpleUserVotes
    pollData: DetailedPoll
    displayUsernameInsteadOfFull: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(["voteChange", "kickedID", "noteChange"])

const errorMsg = ref<string>("")

const change = async (optionID: tOptionId) => {
    if (props.pollData == undefined) return
    if (props.userVote == undefined) return
    if (props.userVote.user == undefined) return

    if (!props.pollData.allowsEditing) editingDisabledNote()

    if (isEditable()) {
        // const maxCount = this.maxAcceptableVoteCount

        const option = props.userVote?.votes.find((vote) => vote.optionID == optionID)
        if (option == undefined) return
        errorMsg.value = ""

        // const oldState: boolean | undefined = option.votedFor
        option.votedFor = props.pollData.allowsMaybe ? (option.votedFor + 1) % 3 : (option.votedFor + 1) % 2

        const change: VoteRequest = {
            pollID: props.pollData.pollID,
            optionID: optionID,
            votedFor: option.votedFor,
            userID: props.userVote.user.id
        }

        const rc = await vote(change)
        if (rc != ReturnCode.OK) {
            errorMsg.value = props.language?.uiElements.polls.details.errorMsgs.tooMuchVotes ?? ""
        } else {
            emit("voteChange")
        }
    }
}

const removeUserBtnVisible = computed(() => {
    return (
        (props.userData?.id == props.userVote?.user.id ||
            props.userData?.admin ||
            props.pollData?.admin.id == props.userData?.id) &&
        props.pollData?.allowsEditing
    )
})

const removeUser = async () => {
    if (props.pollData == undefined || props.userVote == undefined || !props.pollData.allowsEditing) return
    try {
        const askName = props.userVote.user.firstName + " " + props.userVote.user.lastName
        if (
            !confirm(
                loggedUserIsSelectedUser()
                    ? props.language?.uiElements.polls.details.leaveConfirm ?? ""
                    : props.language?.uiElements.polls.details.kickConfirm(askName) ?? ""
            )
        ) {
            return
        }
        // leave poll

        if (loggedUserIsSelectedUser()) {
            await leavePoll(props.pollData.pollID)
            window.location.href = "/#/polls"

        } else {
            // remove user from poll
            if (!isEditable()) return
            await removeUserFromPoll(props.pollData.pollID, props.userVote.user?.id)
            emit("kickedID", props.userVote.user.id)
        }
    } catch (e) {
        console.error(e)
    }
}


const isEditable = () => {
    return (
        ((props.userVote?.user?.id == props.userData?.id ||
            props.pollData?.admin.id == props.userData?.id ||
            props.userData?.admin) ??
            false) &&
        (props.pollData?.allowsEditing ?? false)
    )
}

const isNoteEditable = () => {
    return (
        (props.pollData?.admin.id == props.userData?.id || props.userData?.admin) &&
        (props.pollData?.allowsEditing ?? false)
    )
}

const loggedUserIsSelectedUser = () => {
    return props.userData.id == props.userVote.user.id
}



const editNote = async () => {
    if (!props.pollData?.allowsEditing) editingDisabledNote()
    if (isNoteEditable()) {
        const note = prompt("Note for user", props.userVote.note ?? "")
        if (props.pollData == undefined || props.userVote?.user == undefined || note == undefined) return
        await editUserNote(props.pollData.pollID, props.userVote.user.id, note)
        emit("noteChange")
    }
}

const noteString = computed(() => {
    return props.userVote.note
})

const editingDisabledNote = () => {
    alert(props.language?.uiElements.polls.details.editingDisabled ?? "Editing is not allowed by the admin")
}

const displayName = computed(() => props.displayUsernameInsteadOfFull
    ? props.userVote.user.username
    : props.userVote.user.firstName + " " + props.userVote.user.lastName)

</script>

<style scoped>
td > input,
th > input,
.addOption > div > input {
    background: var(--bg-color);
}

.changeable {
    cursor: pointer;
}

a {
    width: 100%;
    height: 100%;
    display: inline-block;
    margin: 0;
}

.leaveBtn {
    background-color: var(--alert-color);
    width: 20ch;
}

.spacer-col {
    width: 100%;
}
</style>
