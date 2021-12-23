<template>
    <div style="text-align: left">
        <h2>{{ this.poll?.name }}</h2>
        <small>{{ this.pollID }}</small>
        <div>{{ this.poll?.description }}</div>
    </div>
    <br />

    <table>
        <tr>
            <th>{{ this.language?.uiElements.polls.details.userCol }}</th>
            <th v-for="option in this.poll?.options" :key="option.key">{{ optionValue(option) }}</th>
        </tr>
        <tr>
            <th>{{ this.userData?.username }}</th>
            <th v-for="voteOpt in this.getVotesByUser()" :key="voteOpt.optionID">
                {{ voteOpt.votedFor }}
            </th>
        </tr>
        <tr v-for="vote in this.poll?.userVotes" :key="vote.user.id" v-show="vote.user.id != userData.id">
            <th>{{ vote.user.username }}</th>
            <th v-for="voteOpt in vote.votes" :key="voteOpt.optionID">
                {{ voteOpt.votedFor }}
            </th>
        </tr>
    </table>
</template>

<script lang="ts">
    import axios from "axios"
    import { Options, Vue } from "vue-class-component"
    import { ComplexOption, DetailedPoll, simpleVote } from "../scripts/extraInterfaces"
    import { IPoll, IPollOption, IUser, PollType, tOptionId, tPollID, tUserID } from "../scripts/interfaces"
    import { languageData } from "../scripts/languageConstruct"

    /*
         votes: { user: User; votes: { optionID: tOptionId; votedFor: boolean }
     */

    @Options({
        props: {
            userData: Object,
            language: Object
        }
    })
    export default class DetailedPollView extends Vue {
        userData?: IUser
        language?: languageData

        poll?: DetailedPoll
        options?: ComplexOption[]

        async mounted() {
            this.poll = (
                await axios.get("/api/poll", {
                    params: {
                        pollID: this.pollID
                    }
                })
            ).data
            console.log(this.poll)

            if (this.userData != undefined) {
                this.poll = {
                    pollID: "1",
                    admin: this.userData!,
                    name: "testname",
                    description: "test description",
                    userCount: 0,
                    lastUpdated: new Date(),
                    created: new Date(),
                    type: PollType.String,
                    options: [
                        { id: 0, value: "testOption" },
                        { id: 1, value: "testOpt2" }
                    ],
                    userVotes: [
                        {
                            user: this.userData!,
                            votes: [
                                {
                                    optionID: 0,
                                    votedFor: true
                                },
                                {
                                    optionID: 1
                                }
                            ]
                        },
                        {
                            user: {
                                id: 2,
                                username: "testuser",
                                firstName: "Max",
                                lastName: "Mustermann"
                            },
                            votes: [
                                { optionID: 0 },
                                {
                                    optionID: 1,
                                    votedFor: true
                                }
                            ]
                        }
                    ]
                }
            }
            this.$forceUpdate()
            console.log(this.poll)
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
            return this.poll!.userVotes.find((vote) => vote.user.id == this.userData!.id)!.votes ?? []
        }

        get pollID(): string {
            // @ts-ignore
            return this.$route.params.id
        }
    }
</script>
