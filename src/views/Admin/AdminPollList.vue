<template>
    <loading-screen v-if="loading" />
    <div v-if="!loading">
        <label>Poll Count: {{ count }}</label>
    </div>
    <div v-for="poll in polls" :key="poll.pollID">
        <poll-list-element :poll="poll" :language="language" />
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { IUser } from "expoll-lib/interfaces"
    import { languageData } from "../../scripts/languageConstruct"
    import LoadingScreen from "../../components/LoadingScreen.vue"
    import PollListElement from "../../components/PollListElement.vue"
    import { SimplePoll } from "expoll-lib/extraInterfaces"
    import { getAllPolls } from "@/scripts/admin"

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
            const data = await getAllPolls()
            if (data == undefined) return
            this.polls = data.polls
            this.count = data.totalCount

            this.$forceUpdate()

            this.loading = false
        }
    }
</script>
