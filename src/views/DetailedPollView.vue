<template>
    <loading-screen v-show="loadingMain" />
    <div v-show="!loadingMain && loadingFailed">
        <h2 class="errorInfo">{{ language?.uiElements.login.loginFirst }}</h2>
        <login-signup-view :language="language" />
    </div>
    <blank-detailed-poll-view :language="language" v-show="loadingMain" />
    <div v-show="!loadingMain && !loadingFailed">
        <div style="text-align: left">
            <!-- name -->
            <div style="padding: 1ch">
                <div v-show="changes.name == undefined">
                    <h2 style="display: inline">{{ poll?.name }}</h2>
                    <button v-show="mayEdit()" @click="changes.name = poll?.name">
                        <edit-icon class="normalIcon" />
                    </button>
                </div>
                <div v-show="mayEdit() && changes.name != undefined">
                    <label for="nameChange">{{ language?.uiElements.polls.details.pollName }}</label>
                    <input type="text" id="nameChange" v-model="changes.name" />
                    <button @click="pushChanges">{{ language?.uiElements.polls.details.save }}</button>
                    <button @click="changes.name = undefined">
                        {{ language?.uiElements.polls.details.cancel }}
                    </button>
                </div>
            </div>
            <div class="info-text">
                <a>ID: {{ pollID }}</a>
                <a
                    >{{
                        language?.uiElements.polls.details.createdBy(poll?.admin.firstName + " " + poll?.admin.lastName)
                    }}
                </a>
            </div>
            <!-- description -->
            <div style="margin-top: 1ch" class="footer">
                <label
                    ><b>{{ language?.uiElements.polls.create.description }}</b></label
                ><button
                    v-show="mayEdit() && changes?.description == undefined"
                    @click="changes.description = poll?.description"
                >
                    <edit-icon class="normalIcon" /></button
                ><br />
                <div v-show="changes?.description == undefined">
                    <p>{{ poll?.description }}</p>
                </div>
                <div v-show="mayEdit() && changes?.description != undefined">
                    <textarea name="description" cols="60" rows="10" v-model="changes.description"></textarea><br />
                    <button @click="pushChanges">{{ language?.uiElements.polls.details.save }}</button>
                    <button @click="changes.description = undefined">
                        {{ language?.uiElements.polls.details.cancel }}
                    </button>
                </div>
            </div>
            <!-- max vote count -->
            <div v-show="mayEdit()">
                <div v-show="changes.maxPerUserVoteCount == undefined">
                    <label
                        >{{ language?.uiElements.polls.details.maxPerUserVoteCount }}
                        <span style="white-space: nowrap"
                            >{{ language?.uiElements.polls.details.maxPerUserVoteCountDescription }}:
                            {{ poll?.maxPerUserVoteCount }}</span
                        ></label
                    >
                    <button v-show="mayEdit()" @click="changes.maxPerUserVoteCount = poll?.maxPerUserVoteCount">
                        <edit-icon class="normalIcon" />
                    </button>
                </div>
                <div v-show="mayEdit() && changes.maxPerUserVoteCount != undefined">
                    <label for="maxPerUserVoteCount">{{
                        language?.uiElements.polls.details.maxPerUserVoteCount
                    }}</label>
                    <input id="maxPerUserVoteCount" type="number" min="-1" v-model="changes.maxPerUserVoteCount" />
                    <button @click="pushChanges">{{ language?.uiElements.polls.details.save }}</button>
                    <button @click="changes.maxPerUserVoteCount = undefined">
                        {{ language?.uiElements.polls.details.cancel }}
                    </button>
                </div>
            </div>
            <!-- Allows Maybe -->
            <div v-show="mayEdit()">
                <div v-show="changes.allowsMaybe == undefined">
                    <label
                        >{{ language?.uiElements.polls.create.allowsMaybeLabel }}:
                        {{ poll?.allowsMaybe }}
                    </label>
                    <button v-show="mayEdit()" @click="changes.allowsMaybe = poll?.allowsMaybe">
                        <edit-icon class="normalIcon" />
                    </button>
                </div>
                <div v-show="mayEdit() && changes.allowsMaybe != undefined">
                    <label for="allowsMaybe">{{ language?.uiElements.polls.create.allowsMaybeLabel }}</label>
                    <input id="allowsMaybe" type="checkbox" v-model="changes.allowsMaybe" />
                    <button @click="pushChanges">{{ language?.uiElements.polls.details.save }}</button>
                    <button @click="changes.allowsMaybe = undefined">
                        {{ language?.uiElements.polls.details.cancel }}
                    </button>
                </div>
            </div>
        </div>

        <!-- share -->
        <div style="text-align: left; margin-top: 1rem">
            <a @click="share()"
                ><h3 style="display: inline">Share <share-icon v-show="!shareLinkCopied" class="normalIcon" /></h3>
                <h3 style="display: inline" v-show="shareLinkCopied">Copied</h3></a
            >
        </div>
        <div style="text-align: left; margin-top: 1rem" v-show="isJoined">
            <a @click="joinPoll()"><h3 style="display: inline">Join</h3></a>
        </div>
        <br />

        <!-- Poll options and results -->
        <div class="x-scroller poll-main">
            <table>
                <tr>
                    <th>
                        {{ language?.uiElements.polls.details.userCol }}
                        <button @click="displayUsernameInsteadOfFull = !displayUsernameInsteadOfFull">
                            <switch-icon class="normalIcon" />
                        </button>
                    </th>
                    <th v-for="option in poll?.options" :key="option.id" style="white-space: pre-wrap">
                        {{ optionValue(option) }}
                        <br />
                        ({{ getVotedForCount(option.id ?? 0) }})
                        <br />
                        <a v-show="mayEdit()" @click="deleteOption(option.id ?? 0)" class="deleteOpt">
                            <small>{{ language?.uiElements.polls.details.delete }}</small>
                        </a>
                    </th>
                    <th style="padding: 1rem" v-show="mayEdit()">
                        <button v-show="!addingOption" @click="addingOption = true">+</button>
                        <div v-show="addingOption" class="addOption">
                            <!-- String poll options -->
                            <div v-show="poll?.type == 0">
                                <label :for="newOption.id + 'value'">{{
                                    language?.uiElements.polls.create.optionValue
                                }}</label>
                                <input v-model="newOption.value" :id="newOption.id + 'value'" type="text" />
                            </div>
                            <!-- Date options -->
                            <div v-show="poll?.type == 1">
                                <label :for="newOption.id + 'dateStart'">{{
                                    language?.uiElements.polls.create.optionValue
                                }}</label>
                                <input v-model="newOption.dateStart" :id="newOption.id + 'dateStart'" type="date" />
                                <label :for="newOption.id + 'dateEnd'">{{
                                    language?.uiElements.polls.create.optionOptEndValue
                                }}</label>
                                <input v-model="newOption.dateEnd" :id="newOption.id + 'dateEnd'" type="date" />
                            </div>
                            <!-- Date time options -->
                            <div v-show="poll?.type == 2">
                                <label :for="newOption.id + 'dateTimeStart'">{{
                                    language?.uiElements.polls.create.optionValue
                                }}</label>
                                <input
                                    v-model="newOption.dateTimeStart"
                                    :id="newOption.id + 'dateTimeStart'"
                                    type="datetime-local"
                                />
                                <label :for="newOption.id + 'dateTimeEnd'">{{
                                    language?.uiElements.polls.create.optionOptEndValue
                                }}</label>
                                <input
                                    v-model="newOption.dateTimeEnd"
                                    :id="newOption.id + 'dateTimeEnd'"
                                    type="datetime-local"
                                />
                            </div>
                            <button @click="addOption" style="padding: 0.5rem">
                                <save-icon class="normalIcon" />
                            </button>
                            <button @click="addingOption = false">
                                {{ language?.uiElements.polls.details.cancel }}
                            </button>
                        </div>
                    </th>
                </tr>

                <poll-user-vote-row
                    :userData="userData"
                    :language="language"
                    :userVote="getVotesByUser()"
                    :pollData="poll"
                    :note="poll?.userNotes?.find((note) => note.user.id == userData?.id)?.note"
                    :displayUsernameInsteadOfFull="displayUsernameInsteadOfFull"
                    @voteChange="voteUpdateCallback"
                    class="currentUserVotes"
                    @noteChange="noteChangeCallback"
                />
                <poll-user-vote-row
                    v-for="vote in poll?.userVotes"
                    :key="vote.user.id"
                    v-show="vote.user.id != userData?.id"
                    :userData="userData"
                    :note="poll?.userNotes?.find((note) => note.user.id == vote.user.id)?.note"
                    :language="language"
                    :userVote="vote"
                    :pollData="poll"
                    :displayUsernameInsteadOfFull="displayUsernameInsteadOfFull"
                    @voteChange="voteUpdateCallback"
                    @kickedID="userKicked"
                    @noteChange="noteChangeCallback"
                />
            </table>
        </div>

        <button v-show="mayEdit()" style="background: var(--alert-color)" @click="deletePoll()">
            {{ language?.uiElements.polls.details.deletePollBtn }}
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

            // update votes every 60 seconds
            let intID: any = 0
            const that = this
            intID = setInterval(() => {
                // @ts-ignore
                if (that.$route.params.id == undefined && !that.$route.fullPath.includes("polls")) {
                    clearInterval(intID)
                }
                this.setup()
            }, 60 * 1000)
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
                (this.$route.query.join == true && !this.isJoined) ??
                false
            ) {
                try {
                    await this.joinPoll()
                } catch (e) {
                    console.warn(e)
                }
            }
        }

        get isJoined() {
            return this.userData?.polls.find((poll) => poll.id == this.pollID) != undefined
        }

        async joinPoll() {
            await axios.put("/api/poll", { inviteLink: this.pollID }, { withCredentials: true })
            // @ts-ignore
            window.location = "/#/polls/" + this.pollID
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

        async noteChangeCallback() {
            await this.setup()
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

    .info-text {
        font-style: italic;
        font-size: 0.8rem;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    .poll-main {
        border-radius: 1ch;
    }
</style>
