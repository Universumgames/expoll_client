<template>
    <div class="listContainer">
        <div v-show="loading">
            <blank-poll-list-element v-for="n in 20" :key="n" :language="language" />
        </div>
        <loading-screen v-show="loading" :language="languageData" :user-data="undefined" />
        <router-link to="/create">
            <button>
                <span title="Create Poll">+ {{
                    language?.uiElements.polls.list.createBtn
                }}</span>
            </button>
        </router-link>
        <div v-for="poll in polls" :key="poll.pollID">
            <poll-list-element :poll="poll" :language="language" />
        </div>
    </div>
</template>

<script setup lang="ts">
import PollListElement from "../components/PollListElement.vue"
import LoadingScreen from "../components/LoadingScreen.vue"
import BlankPollListElement from "../components/Blanks/BlankPollListElement.vue"

import { IUser } from "@/lib/interfaces"
import { languageData } from "@/scripts/languageConstruct"
import { SimplePoll } from "@/lib/extraInterfaces"
import { getPollOverviews } from "@/scripts/poll"
import { onMounted, ref } from "vue"

defineProps<{
    userData: IUser | undefined
    language: languageData
    tryAdminView?: boolean
}>()

const polls = ref<SimplePoll[]>([])
const loading = ref(true)

onMounted(async () => {
    const pollData = await getPollOverviews()
    if (pollData == undefined) {
        window.location.href = "/#/login"
    }
    polls.value = pollData?.polls ?? []

    loading.value = false
})
</script>

<style scoped>
.listContainer {
    margin: 0;
    padding: 0;
}

button {
    border-radius: 1ch;
    padding: 1ch;

}
</style>
