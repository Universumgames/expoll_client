<template>
    <div style="text-align: left">
        <!-- name -->
        <div>
            <div v-show="this.changes.name == undefined">
                <h2 style="display: inline">{{ this.poll?.name }}</h2>
                <button @click="this.changes.name = this.poll?.name">
                    <edit-icon class="normalIcon" />
                </button>
            </div>
            <div v-show="this.changes.name != undefined">
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
        <!-- description -->
        <div style="margin-top: 1ch">
            <label>{{ this.language?.uiElements.polls.create.description }}</label
            ><button
                v-show="this.changes?.description == undefined"
                @click="this.changes.description = this.poll?.description"
            >
                <edit-icon class="normalIcon" /></button
            ><br />
            <div v-show="this.changes?.description == undefined">
                <p>{{ this.poll?.description }}</p>
            </div>
            <div v-show="this.changes?.description != undefined">
                <textarea name="description" cols="30" rows="10" v-model="this.changes.description"></textarea><br />
                <button @click="this.pushChanges">{{ this.language?.uiElements.polls.details.save }}</button>
                <button @click="this.changes.description = undefined">
                    {{ this.language?.uiElements.polls.details.cancel }}
                </button>
            </div>
        </div>
    </div>
    <br />

    <!-- Poll options and results -->
    <table>
        <tr>
            <th>{{ this.language?.uiElements.polls.details.userCol }}</th>
            <th v-for="option in this.poll?.options" :key="option.id">
                {{ optionValue(option) }}
                <br />
                <a @click="this.deleteOption(option.id)">
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
                        <input v-model="this.newOption.dateStart" :id="this.newOption.id + 'dateStart'" type="date" />
                        <label :for="this.newOption.id + 'dateEnd'">{{
                            this.language?.uiElements.polls.create.optionOptEndValue
                        }}</label>
                        <input v-model="this.newOption.dateEnd" :id="this.newOption.id + 'dateEnd'" type="date" />
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
        <tr>
            <th>{{ this.userData?.username }}</th>
            <td v-for="voteOpt in this.getVotesByUser()" :key="voteOpt.optionID">
                {{ voteOpt.votedFor ?? "?" }}
            </td>
        </tr>
        <tr v-for="vote in this.poll?.userVotes" :key="vote.user.id" v-show="vote.user.id != userData.id">
            <th>{{ vote.user.username }}</th>
            <td v-for="voteOpt in vote.votes" :key="voteOpt.optionID">
                {{ voteOpt.votedFor ?? "?" }}
            </td>
        </tr>
    </table>
</template>

<script lang="ts">
    import axios from "axios"
    import { Options, Vue } from "vue-class-component"
    import { ComplexOption, DetailedPoll, PollEdit, simpleVote } from "../scripts/extraInterfaces"
    import { IPoll, IPollOption, IUser, PollType, tOptionId, tPollID, tUserID } from "../scripts/interfaces"
    import { languageData } from "../scripts/languageConstruct"
    import SaveIcon from "../assetComponents/SaveIcon.vue"
    import EditIcon from "../assetComponents/EditIcon.vue"

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
            EditIcon
        }
    })
    export default class DetailedPollView extends Vue {
        userData?: IUser
        language?: languageData

        poll?: DetailedPoll
        newOption: ComplexOption = {}

        addingOption = false

        changes: PollEdit = { pollID: "" }

        async mounted() {
            await this.setup()
        }

        async setup() {
            this.poll = (
                await axios.get("/api/poll", {
                    params: {
                        pollID: this.pollID
                    },
                    withCredentials: true
                })
            ).data
            if (this.poll != undefined) this.changes = { pollID: this.poll.pollID }

            console.log(this.poll)
            this.$forceUpdate()
        }

        async checkAndJoinPoll() {
            if (
                // @ts-ignore
                this.$router.params.join == true &&
                this.userData!.polls.find((poll) => poll.id == this.pollID) == undefined
            ) {
                await axios.put("/api/poll", { inviteLink: this.pollID })
            }
        }

        optionValue(option: any): string {
            switch (this.poll?.type) {
                case PollType.String:
                    return option.value

                case PollType.Date:
                    return option.dateStart + (option.dateEnd != undefined) ? " " + option.dateEnd : ""

                case PollType.DateTime:
                    return option.dateTimeStart + (option.dateTimeEnd != undefined) ? " " + option.dateTimeEnd : ""
            }
            return ""
        }

        getVotesByUser(): simpleVote[] {
            if (this.poll == undefined) return []
            return this.poll.userVotes.find((vote) => vote.user.id == this.userData?.id)?.votes ?? []
        }

        get pollID(): string {
            // @ts-ignore
            return this.$route.params.id
        }

        mayEdit(): boolean {
            return this.poll?.admin.id == this.userData?.id ?? false
        }

        async pushChanges() {
            try {
                if (!this.mayEdit) return
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

            console.log(this.newOption)

            this.newOption = {}
        }

        async deleteOption(optionID: tOptionId) {
            const option = this.poll?.options.find((opt) => opt.id == optionID)
            if (option == undefined) return
            const deleteConfirm = confirm(this.language?.uiElements.polls.details.deleteConfirm(JSON.stringify(option)))
            if (deleteConfirm) {
                if (this.changes.options == undefined) this.changes.options = []
                this.changes.options.push({ optionID: optionID })
                await this.pushChanges()
            }
        }
    }
</script>

<style scoped>
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

    td,
    th {
        padding: 0.5rem;
        background: var(--secondary-color);
    }

    td > input,
    th > input,
    .addOption > div > input {
        background: var(--bg-color);
    }

    a {
        cursor: pointer;
    }
</style>
