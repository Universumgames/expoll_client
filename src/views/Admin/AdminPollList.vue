<template>
    <loading-screen v-if="this.loading" />
    <div v-if="!this.loading">
        <label>Poll Count: {{ this.count }}</label>
    </div>
    <div v-for="poll in this.polls" :key="poll.id">
        <poll-list-element :poll="poll" :language="language" />
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { IUser } from "expoll-lib/interfaces"
    import { languageData } from "../../scripts/languageConstruct"
    import axios from "axios"
    import LoadingScreen from "../../components/LoadingScreen.vue"
    import PollListElement from "../../components/PollListElement.vue"
    import { AdminPollListResponse } from "expoll-lib/requestInterfaces"
    import { SimplePoll } from "expoll-lib/extraInterfaces"

    @Options({
        props: {
            userData: Object,
            language: Object
        },
        components: {
            LoadingScreen,
            PollListElement
        }
    })
    export default class AdminPollList extends Vue {
        userData: IUser | undefined
        language?: languageData

        polls: SimplePoll[] = []
        count: number = 0
        loading = true

        async mounted() {
            const data = (await axios.get("/api/admin/polls", { withCredentials: true })).data as AdminPollListResponse
            this.polls = data.polls
            this.count = data.totalCount

            this.$forceUpdate()

            this.loading = false
        }
    }
</script>
