<script lang="ts" setup>
import { type IUser, PollType } from '@/types/bases'
import type { languageData } from '@/scripts/languageConstruct'
import type { ComplexOption } from '@/types/poll'

const props = defineProps<{
  userData?: IUser,
  language: languageData,
  type: PollType,
  options: ComplexOption[],
  editable: boolean,
  removeOption: (id: number) => void,
  addOption: (option: ComplexOption) => void
}>()

const addOptionLocal = () => {
  let defaultPromptValue = ''
  if (props.type == PollType.Date) defaultPromptValue = 'YYYY-MM-DD'
  else if (props.type == PollType.DateTime) defaultPromptValue = 'YYYY-MM-DD HH:MM'
  else if (props.type == PollType.String) defaultPromptValue = 'text'
  const value = prompt('Add option', defaultPromptValue)
  if (value == null || value == defaultPromptValue || value == '') return

  let value2: string | null = ''
  if (props.type == PollType.Date || props.type == PollType.DateTime) {
    value2 = prompt('Add end', defaultPromptValue)
    if (value2 == defaultPromptValue || value2 == '') value2 = null
  }

  const option =
    {
      value: value,
      dateStart: new Date(value).getTime(),
      dateEnd: value2 != null ? new Date(value2).getTime() : undefined,
      dateTimeStart: new Date(value).getTime(),
      dateTimeEnd: value2 != null ? new Date(value2).getTime() : undefined,
      isNew: true,
      id: finUnusedOptionID()
    }

  console.log(option)

  props.addOption(option)
}

const finUnusedOptionID = () => {
  let id = 0
  while (props.options.find((option) => option.id == id) != undefined) id++
  return id
}

const setOptionTime = (option: ComplexOption, value: InputEvent) => {
  const time = new Date(value.target!.value).getTime()
  if (props.type == PollType.Date) {
    option.dateStart = time
  } else if (props.type == PollType.DateTime) {
    option.dateTimeStart = time
  }
}

const getOptionTime = (option: ComplexOption, startOrEnd: boolean): string | undefined => {
  if (props.type == PollType.Date) {
    if(option.dateEnd == undefined) return undefined
    return new Date(startOrEnd ? option.dateStart! : option.dateEnd).toISOString().split('T')[0]
  } else if (props.type == PollType.DateTime) {
    if(option.dateTimeEnd == undefined) return undefined
    return new Date(startOrEnd ? option.dateTimeStart! : option.dateTimeEnd).toISOString()
  }
}
</script>

<template>
  <div style="margin-top: 5ch">
    <label>{{ language?.uiElements.polls.create.optionList }}</label>

    <div>
      <div v-for="option in options" :key="option.id" class="optionElement">
        <label>{{ language?.uiElements.polls.create.optionName(option.id ?? 0) }}</label>
        <button @click="removeOption(option.id ?? 0)">
          -
        </button>

        <!-- String poll options -->
        <div v-show="type == 0">
          <label :for="option.id + 'value'">{{ language?.uiElements.polls.create.optionValue }}</label>
          <input :id="option.id + 'value'" v-model="option.value" :disabled="!option.isNew" type="text">
          <label v-show="editable && option.value == ''" class="errorInfo">{{
              language?.uiElements.polls.create.emptyField
            }}</label>
        </div>
        <!-- Date options -->
        <div v-show="type == 1">
          <label :for="option.id + 'dateStart'">{{ language?.uiElements.polls.create.optionValue }}</label>
          <input :id="option.id + 'dateStart'" :value="getOptionTime(option, false)" @input="setOptionTime(option, $event)" :disabled="!option.isNew" type="date">
          <label v-show="editable && option.dateStart == undefined" class="errorInfo">{{
              language?.uiElements.polls.create.emptyField
            }}</label>
          <label v-if="option.dateEnd != undefined" :for="option.id + 'dateEnd'">{{
              language?.uiElements.polls.create.optionOptEndValue
            }}</label>
          <input v-if="option.dateEnd != undefined" :id="option.id + 'dateEnd'" v-model="option.dateEnd"
                 :disabled="!option.isNew"
                 type="date"
          >
        </div>
        <!-- Date time options -->
        <div v-show="type == 2">
          <label :for="option.id + 'dateTimeStart'">{{
              language?.uiElements.polls.create.optionValue
            }}</label>
          <input :id="option.id + 'dateTimeStart'" v-model="option.dateTimeStart" :disabled="!option.isNew"
                 type="datetime-local"
          >
          <label v-if="option.dateTimeEnd != undefined" v-show="editable && option.dateTimeStart == undefined"
                 class="errorInfo"
          >{{
              language?.uiElements.polls.create.emptyField
            }}</label>
          <label :for="option.id + 'dateTimeEnd'">{{
              language?.uiElements.polls.create.optionOptEndValue
            }}</label>
          <input v-if="option.dateTimeEnd != undefined" :id="option.id + 'dateTimeEnd'" v-model="option.dateTimeEnd"
                 :disabled="!option.isNew" type="datetime-local"
          >
        </div>

        <p v-if="option.isNew" style="display: inline;margin: 1ch">
          {{ 'NEW' }}
        </p>
      </div>
    </div>
    <br>
    <button @click="addOptionLocal">
      {{ language?.uiElements.polls.create.optionListAddOption }}
    </button>
    <br>
  </div>
</template>

<style scoped>
.optionElement > button {
  padding: 0.5ch 1ch;
}

.optionElement > div {
  display: inline;
}

.optionElement > div > input {
  background: var(--bg-color);
}

.optionElement {
  background: var(--secondary-color);
  border-radius: var(--default-border-radius);
  padding: 1ch;
  margin: 1ch;
}
</style>