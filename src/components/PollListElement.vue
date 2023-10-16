<template>
    <router-link :to="'/polls/' + poll.pollID" class="pollListElementContainer">
        <div>
            {{ poll.name }}
            <small v-if="!isMobile(displaySize)" style="display: block">
                <small>
                    {{ poll.pollID }}
                </small>
            </small>
            <br>
            <small 
                v-if="!isMobile(displaySize)"
                v-show="!poll.editable"
                class="delete"
                style="padding: 0.5ch; border-radius: 0.5rem"
            >
                {{ poll.editable ? "" : language?.uiElements.polls.details.editingDisabled }}
            </small>
        </div>
        <div v-if="!isMobile(displaySize)">
            <div style="display: inline; margin: 1ch; top: -1ch; position: relative">
                {{ poll.userCount }}
            </div>
            <user-group-icon fill="var(--text-color)" width="4ch" />
        </div>
        <div>
            <div v-if="isMobile(displaySize)" style="display: inline-block; margin-right: 3ch">
                <div style="display: inline; margin: 1ch; top: -1ch; position: relative">
                    {{ poll.userCount }}
                </div>
                <user-group-icon fill="var(--text-color)" width="4ch" />
            </div>
            <div style="display: inline-block">
                <p v-if="!isMobile(displaySize)">
                    {{ lastUpdated }}
                </p>
                <small v-else style="white-space: pre-wrap">{{ lastUpdated }}</small><br>
                <small 
                    v-if="isMobile(displaySize)" 
                    v-show="!poll.editable" 
                    class="delete" 
                    style="padding: 0.5ch; border-radius: 0.5rem"
                >
                    {{ poll.editable ? "" : language?.uiElements.polls.details.editingDisabled }}
                </small>
            </div>
        </div>
        <div v-if="!isMobile(displaySize)">
            Admin:
            <span style="white-space: nowrap">{{ poll?.admin.firstName + " " + poll?.admin.lastName }}</span>
        </div>
    </router-link>
</template>

<script lang="ts" setup>
import { languageData } from "@/scripts/languageConstruct"
import { SimplePoll } from "@/lib/extraInterfaces"
import { computed } from "vue"
import { DisplaySize, isMobile } from "@/scripts/displayHelper"
import UserGroupIcon from "@/assetComponents/UserGroupIcon.vue"

const props = defineProps<{
    poll: SimplePoll,
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