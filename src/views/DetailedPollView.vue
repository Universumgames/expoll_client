<template>
    <loading-screen v-show="this.loadingMain" />
    <div v-show="!this.loadingMain && this.loadingFailed">
        <h2 class="errorInfo">{{ this.language?.uiElements.login.loginFirst }}</h2>
        <login-signup-view :language="this.language" />
    </div>
    <blank-detailed-poll-view :language="this.language" v-show="this.loadingMain" />
    <div v-show="!this.loadingMain && !this.loadingFailed">
        <div style="text-align: left">
            <!-- name -->
            <div>
                <div v-show="this.changes.name == undefined">
                    <h2 style="display: inline">{{ this.poll?.name }}</h2>
                    <button v-show="this.mayEdit()" @click="this.changes.name = this.poll?.name">
                        <edit-icon class="normalIcon" />
                    </button>
                </div>
                <div v-show="this.mayEdit() && this.changes.name != undefined">
                    <label for="nameChange">{{ this.language?.uiElements.polls.details.pollName }}</label>
                    <input type="text" id="nameChange" v-model="this.changes.name" />
                    <button @click="this.pushChanges">{{ this.language?.uiElements.polls.details.save }}</button>
                    <button @click="this.changes.name = undefined">
                        {{ this.language?.uiElements.polls.details.cancel }}
                    </button>
                </div>
            </div>
            <small>ID: {{ this.pollID }}</small
            ><br />
            <small
                >{{
                    this.language?.uiElements.polls.details.createdBy(
                        this.poll?.admin.firstName + " " + this.poll?.admin.lastName
                    )
                }} </small
            ><br />
            <!-- description -->
            <div style="margin-top: 1ch">
                <label>{{ this.language?.uiElements.polls.create.description }}</label
                ><button
                    v-show="this.mayEdit() && this.changes?.description == undefined"
                    @click="this.changes.description = this.poll?.description"
                >
                    <edit-icon class="normalIcon" /></button
                ><br />
                <div v-show="this.changes?.description == undefined">
                    <p>{{ this.poll?.description }}</p>
                </div>
                <div v-show="this.mayEdit() && this.changes?.description != undefined">
                    <textarea name="description" cols="60" rows="10" v-model="this.changes.description"></textarea
                    ><br />
                    <button @click="this.pushChanges">{{ this.language?.uiElements.polls.details.save }}</button>
                    <button @click="this.changes.description = undefined">
                        {{ this.language?.uiElements.polls.details.cancel }}
                    </button>
                </div>
            </div>

            <!-- max vote count -->
            <div>
                <div v-show="this.changes.maxPerUserVoteCount == undefined">
                    <label
                        >{{ this.language?.uiElements.polls.details.maxPerUserVoteCount }}
                        <span style="white-space: nowrap"
                            >{{ this.language?.uiElements.polls.details.maxPerUserVoteCountDescription }}:
                            {{ this.poll?.maxPerUserVoteCount }}</span
                        ></label
                    >
                    <button
                        v-show="this.mayEdit()"
                        @click="this.changes.maxPerUserVoteCount = this.poll?.maxPerUserVoteCount"
                    >
                        <edit-icon class="normalIcon" />
                    </button>
                </div>
                <div v-show="this.mayEdit() && this.changes.maxPerUserVoteCount != undefined">
                    <label for="maxPerUserVoteCount">{{
                        this.language?.uiElements.polls.details.maxPerUserVoteCount
                    }}</label>
                    <input id="maxPerUserVoteCount" type="number" min="-1" v-model="this.changes.maxPerUserVoteCount" />
                    <button @click="this.pushChanges">{{ this.language?.uiElements.polls.details.save }}</button>
                    <button @click="this.changes.maxPerUserVoteCount = undefined">
                        {{ this.language?.uiElements.polls.details.cancel }}
                    </button>
                </div>
            </div>
        </div>
        <!-- share -->
        <div style="text-align: left; margin-top: 1rem">
            <a @click="this.share()"
                ><h3 style="display: inline">Share <share-icon v-show="!this.shareLinkCopied" class="normalIcon" /></h3>
                <h3 style="display: inline" v-show="this.shareLinkCopied">Copied</h3></a
            >
        </div>
        <br />

        <!-- Poll options and results -->
        <div class="x-scroller">
            <table>
                <tr>
                    <th>
                        {{ this.language?.uiElements.polls.details.userCol }}
                        <button @click="this.displayUsernameInsteadOfFull = !this.displayUsernameInsteadOfFull">
                            <switch-icon class="normalIcon" />
                        </button>
                    </th>
                    <th v-for="option in this.poll?.options" :key="option.id" style="white-space: pre-wrap">
                        {{ optionValue(option) }}
                        <br />
                        ({{ getVotedForCount(option.id) }})
                        <br />
                        <a v-show="this.mayEdit()" @click="this.deleteOption(option.id)" class="deleteOpt">
                            <small>{{ this.language?.uiElements.polls.details.delete }}</small>
                        </a>
                    </th>
                    <th style="padding: 1rem" v-show="this.mayEdit()">
                        <button v-show="!this.addingOption" @click="this.addingOption = true">+</button>
                        <div v-show="this.addingOption" class="addOption">
                            <!-- String poll options -->
                            <div v-show="this.poll?.type == 0">
                                <label :for="this.newOption.id + 'value'">{{
                                    this.language?.uiElements.polls.create.optionValue
                                }}</label>
                                <input v-model="this.newOption.value" :id="this.newOption.id + 'value'" type="text" />
                            </div>
                            <!-- Date options -->
                            <div v-show="this.poll?.type == 1">
                                <label :for="this.newOption.id + 'dateStart'">{{
                                    this.language?.uiElements.polls.create.optionValue
                                }}</label>
                                <input
                                    v-model="this.newOption.dateStart"
                                    :id="this.newOption.id + 'dateStart'"
                                    type="date"
                                />
                                <label :for="this.newOption.id + 'dateEnd'">{{
                                    this.language?.uiElements.polls.create.optionOptEndValue
                                }}</label>
                                <input
                                    v-model="this.newOption.dateEnd"
                                    :id="this.newOption.id + 'dateEnd'"
                                    type="date"
                                />
                            </div>
                            <!-- Date time options -->
                            <div v-show="this.poll?.type == 2">
                                <label :for="this.newOption.id + 'dateTimeStart'">{{
                                    this.language?.uiElements.polls.create.optionValue
                                }}</label>
                                <input
                                    v-model="this.newOption.dateTimeStart"
                                    :id="this.newOption.id + 'dateTimeStart'"
                                    type="datetime-local"
                                />
                                <label :for="this.newOption.id + 'dateTimeEnd'">{{
                                    this.language?.uiElements.polls.create.optionOptEndValue
                                }}</label>
                                <input
                                    v-model="this.newOption.dateTimeEnd"
                                    :id="this.newOption.id + 'dateTimeEnd'"
                                    type="datetime-local"
                                />
                            </div>
                            <button @click="this.addOption" style="padding: 0.5rem">
                                <save-icon class="normalIcon" />
                            </button>
                            <button @click="this.addingOption = false">
                                {{ this.language?.uiElements.polls.details.cancel }}
                            </button>
                        </div>
                    </th>
                </tr>

                <poll-user-vote-row
                    :userData="this.userData"
                    :language="this.language"
                    :userVote="this.getVotesByUser()"
                    :pollData="this.poll"
                    :displayUsernameInsteadOfFull="this.displayUsernameInsteadOfFull"
                    @voteChange="this.voteUpdateCallback"
                    class="currentUserVotes"
                />
                <poll-user-vote-row
                    v-for="vote in this.poll?.userVotes"
                    :key="vote.user.id"
                    v-show="vote.user.id != userData.id"
                    :userData="this.userData"
                    :language="this.language"
                    :userVote="vote"
                    :pollData="this.poll"
                    :displayUsernameInsteadOfFull="this.displayUsernameInsteadOfFull"
                    @voteChange="this.voteUpdateCallback"
                    @kickedID="this.userKicked"
                />
            </table>
        </div>

        <button v-show="this.mayEdit()" style="background: red" @click="this.deletePoll()">
            {{ this.language?.uiElements.polls.details.deletePollBtn }}
        </button>
    </div>
