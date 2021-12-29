<template>
    <tr>
        <th>
            {{
                this.displayUsernameInsteadOfFull
                    ? this.userVote?.user?.username
                    : this.userVote?.user?.firstName + " " + this.userVote?.user?.lastName
            }}
            <small>{{ this.pollData?.admin.id == this.userVote?.user?.id ?? false ? "(admin)" : "" }}</small>
        </th>
        <td v-for="voteOpt in this.userVote?.votes" :key="voteOpt.optionID">
            <a @click="this.change(voteOpt.optionID)" :class="this.isEditable() ? 'changeable' : ''">{{
                voteOpt.votedFor ? "✔" : "𐄂" ?? "?"
            }}</a
            ><br />
            <small v-show="this.errorMsg != '' && voteOpt.votedFor" class="errorInfo">{{ this.errorMsg }}</small>
        </td>
    </tr>
</template>

<script lang="ts">
    import axios from "axios"
    import { Options, Vue } from "vue-class-component"
    import { DetailedPoll, SimpleUserVotes, VoteChange } from "expoll-lib/extraInterfaces"
    import { IUser, tOptionId } from "expoll-lib/interfaces"
    import getSystemLanguage, { languageData } from "../scripts/languageConstruct"

    @Options({
        props: {
            userData: Object,
            language: Object,
            userVote: Object,
            pollData: Object,
            displayUsernameInsteadOfFull: Boolean
        },
        emits: {
            voteChange: null
        }
    })
    export default class PollUserVoteRow extends Vue {
        userData: IUser | undefined
        language?: languageData
        userVote?: SimpleUserVotes
        pollData?: DetailedPoll
        displayUsernameInsteadOfFull?: boolean

        errorMsg: string = ""

        created() {
            // this.language = getSystemLanguage()
        }

        mounted() {}

        async change(optionID: tOptionId) {
            if (this.pollData == undefined) return
            if (this.userVote == undefined) return
            if (this.userVote.user == undefined) return

            if (this.isEditable()) {
                const maxCount = this.maxAcceptableVoteCount

                const option = this.userVote?.votes.find((vote) => vote.optionID == optionID)
                if (option == undefined) return
                this.errorMsg = ""

                const oldState: boolean | undefined = option.votedFor
                if (option.votedFor == undefined) option.votedFor = true
                else option.votedFor = !option.votedFor
                this.$forceUpdate()

                try {
                    const change: VoteChange = {
                        pollID: this.pollData.pollID,
                        optionID: optionID,
                        votedFor: option.votedFor,
                        userID: this.userVote.user.id
                    }
                    const rc = await axios.post("/api/vote", change, { withCredentials: true })
                    console.log(rc)

                    this.$forceUpdate()
                } catch (e) {
                    if (e.response.status != 200) {
                        this.errorMsg = this.language?.uiElements.polls.details.errorMsgs.tooMuchVotes ?? ""
                    }
                }
            }
        }

        get maxAcceptableVoteCount(): number {
            return this.pollData?.maxPerUserVoteCount ?? -1
        }

        voteCountTrue(): number {
            let count = 0
            for (const vote of this.userVote?.votes ?? []) {
                if (vote.votedFor == true) count++
            }
            return count
        }

        isEditable(): boolean {
            return (
                (this.userVote?.user?.id == this.userData?.id ||
                    this.pollData?.admin.id == this.userData?.id ||
                    this.userData?.admin) ??
                false
            )
        }
    }
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
</style>
