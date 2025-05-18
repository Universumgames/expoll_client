<template>
  <div>
    <h2>{{ language?.uiElements.polls.create.createPoll(pollName) }}</h2>

    <div>
      * <small>{{ language?.uiElements.polls.create.notEditableAfterCreation }}</small>
    </div>

    <label for="pollNameInput">{{ language?.uiElements.polls.create.pollNameInputLabel }}</label>
    <input id="pollNameInput" v-model="pollName" type="text">
    <label v-show="clicked && pollName == ''" class="errorInfo">{{
        language?.uiElements.polls.create.emptyField
      }}</label>
    <br>

    <label for="pollDescriptionInput">{{ language?.uiElements.polls.create.description }}</label>
    <textarea
      id="pollDescriptionInput" v-model="description"
      cols="50" maxlength="65535"
      rows="7" type="text"
    /><br>
    <label v-show="clicked && description == ''" class="errorInfo">{{
        language?.uiElements.polls.create.emptyField
      }}</label><br>

    <label for="typeSelect"> {{ language?.uiElements.polls.create.typeSelect.label }}* </label>

    <select id="typeSelect" v-model="type">
      <option :value="0">
        {{ language?.uiElements.polls.create.typeSelect.stringOption }}
      </option>
      <option :value="1">
        {{ language?.uiElements.polls.create.typeSelect.dateOption }}
      </option>
      <option :value="2">
        {{ language?.uiElements.polls.create.typeSelect.dateTimeOption }}
      </option>
    </select>

    <br>

    <label for="defaultVote">{{ language?.uiElements.polls.create.defaultVote }}*</label>

    <select id="defaultVote" v-model="defaultVote">
      <option value="-1">
        {{ language?.uiElements.polls.votes.unknown }}
      </option>
      <option value="0">
        {{ language?.uiElements.polls.votes.no }}
      </option>
      <option value="1">
        {{ language?.uiElements.polls.votes.yes }}
      </option>
      <option value="2">
        {{ language?.uiElements.polls.votes.maybe }}
      </option>
    </select>

    <br>

    <label for="pollMaxVote">{{ language?.uiElements.polls.create.maxVoteLabel }}</label>
    <input id="pollMaxVote" v-model="maxVoteCount" min="-1" type="number"><br>

    <label for="allowsMaybe">{{ language?.uiElements.polls.create.allowsMaybeLabel }}</label>
    <input id="allowsMaybe" v-model="allowsMaybe" type="checkbox"><br>

    <label for="useUTC" v-if="type == PollType.DateTime">{{ language?.uiElements.polls.create.useUTC }}</label>
    <input id="useUTC" v-model="useUTC" type="checkbox" v-if="type == PollType.DateTime"><br>

    <option-edit :add-option="addOption" :editable="clicked" :language="language" :options="options"
                 :remove-option="removeOption"
                 :type="type"
    />
    <br>
    <button @click="create">
      {{ language?.uiElements.polls.create.createBtn }}
    </button>
    <label v-show="errorMsg != ''" class="errorInfo">{{ errorMsg }}</label>
  </div>
</template>

<script lang="ts" setup>
import type { languageData } from '@/scripts/languageConstruct'
import type { CreatePollRequest } from '@/types/requests'
import { createPoll } from '@/scripts/poll'
import { onMounted, ref } from 'vue'
import { type ComplexOption } from '@/types/poll'
import { ReturnCode } from '@/types/constants'
import { type IUser, type LocalUser, PollType, VoteValue } from '@/types/bases'
import OptionEdit from '@/components/poll/OptionEdit.vue'

const props = defineProps<{ userData: LocalUser | undefined; language: languageData }>()

const pollName = ref('')
const maxVoteCount = ref(-1)
const allowsMaybe = ref(true)
const type = ref(PollType.String)
const description = ref('')
const defaultVote = ref(VoteValue.unknown)
const useUTC = ref(false)

const options = ref<ComplexOption[]>([])
const currentID = ref(0)

const clicked = ref(false)

const errorMsg = ref('')

onMounted(() => {
})


const addOption = (option: ComplexOption) => {
  options.value.push(option)
}

const removeOption = (id: number) => {

  options.value = options.value.filter((ele) => ele.id != id)
}

const create = async () => {
  clicked.value = true
  if (pollName.value == '') return
  if (description.value == '') return
  if (options.value[0] == undefined) return

  // convert html/js date and datetime to unix timestamp in millis
  if (type.value == PollType.Date) {
    options.value.forEach((ele) => {
      if (ele.dateStart != undefined) {
        ele.dateStart = new Date(ele.dateStart).getTime()
      }
      if (ele.dateEnd != undefined) {
        ele.dateEnd = new Date(ele.dateEnd).getTime()
      }
    })
  } else if (type.value == PollType.DateTime) {
    options.value.forEach((ele) => {
      if (ele.dateTimeStart != undefined) {
        ele.dateTimeStart = new Date(ele.dateTimeStart).getTime()
      }
      if (ele.dateTimeEnd != undefined) {
        ele.dateTimeEnd = new Date(ele.dateTimeEnd).getTime()
      }
    })
  }


  const data: CreatePollRequest = {
    name: pollName.value,
    maxPerUserVoteCount: maxVoteCount.value,
    description: description.value,
    type: type.value,
    options: options.value,
    allowsMaybe: allowsMaybe.value,
    allowsEditing: true,
    defaultVote: defaultVote.value,
    useUTC: useUTC.value
  }
  const retDat = await createPoll(data)

  if (retDat == 200) {
    window.location.href = '/#/polls'
  } else if (retDat == ReturnCode.TOO_MANY_POLLS) {
    errorMsg.value = props.language?.uiElements.polls.create.maxCountExceeded ?? ''
  }
}
</script>

<style scoped>
input,
textarea {
  background-color: var(--secondary-color);
}

button {
  margin: 1ch;
}


</style>