</template>

<script lang="ts">
    import axios from "axios"
    import { Options, Vue } from "vue-class-component"
    import { ComplexOption, DetailedPoll, SimpleUserVotes } from "expoll-lib/extraInterfaces"
    import { IUser, PollType, tOptionId, tUserID } from "expoll-lib/interfaces"
    import { languageData } from "../scripts/languageConstruct"
    import SaveIcon from "../assetComponents/SaveIcon.vue"
    import EditIcon from "../assetComponents/EditIcon.vue"
    import ShareIcon from "../assetComponents/ShareIcon.vue"
    import PollUserVoteRow from "../components/PollUserVotes.vue"
    import LoadingScreen from "../components/LoadingScreen.vue"
    import SwitchIcon from "../assetComponents/SwitchIcon.vue"
    import { EditPollRequest } from "expoll-lib/requestInterfaces"
    import LoginSignupView from "../components/LoginSignupView.vue"
    import BlankDetailedPollView from "../components/BlankDetailedPollView.vue"

    /*
         votes: { user: User; votes: { optionID: tOptionId; votedFor: boolean }
     */

    @Options({
        props: {
            userData: Object,
            language: Object
        },
        components: {
            SaveIcon,
            EditIcon,
            ShareIcon,
            SwitchIcon,
            PollUserVoteRow,
            LoadingScreen,
            LoginSignupView,
            BlankDetailedPollView
        }
    })
    export default class DetailedPollView extends Vue {
        userData?: IUser
        language?: languageData

        loadingMain = true
        loadingFailed = false

        poll?: DetailedPoll
        newOption: ComplexOption = {}

        addingOption = false

        changes: EditPollRequest = { pollID: "" }

        test: string = ""

        shareLinkCopied = false

        displayUsernameInsteadOfFull = false

        async mounted() {
            await this.setup()
        }

        async setup() {
            try {
                await this.checkAndJoinPoll()
                this.poll = (
                    await axios.get("/api/poll", {
                        params: {
                            pollID: this.pollID
                        },
                        withCredentials: true
                    })
                ).data
                if (this.poll != undefined) this.changes = { pollID: this.poll.pollID }

                this.$forceUpdate()

                this.loadingMain = false
            } catch (e) {
                this.loadingMain = false
                this.loadingFailed = true
            }
        }

        async checkAndJoinPoll() {
            if (
                // @ts-ignore
                (this.$route.query.join == true &&
                    this.userData?.polls.find((poll) => poll.id == this.pollID) == undefined) ??
                false
            ) {
                try {
                    await axios.put("/api/poll", { inviteLink: this.pollID }, { withCredentials: true })
                    // @ts-ignore
                    window.location = "/#/polls/" + this.pollID
                } catch (e) {
                    console.warn(e)
                }
            }
        }

        optionValue(option: any): string {
            let start: string | undefined = ""
            let end: string | undefined = ""
            switch (this.poll?.type) {
                case PollType.String:
                    return option.value

                case PollType.Date:
                    start = this.language?.uiElements.dateToString(new Date(option.dateStart))
                    end = this.language?.uiElements.dateToString(new Date(option.dateEnd))
                    return (
                        this.language?.uiElements.polls.details.dateStringFormat(
                            start,
                            option.dateEnd == undefined ? undefined : end
                        ) ?? ""
                    )

                case PollType.DateTime:
                    start = this.language?.uiElements.dateTimeToString(new Date(option.dateTimeStart))
                    end = this.language?.uiElements.dateTimeToString(new Date(option.dateTimeEnd))
                    return (
                        this.language?.uiElements.polls.details.dateStringFormat(
                            start,
                            option.dateTimeEnd == undefined ? undefined : end
                        ) ?? ""
                    )
            }
            return ""
        }

        getVotesByUser(): SimpleUserVotes {
            if (this.poll == undefined) {
                return { user: this.userData ?? { id: 0, firstName: "", lastName: "", username: "" }, votes: [] }
            }
            const that = this
            return (
                this.poll.userVotes.find((vote) => vote.user?.id == this.userData?.id) ?? {
                    user: that.userData ?? { id: 0, firstName: "", lastName: "", username: "" },
                    votes: []
                }
            )
        }

        get pollID(): string {
            // @ts-ignore
            return this.$route.params.id
        }

        mayEdit(): boolean {
            return (this.poll?.admin.id == this.userData?.id ?? false) || (this.userData?.admin ?? false)
        }

        async pushChanges() {
            try {
                if (!this.mayEdit()) return
                const ax = await axios.put("/api/poll", this.changes, { withCredentials: true })
                if (ax.status == 200) this.changes = { pollID: this.pollID }
                else console.warn(ax)

                await this.setup()
            } catch (e) {
                console.warn(e)
            }
        }

        addOption() {
            if (this.poll?.type == PollType.String && this.newOption.value == undefined) return
            if (this.poll?.type == PollType.Date && this.newOption.dateStart == undefined) return
            if (this.poll?.type == PollType.DateTime && this.newOption.dateTimeStart == undefined) return

            if (this.changes.options == undefined) this.changes.options = []
            this.changes.options.push(this.newOption)

            this.pushChanges()

            this.addingOption = false
            this.newOption = {}
        }

        async deleteOption(optionID: tOptionId) {
            const option = this.poll?.options.find((opt) => opt.id == optionID)
            if (option == undefined) return
            const deleteConfirm = confirm(this.language?.uiElements.polls.details.deleteConfirm(JSON.stringify(option)))
            if (deleteConfirm) {
                if (this.changes.options == undefined) this.changes.options = []
                this.changes.options.push({ id: optionID })
                await this.pushChanges()
            }
        }

        voteUpdateCallback() {
            this.$forceUpdate()
        }

        async deletePoll() {
            const confirm1 = confirm(this.language?.uiElements.polls.details.deletePollConfirm)
            if (!confirm1) return
            const confirm2 = confirm(this.language?.uiElements.polls.details.deletePollConfirmConfirm)
            if (!confirm2) return

            await axios.put("/api/poll", { pollID: this.poll?.pollID, delete: true } as EditPollRequest)
            // @ts-ignore
            window.location = "/"
        }

        share() {
            const url = window.location + "?join=1"
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
            } else this.copyToClipboard(url)
            this.shareLinkCopied = true
        }

        copyToClipboard(text: string) {
            window.prompt("Copy to clipboard: Ctrl+C, Enter", text)
        }

        getVotedForCount(optionID: tOptionId): number {
            const optionIndex = this.poll?.options.findIndex((ele) => ele.id == optionID) ?? 0
            if (optionIndex == -1) return 0
            let count = 0
            for (const userVotes of this.poll?.userVotes ?? []) {
                if (userVotes.votes[optionIndex].votedFor != undefined && userVotes.votes[optionIndex].votedFor) count++
            }
            return count
        }

        userKicked(userID: tUserID) {
            if (this.poll == undefined) return
            this.poll.userVotes = this.poll.userVotes.filter((ele) => ele.user?.id != userID ?? true) ?? []
            this.$forceUpdate()
        }
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

    td > input,
    th > input,
    .addOption > div > input {
        background: var(--bg-color);
    }

    a {
        cursor: pointer;
    }

    .x-scroller {
        width: 98vw;
        overflow-x: auto;
    }

    .currentUserVotes {
        outline: thin solid var(--primary-color);
    }

    .deleteOpt {
        text-decoration: underline;
    }
</style>
