<template>
    <LoadingScreen v-if="loading" />
    <div v-if="!loading">
        <label>Poll Count: {{ count }}</label>
    </div>
    <div v-for="poll in polls" :key="poll.pollID">
        <PollListElement :poll="poll" :language="language" :display-size="displaySize" />
    </div>
</template>

<script setup lang="ts">
import LoadingScreen from "@/components/utils/LoadingScreen.vue"
import PollListElement from "@/components/poll/PollListElement.vue"
import { getAllPolls } from "@/scripts/admin"
import { onMounted, ref } from "vue"
import type { DisplaySize } from '@/scripts/displayHelper'
import type { IUser } from '@/types/bases'
import type { PollSummary } from '@/types/poll'
import type { languageData } from '@/scripts/languageConstruct'

defineProps<{ userData?: IUser, language: languageData, displaySize: DisplaySize }>()

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
