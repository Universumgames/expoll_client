<template>
    <router-link :to="'/polls/' + poll.pollID" class="pollListElementContainer" tabindex="0" :aria-label="language.uiElements.polls.list.elementAriaLabel(poll)">
        <template v-if="isSmall(displaySize)">
            <div>
                {{ poll.name }}
            </div>
            <div>
                <div style="display: inline-block; margin-right: 3ch">
                    <div style="display: inline; margin: 1ch; top: -1ch; position: relative">
                        {{ poll.userCount }}
                    </div>
                    <user-group-icon fill="var(--text-color)" width="4ch" />
                </div>
                <div style="display: inline-block">
                    <small style="white-space: pre-wrap">{{ lastUpdated }}</small><br>
                    <small
                        v-show="!poll.allowsEditing"
                        class="delete"
                        style="padding: 0.5ch; border-radius: 0.5rem"
                    >
                        {{ poll.allowsEditing ? "" : language?.uiElements.polls.details.editingDisabled }}
                    </small>
                </div>
            </div>
        </template>
        <template v-else>
            <div>
                {{ poll.name }}
                <small style="display: block">
                    {{ poll.pollID }}
                </small>
                <div v-if="!poll.allowsEditing">
                    <br>
                    <small
                        class="delete"
                        style="padding: 0.5ch; border-radius: 0.5rem"
                    >
                        {{ poll.allowsEditing ? "" : language?.uiElements.polls.details.editingDisabled }}
                    </small>
                </div>
            </div>
            <div>
                <div style="display: inline; margin: 1ch; top: -1ch; position: relative">
                    {{ poll.userCount }}
                </div>
                <user-group-icon fill="var(--text-color)" width="4ch" />
            </div>
            <div style="display: inline-block">
                <p>
                    {{ lastUpdated }}
                </p>
            </div>

            <div>
                Admin:
                <span style="white-space: nowrap">{{ poll?.admin.firstName + " " + poll?.admin.lastName }}</span>
            </div>
        </template>
    </router-link>
</template>

<script lang="ts" setup>
import type { languageData } from "@/scripts/languageConstruct"
import { computed } from "vue"
import { DisplaySize, isMobile, isSmall } from '@/scripts/displayHelper'
import UserGroupIcon from "@/assetComponents/UserGroupIcon.vue"
import type { PollSummary } from "@/types/poll"

const props = defineProps<{
    poll: PollSummary,
    language: languageData,
    displaySize: DisplaySize
}>()

const lastUpdated = computed(() => (
    props.language?.uiElements.polls.list.lastUpdate(
        props.language?.uiElements.dateTimeToString(new Date(props.poll?.lastUpdated))
    ) ?? ""
))
</script>

<style scoped>
.pollListElementContainer {
  background: var(--secondary-color);
  border-radius: var(--default-border-radius);
  margin-bottom: 1ch;
  padding: 2ch;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.pollListElementContainer:hover {
  background: var(--bg-color);
}

.pollListElementContainer > * {
  display: inline;
  margin-bottom: 1ch;
  text-align: left;
}
</style>