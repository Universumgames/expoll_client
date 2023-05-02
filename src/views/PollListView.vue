<template>
    <div class="listContainer">
        <div v-show="loading">
            <blank-poll-list-element v-for="n in 20" v-bind:key="n" :language="language" />
        </div>
        <loading-screen v-show="loading" />
        <router-link to="/create"><button><span title="Create Poll">+ {{ language?.uiElements.polls.list.createBtn
        }}</span></button></router-link>
        <div v-for="poll in polls" :key="poll.pollID">
            <poll-list-element :poll="poll" :language="language" />
        </div>


    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import PollListElement from "../components/PollListElement.vue" // @ is an alias to /src
import LoadingScreen from "../components/LoadingScreen.vue"
import BlankPollListElement from "../components/Blanks/BlankPollListElement.vue"

import { IUser } from "expoll-lib/interfaces"
import { languageData } from "../scripts/languageConstruct"
import { SimplePoll } from "expoll-lib/extraInterfaces"
import { getPollOverviews } from "../scripts/poll"

@Options({
    components: {
        PollListElement,
        LoadingScreen,
        BlankPollListElement
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
        if (pollData == undefined) {
            window.location.href = "/#/login"
        }
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
    border-radius: 1ch;
    padding: 1ch;

}

.createPoll {
    margin-top: 1rem;
}
</style>
