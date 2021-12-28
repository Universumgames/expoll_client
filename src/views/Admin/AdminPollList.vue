<template>
    <loading-screen v-if="this.loading" />
    <div v-for="poll in this.polls" :key="poll.id">
        <poll-list-element :poll="poll" :language="language" />
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { IPoll, IUser } from "../../scripts/interfaces"
    import { UserInfo } from "../../scripts/adminInterfaces"
    import { languageData } from "../../scripts/languageConstruct"
    import axios from "axios"
    import LoadingScreen from "../../components/LoadingScreen.vue"
    import PollListElement from "../../components/PollListElement.vue"

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

        polls: IPoll[] = []
        loading = true

        async mounted() {
            this.polls = (await axios.get("/api/admin/polls", { withCredentials: true })).data.polls

            this.$forceUpdate()

            this.loading = false
        }
    }
</script>
