<template>
  <popup padding="2ch">
    <template #header>
      <div class="editHeader">
        <button @click="emit('close')" tabindex="0">
          Cancel
        </button>
        Editing poll
        <button @click="save" tabindex="0">
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
    <option-edit :add-option="addOption" :editable="true" :language="language" :options="[...options, ...(changes.options ?? [])]" :remove-option="deleteOption"
                 :type="pollData.type"
    />

    <button style="background: var(--alert-color)" @click="deletePoll()" tabindex="0">
      {{ language?.uiElements.polls.details.deletePollBtn }}
    </button>
  </popup>
</template>

<script lang="ts" setup>
import Popup from '@/components/utils/PopupView.vue'
import type { languageData } from '@/scripts/languageConstruct'
import ToggleSwitch from '@/components/utils/ToggleSwitch.vue'
import { computed, ref } from 'vue'
import type { EditPollRequest } from '@/types/requests'
import * as pollMethods from '@/scripts/poll'
import type { ComplexOption, DetailedPoll } from '@/types/poll'
import { ReturnCode, type tOptionId } from '@/types/constants'
import { type IUser } from '@/types/bases'
import OptionEdit from '@/components/poll/OptionEdit.vue'

interface Props {
  userData: IUser
  language: languageData
  pollData: DetailedPoll
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const changes = ref<EditPollRequest>({ pollID: '' })

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

const addOption = (option: ComplexOption) => {
  if (changes.value.options == undefined) changes.value.options = []

  changes.value.options.push(option)
}

const deleteOption = (id: tOptionId) => {
  const option = props.pollData.options.find((opt) => opt.id == id)
  if (option == undefined) return
  const deleteConfirm = confirm(props.language?.uiElements.polls.details.deleteConfirm(JSON.stringify(option)))
  if (deleteConfirm) {
    if (changes.value.options == undefined) changes.value.options = []
    if (option.id != undefined)
      changes.value.options.push({ id: option.id })
    else changes.value.options = changes.value.options.filter((opt) => opt != option)
  }
}

const save = async () => {
  const ret = await pollMethods.pushPollChanges(props.pollData.pollID, changes.value)
  if (ret == ReturnCode.OK) changes.value = { pollID: props.pollData.pollID }
  else alert('Error: ' + ret)
  emit('close')
}

const pollNameLength = computed(() => {
  return pollName.value.length * 0.9 + 'ch'
})

const deletePoll = async () => {
  const confirm1 = confirm(props.language?.uiElements.polls.details.deletePollConfirm)
  if (!confirm1) return
  const confirm2 = confirm(props.language?.uiElements.polls.details.deletePollConfirmConfirm)
  if (!confirm2) return

  await pollMethods.deletePoll(props.pollData.pollID)
  window.location.href = '/#/polls'
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