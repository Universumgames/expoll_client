<template>
    <popup padding="2ch">
        <template #header>
            <div class="editHeader">
                <button @click="emit('close')">
                    Cancel
                </button>
                Editing poll
                <button @click="save">
                    Save
                </button>
            </div>
        </template>
        <div class="smallEditsContainer">
            <!-- editing allowed -->
            <div>
                <label>{{ language.uiElements.polls.create.allowsEditingLabel }}</label>
                <toggle-switch
                    v-model="allowsEditing"
                />
            </div>
            <!-- Pollname -->
            <div>
                <label>{{ language.uiElements.polls.create.pollNameInputLabel }}</label>
                <input v-model="pollName" class="pollNameInput" type="text">
            </div>
            <!-- Max per user vote count -->
            <div>
                <label>{{ language.uiElements.polls.create.maxVoteLabel }}</label>
                <input v-model="maxPerUserVoteCount" type="number">
            </div>
            <!-- Allows maybe -->
            <div>
                <label>{{ language.uiElements.polls.create.allowsMaybeLabel }}</label>
                <toggle-switch v-model="allowsMaybe" />
            </div>
            <div>
                <label>{{ language.uiElements.polls.create.privateVoting }}</label>
                <toggle-switch v-model="privateVoting" />
            </div>
        </div>
        <!-- Description -->
        <div>
            <label style="float:left;">{{ language.uiElements.polls.create.description }}</label>
            <br>
            <textarea v-model="description" style="min-width: 50vw; min-height: 20vh; max-width: 90vw" />
        </div>
        <!-- poll options -->
        <div class="optionsContainer">
            <button style="display: block" @click="addOption">
                {{ language.uiElements.polls.create.optionAdd }}
            </button>

            <div class="optionsList">
                <div v-for="(option, index) in options" :key="index">
                    <p>{{ optionValue(option) }}</p>
                    <div>
                        <p style="display: inline">
                            {{ option.id ?? "NEW" }}
                        </p>
                        <button class="delete" @click="deleteOption(option)">
                            {{ language.uiElements.polls.create.optionRemove }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <button style="background: var(--alert-color)" @click="deletePoll()">
            {{ language?.uiElements.polls.details.deletePollBtn }}
        </button>
    </popup>
</template>

<script lang="ts" setup>
import Popup from "@/components/utils/Popup.vue"
import { languageData } from "@/scripts/languageConstruct"
import ToggleSwitch from "@/components/utils/ToggleSwitch.vue"
import { computed, ref } from "vue"
import { EditPollRequest } from "@/types/requests"
import * as pollMethods from "@/scripts/poll"
import { optionToString } from "@/scripts/poll"
import { ComplexOption, DetailedPoll } from "@/types/poll"
import { IUser, PollType } from "@/types/bases"
import { ReturnCode } from "@/types/constants"

interface Props {
    userData: IUser
    language: languageData
    pollData: DetailedPoll
}

const props = defineProps<Props>()
const emit = defineEmits(["close"])

const changes = ref<EditPollRequest>({ pollID: "" })

const allowsEditing = computed({
    get: () => changes.value.allowsEditing ?? props.pollData.allowsEditing,
    set: (value) => (changes.value.allowsEditing = value)
})

const pollName = computed({
    get: () => changes.value.name ?? props.pollData.name,
    set: (value) => (changes.value.name = value)
})

const maxPerUserVoteCount = computed({
    get: () => changes.value.maxPerUserVoteCount ?? props.pollData.maxPerUserVoteCount,
    set: (value) => (changes.value.maxPerUserVoteCount = value)
})

const allowsMaybe = computed({
    get: () => changes.value.allowsMaybe ?? props.pollData.allowsMaybe,
    set: (value) => (changes.value.allowsMaybe = value)
})

const privateVoting = computed({
    get: () => changes.value.privateVoting ?? props.pollData.privateVoting,
    set: (value) => (changes.value.privateVoting = value)
})

const description = computed({
    get: () => changes.value.description ?? props.pollData.description,
    set: (value) => (changes.value.description = value)
})

const options = computed({
    get: () => props.pollData.options.filter((option) =>
        changes.value.options?.find((change) => change.id == option.id) == undefined
    ).concat(changes.value.options?.filter((change) =>
        change.id == undefined) ?? []),
    set: (value) => (changes.value.options = value)
})

const addOption = () => {
    let defaultPromptValue = ""
    if (props.pollData.type == PollType.Date) defaultPromptValue = "YYYY-MM-DD"
    else if (props.pollData.type == PollType.DateTime) defaultPromptValue = "YYYY-MM-DD HH:MM"
    else if (props.pollData.type == PollType.String) defaultPromptValue = "text"
    const value = prompt("Add option", defaultPromptValue)
    if (value == null || value == defaultPromptValue || value == "") return

    let value2: string | null = ""
    if (props.pollData.type == PollType.Date || props.pollData.type == PollType.DateTime) {
        value2 = prompt("Add end", defaultPromptValue)
        if (value2 == defaultPromptValue || value2 == "") value2 = null
    }

    if (changes.value.options == undefined) changes.value.options = []

    if (props.pollData.type == PollType.String) {
        changes.value.options.push({ value: value })
    } else if (props.pollData.type == PollType.Date) {
        changes.value.options.push(
            { dateStart: new Date(value).getTime(), dateEnd: value2 != null ? new Date(value2).getTime() : undefined })
    } else if (props.pollData.type == PollType.DateTime) {
        changes.value.options.push(
            {
                dateTimeStart: new Date(value).getTime(),
                dateTimeEnd: value2 != null ? new Date(value2).getTime() : undefined
            })
    }
}

const deleteOption = (option: ComplexOption) => {
    const deleteConfirm = confirm(props.language?.uiElements.polls.details.deleteConfirm(JSON.stringify(option)))
    if (deleteConfirm) {
        if (changes.value.options == undefined) changes.value.options = []
        if (option.id != undefined)
            changes.value.options.push({ id: option.id })
        else changes.value.options = changes.value.options.filter((opt) => opt != option)
    }
}

const optionValue = (option: ComplexOption): string => {
    return optionToString(option, props.pollData, props.language)
}

const save = async () => {
    const ret = await pollMethods.pushPollChanges(props.pollData.pollID, changes.value)
    if (ret == ReturnCode.OK) changes.value = { pollID: props.pollData.pollID }
    else alert("Error: " + ret)
    emit("close")
}

const pollNameLength = computed(() => {
    return pollName.value.length * 0.9 + "ch"
})

const deletePoll = async () => {
    const confirm1 = confirm(props.language?.uiElements.polls.details.deletePollConfirm)
    if (!confirm1) return
    const confirm2 = confirm(props.language?.uiElements.polls.details.deletePollConfirmConfirm)
    if (!confirm2) return

    await pollMethods.deletePoll(props.pollData.pollID)
    window.location.href = "/#/polls"
}

</script>

<style>
.smallEditsContainer > div,
.editHeader,
.optionsList > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
}

.editHeader {

}

.optionsContainer {
  background-color: var(--secondary-color);
  border-radius: var(--default-border-radius);
  padding: 2ch;
}
</style>

<style scoped>
.pollNameInput {
  width: v-bind(pollNameLength)
}
</style>