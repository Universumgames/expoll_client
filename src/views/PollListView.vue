<template>
    <div class="listContainer">
        <loading-screen v-show="this.loading" />
        <div v-for="poll in polls" :key="poll.id">
            <poll-list-element :poll="poll" :language="language" />
        </div>

        <router-link to="/create"
            ><button><span title="Create Poll">+</span></button></router-link
        >
    </div>
</template>

<script lang="ts">
    import axios from "axios"
    import { Options, Vue } from "vue-class-component"
    import PollListElement from "../components/PollListElement.vue" // @ is an alias to /src
    import LoadingScreen from "../components/LoadingScreen.vue"

    import { IPoll, IUser } from "expoll-lib/interfaces"
    import { languageData } from "../scripts/languageConstruct"
    import { SimplePoll } from "expoll-lib/extraInterfaces"
    import { getPollOverviews } from "../scripts/poll"

    @Options({
        components: {
            PollListElement,
            LoadingScreen
        },
        props: {
            userData: Object,
            language: Object,
            tryAdminView: Boolean
        }
    })
    export default class PollListView extends Vue {
        userData!: IUser
        polls: SimplePoll[] = []
        tryAdminView?: boolean

        loading = true

        language?: languageData

        create: boolean = false

        async mounted() {
            const pollData = await getPollOverviews()
            this.polls = pollData?.polls ?? []

            this.$forceUpdate()

            this.loading = false
        }

        createPoll() {
            this.create = true
        }
    }
</script>

<style scoped>
    .listContainer {
        margin-left: auto;
        margin-right: auto;
    }

    button {
        border-radius: 50%;
        padding: 1ch;
        width: 3rem;
        height: 3rem;
    }

    .createPoll {
        margin-top: 1rem;
    }
</style>
