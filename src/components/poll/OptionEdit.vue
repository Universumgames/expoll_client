<script lang="ts" setup>
import { type IUser, PollType } from '@/types/bases'
import type { languageData } from '@/scripts/languageConstruct'
import type { ComplexOption } from '@/types/poll'
import DateTimestampInput from '@/components/utils/DateTimestampInput.vue'

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
  const option: ComplexOption =
    {
      value: '',
      dateStart: new Date().getTime(),
      dateEnd: undefined,
      dateTimeStart: new Date().getTime(),
      dateTimeEnd: undefined,
      isNew: true,
      id: findUnusedOptionID()
    }

  console.log(option)
  props.addOption(option)
}

const findUnusedOptionID = () => {
  let id = 0
  while (props.options.find((option) => option.id == id) != undefined) id++
  return id
}

const getOptionTime = (option: ComplexOption, startOrEnd: boolean): string | undefined => {
  if (props.type == PollType.Date) {
    if (option.dateEnd == undefined) return undefined
    return new Date(startOrEnd ? option.dateStart! : option.dateEnd).toISOString().split('T')[0]
  } else if (props.type == PollType.DateTime) {
    if (option.dateTimeEnd == undefined) return undefined
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
        <button @click="removeOption(option.id ?? 0)" tabindex="0" aria-label="Remove option">
          -
        </button>

        <!-- String poll options -->
        <div v-show="type == PollType.String">
          <label :for="option.id + 'value'">{{ language?.uiElements.polls.create.optionValue }}</label>
          <input :id="option.id + 'value'" v-model="option.value" :disabled="!option.isNew" type="text">
          <label v-show="editable && option.value == ''" class="errorInfo">{{
              language?.uiElements.polls.create.emptyField
            }}</label>
        </div>
        <!-- Date options -->
        <div v-if="type == PollType.Date">
          <label :for="option.id + 'dateStart'">{{ language?.uiElements.polls.create.optionValue }}</label>
          <date-timestamp-input :id="option.id + 'dateStart'" v-model="option.dateStart" :disabled="!option.isNew"
                                dateType="date"
          />

          <label v-show="editable && option.dateStart == undefined" class="errorInfo">{{
              language?.uiElements.polls.create.emptyField
            }}</label>
          <template v-if="option.dateEnd != undefined || option.isNew">
            <label :for="option.id + 'dateEnd'">{{
                language?.uiElements.polls.create.optionOptEndValue
              }}</label>
            <input v-if="option.isNew" type="checkbox" :value="option.dateEnd == undefined" @change="option.dateEnd = (($event.target! as HTMLInputElement).checked ? new Date().getTime() : undefined)" :disabled="!option.isNew">
            <date-timestamp-input v-if="option.dateEnd != undefined" :id="option.id + 'dateEnd'" v-model="option.dateEnd" :disabled="!option.isNew"
                                  dateType="date"
            />
          </template>
        </div>
        <!-- Date time options -->
        <div v-if="type == PollType.DateTime">
          <label :for="option.id + 'dateTimeStart'">{{
              language?.uiElements.polls.create.optionValue
            }}</label>
          <date-timestamp-input :id="option.id + 'dateTimeStart'" v-model="option.dateTimeStart"
                                :disabled="!option.isNew"
                                dateType="datetime-local"
          />

          <label v-if="option.dateTimeEnd != undefined" v-show="editable && option.dateTimeStart == undefined"
                 class="errorInfo"
          >{{
              language?.uiElements.polls.create.emptyField
            }}</label>
          <template v-if="option.dateEnd != undefined || option.isNew">
            <label :for="option.id + 'dateTimeEnd'">{{
                language?.uiElements.polls.create.optionOptEndValue
              }}</label>
            <input v-if="option.isNew" type="checkbox" :value="option.dateTimeEnd == undefined" @change="option.dateTimeEnd = (($event.target! as HTMLInputElement).checked ? new Date().getTime() : undefined)" :disabled="!option.isNew">
            <date-timestamp-input v-if="option.dateTimeEnd != undefined" :id="option.id + 'dateTimeEnd'" v-model="option.dateTimeEnd" :disabled="!option.isNew"
                                  dateType="datetime-local"
            />
          </template>
        </div>

        <p v-if="option.isNew" style="display: inline;margin: 1ch">
          {{ 'NEW' }}
        </p>
      </div>
    </div>
    <br>
    <button @click="addOptionLocal" tabindex="0">
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