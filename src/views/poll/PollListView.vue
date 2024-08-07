<template>
    <div class="listContainer">
        <div v-show="loading">
            <BlankPollListElement v-for="n in 20" :key="n" :language="language" />
        </div>
        <LoadingScreen v-show="loading" />
        <RouterLink to="/create">
            <button>
                <span title="Create Poll">+ {{
                    language?.uiElements.polls.list.createBtn
                }}</span>
            </button>
        </RouterLink>
        <div class="pollList">
            <small>{{ language.uiElements.polls.list.grouping.latest }}</small>
            <PollListElement
                v-for="poll in filtered(Filter.latest)" :key="poll.pollID"
                :poll="poll" :language="language"
                :display-size="displaySize"
            />
            <hr class="divider"/>
            <small>{{ language.uiElements.polls.list.grouping.quarter }}</small>
            <PollListElement
                v-for="poll in filtered(Filter.quarter)" :key="poll.pollID"
                :poll="poll" :language="language"
                :display-size="displaySize"
            />
            <hr class="divider"/>
            <small>{{ language.uiElements.polls.list.grouping.year }}</small>
            <PollListElement
                v-for="poll in filtered(Filter.year)" :key="poll.pollID"
                :poll="poll" :language="language"
                :display-size="displaySize"
            />
            <hr class="divider"/>
            <small>{{ language.uiElements.polls.list.grouping.older }}</small>
            <PollListElement
                v-for="poll in filtered(Filter.older)" :key="poll.pollID"
                :poll="poll" :language="language"
                :display-size="displaySize"
            />
            <hr class="divider"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import PollListElement from "../../components/poll/PollListElement.vue"
import LoadingScreen from "../../components/utils/LoadingScreen.vue"
import BlankPollListElement from "../../components/Blanks/BlankPollListElement.vue"

import type { languageData } from "@/scripts/languageConstruct"
import { getPollOverviews } from "@/scripts/poll"
import { onMounted, ref } from "vue"
import { DisplaySize } from "@/scripts/displayHelper"
import type { PollSummary } from "@/types/poll"
import type { IUser } from "@/types/bases"
import Divider from "@/components/utils/DividerView.vue"

defineProps<{
    userData: IUser | undefined
    language: languageData
    tryAdminView?: boolean
    displaySize: DisplaySize
}>()

const polls = ref<PollSummary[]>([])
const loading = ref(true)

onMounted(async () => {
    const pollData = await getPollOverviews()
    if (pollData == undefined) {
        window.location.href = "/#/login"
    }
    polls.value = pollData?.polls ?? []

    loading.value = false
})

enum Filter {
    latest, // last 30 days
    quarter,
    year,
    older
}

const filtered = (filter: Filter) => {

    const now = new Date()
    const latest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)
    const quarter = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
    const year = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    const older = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())

    switch (filter) {
        case Filter.latest:
            return polls.value.filter(poll => new Date(poll.lastUpdated) > latest)
        case Filter.quarter:
            return polls.value.filter(poll => new Date(poll.lastUpdated) > quarter
                && new Date(poll.lastUpdated) < latest)
        case Filter.year:
            return polls.value.filter(poll => new Date(poll.lastUpdated) > year
                && new Date(poll.lastUpdated) < quarter)
        case Filter.older:
            return polls.value.filter(poll => new Date(poll.lastUpdated) < older)
    }
}
</script>

<style>
.listContainer {
    margin: 0;
    padding: 0;
}

.pollList {
  text-align: left;
}
</style>
