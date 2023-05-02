<template>
    <tr>
        <th @click="editNote" class="stickyCol">
            {{
                displayUsernameInsteadOfFull
                ? userVote?.user?.username
                : userVote?.user?.firstName + " " + userVote?.user?.lastName
            }}
            <small>{{ pollData?.admin.id == userVote?.user?.id ?? false ? "(admin)" : "" }}</small>
            <small>{{ noteString }}</small>
        </th>
        <td v-for="voteOpt in userVote?.votes" :key="voteOpt.optionID">
            <a @click="change(voteOpt.optionID)" @keyup="(e) => {
                    if (e.keyCode == 13) change(voteOpt.optionID)
                }
                " :class="isEditable() ? 'changeable' : ''" tabindex="0">{{ voteString(voteOpt.votedFor) }}</a><br />
            <small v-show="errorMsg != '' && voteOpt.votedFor" class="errorInfo">{{ errorMsg }}</small>
        </td>
        <td>
            <button class="leaveBtn" @click="removeUser" v-show="removeUserBtnVisible">
                {{
                    loggedUserIsSelectedUser()
                    ? language?.uiElements.polls.details.leavePollBtn
                    : language?.uiElements.polls.details.kickFromPollBtn
                }}
            </button>
            <button class="leaveBtn btn-disabled" @click="editingDisabledNote" v-show="!removeUserBtnVisible">
                {{
                    loggedUserIsSelectedUser()
                    ? language?.uiElements.polls.details.leavePollBtn
                    : language?.uiElements.polls.details.kickFromPollBtn
                }}
            </button>
        </td>
    </tr>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { DetailedPoll, SimpleUserNote, SimpleUserVotes } from "expoll-lib/extraInterfaces"
import { IUser, ReturnCode, tOptionId, VoteValue } from "expoll-lib/interfaces"
import { languageData } from "../scripts/languageConstruct"
import { vote } from "../scripts/vote"
import { VoteRequest } from "expoll-lib/requestInterfaces"
import { leavePoll, removeUserFromPoll, editUserNote } from "@/scripts/poll"

@Options({
    props: {
        userData: Object,
        language: Object,
        userVote: Object,
        pollData: Object,
        note: Object,
        displayUsernameInsteadOfFull: Boolean
    },
    emits: {
        voteChange: null,
        kickedID: String
    }
})
export default class PollUserVoteRow extends Vue {
    userData: IUser | undefined
    language?: languageData
    userVote?: SimpleUserVotes
    pollData?: DetailedPoll
    notes?: SimpleUserNote[]
    displayUsernameInsteadOfFull?: boolean

    note?: string

    errorMsg: string = ""

    created() {
        // this.language = getSystemLanguage()
    }

    mounted() { }

    async change(optionID: tOptionId) {
        if (this.pollData == undefined) return
        if (this.userVote == undefined) return
        if (this.userVote.user == undefined) return

        if (!this.pollData.allowsEditing) this.editingDisabledNote()

        if (this.isEditable()) {
            // const maxCount = this.maxAcceptableVoteCount

            const option = this.userVote?.votes.find((vote) => vote.optionID == optionID)
            if (option == undefined) return
            this.errorMsg = ""

            // const oldState: boolean | undefined = option.votedFor
            if (option.votedFor == undefined) option.votedFor = VoteValue.yes
            else option.votedFor = this.pollData.allowsMaybe ? (option.votedFor + 1) % 3 : (option.votedFor + 1) % 2
            this.$forceUpdate()

            const change: VoteRequest = {
                pollID: this.pollData.pollID,
                optionID: optionID,
                votedFor: option.votedFor,
                userID: this.userVote.user.id
            }

            const rc = await vote(change)
            if (rc != ReturnCode.OK) {
                this.errorMsg = this.language?.uiElements.polls.details.errorMsgs.tooMuchVotes ?? ""
            } else {
                this.$emit("voteChange")
                this.$forceUpdate()
            }
        }
    }

    get removeUserBtnVisible() {
        return (
            (this.userData?.id == this.userVote?.user.id ||
                this.userData?.admin ||
                this.pollData?.admin.id == this.userData?.id) &&
            this.pollData?.allowsEditing
        )
    }

    async removeUser() {
        if (this.pollData == undefined || this.userVote == undefined || !this.pollData.allowsEditing) return
        try {
            const askName = this.userVote?.user.firstName + " " + this.userVote?.user.lastName ?? ""
            if (
                !confirm(
                    this.loggedUserIsSelectedUser()
                        ? this.language?.uiElements.polls.details.leaveConfirm ?? ""
                        : this.language?.uiElements.polls.details.kickConfirm(askName) ?? ""
                )
            ) {
                return
            }
            // leave poll

            if (this.loggedUserIsSelectedUser()) {
                await leavePoll(this.pollData.pollID)
                // @ts-ignore
                window.location = "/#/polls"
                console.log("leaving poll")

            } else {
                // remove user from poll
                if (!this.isEditable()) return
                if (this.userVote.user == undefined) return
                await removeUserFromPoll(this.pollData.pollID, this.userVote.user?.id)
                this.$emit("kickedID", this.userVote.user.id)
            }
        } catch (e) {
            console.error(e)
        }
    }

    get maxAcceptableVoteCount(): number {
        return this.pollData?.maxPerUserVoteCount ?? -1
    }

    voteCountTrue(): number {
        let count = 0
        for (const vote of this.userVote?.votes ?? []) {
            if (vote.votedFor == VoteValue.yes || vote.votedFor == VoteValue.maybe) count++
        }
        return count
    }

    isEditable(): boolean {
        return (
            ((this.userVote?.user?.id == this.userData?.id ||
                this.pollData?.admin.id == this.userData?.id ||
                this.userData?.admin) ??
                false) &&
            (this.pollData?.allowsEditing ?? false)
        )
    }

    loggedUserIsSelectedUser() {
        return this.userData?.id == this.userVote?.user?.id ?? false
    }

    voteString(value: VoteValue | undefined) {
        if (value == undefined) return this.language?.uiElements.polls.votes.unknown

        switch (value) {
            case VoteValue.no:
                return this.language?.uiElements.polls.votes.no
            case VoteValue.yes:
                return this.language?.uiElements.polls.votes.yes
            case VoteValue.maybe:
                return this.language?.uiElements.polls.votes.maybe
        }
    }

    async editNote() {
        if (!this.pollData?.allowsEditing) this.editingDisabledNote()
        if (this.isEditable()) {
            const note = prompt("Note for user", this.note)
            if (this.pollData == undefined || this.userVote?.user == undefined || note == undefined) return
            await editUserNote(this.pollData.pollID, this.userVote.user.id, note)
            this.$emit("noteChange")
        }
    }

    get noteString() {
        return " " + this.language?.uiElements.polls.details.userNotesByAdmin(this.note)
    }

    editingDisabledNote() {
        alert(this.language?.uiElements.polls.details.editingDisabled ?? "Editing is not allowed by the admin")
    }
}
</script>

<style scoped>
td>input,
th>input,
.addOption>div>input {
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
