<template>
    <loading-screen v-if="loading" />
    <div v-if="!loading">
        <label>Poll Count: {{ count }}</label>
    </div>
    <div v-for="poll in polls" :key="poll.pollID">
        <poll-list-element :poll="poll" :language="language" />
    </div>
</template>

<script setup lang="ts">
import { languageData } from "@/scripts/languageConstruct"
import LoadingScreen from "@/components/LoadingScreen.vue"
import PollListElement from "@/components/PollListElement.vue"
import { getAllPolls } from "@/scripts/admin"
import { onMounted, ref } from "vue"
import { PollSummary } from "@/types/poll"
import { IUser } from "@/types/bases"

defineProps<{ userData?: IUser, language: languageData }>()

const polls = ref<PollSummary[]>([])
const count = ref(0)
const loading = ref(true)

onMounted(async () => {
    const data = await getAllPolls()
    if (data == undefined) return
    polls.value = data.polls
    count.value = data.totalCount

    loading.value = false
})
</script>
