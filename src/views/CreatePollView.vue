<template>
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
        type="text" maxlength="65535"
        rows="7" cols="50"
    /><br>
    <label v-show="clicked && description == ''" class="errorInfo">{{
        language?.uiElements.polls.create.emptyField
    }}</label><br>

    <label for="typeSelect"> {{ language?.uiElements.polls.create.typeSelect.label }}* </label>

    <select id="typeSelect" v-model="type">
        <option value="0">
            {{ language?.uiElements.polls.create.typeSelect.stringOption }}
        </option>
        <option value="1">
            {{ language?.uiElements.polls.create.typeSelect.dateOption }}
        </option>
        <option value="2">
            {{ language?.uiElements.polls.create.typeSelect.dateTimeOption }}
        </option>
    </select>

    <br>

    <label for="pollMaxVote">{{ language?.uiElements.polls.create.maxVoteLabel }}</label>
    <input id="pollMaxVote" v-model="maxVoteCount" type="number" min="-1"><br>

    <label for="allowsMaybe">{{ language?.uiElements.polls.create.allowsMaybeLabel }}</label>
    <input id="allowsMaybe" v-model="allowsMaybe" type="checkbox"><br>

    <div style="margin-top: 5ch">
        <label>{{ language?.uiElements.polls.create.optionList }}</label>
        <br>
        <button @click="addOption">
            {{ language?.uiElements.polls.create.optionListAddOption }}
        </button>
        <br>

        <div>
            <div v-for="option in options" :key="option.id" class="optionElement">
                <label>{{ language?.uiElements.polls.create.optionName(option.id ?? 0) }}</label>
                <button @click="removeOption(option.id ?? 0)">
                    -
                </button>
                <!-- String poll options -->
                <div v-show="type == 0">
                    <label :for="option.id + 'value'">{{ language?.uiElements.polls.create.optionValue }}</label>
                    <input :id="option.id + 'value'" v-model="option.value" type="text">
                    <label v-show="clicked && option.value == ''" class="errorInfo">{{
                        language?.uiElements.polls.create.emptyField
                    }}</label>
                </div>
                <!-- Date options -->
                <div v-show="type == 1">
                    <label :for="option.id + 'dateStart'">{{ language?.uiElements.polls.create.optionValue }}</label>
                    <input :id="option.id + 'dateStart'" v-model="option.dateStart" type="date">
                    <label v-show="clicked && option.dateStart == undefined" class="errorInfo">{{
                        language?.uiElements.polls.create.emptyField
                    }}</label>
                    <label :for="option.id + 'dateEnd'">{{
                        language?.uiElements.polls.create.optionOptEndValue
                    }}</label>
                    <input :id="option.id + 'dateEnd'" v-model="option.dateEnd" type="date">
                </div>
                <!-- Date time options -->
                <div v-show="type == 2">
                    <label :for="option.id + 'dateTimeStart'">{{
                        language?.uiElements.polls.create.optionValue
                    }}</label>
                    <input :id="option.id + 'dateTimeStart'" v-model="option.dateTimeStart" type="datetime-local">
                    <label v-show="clicked && option.dateTimeStart == undefined" class="errorInfo">{{
                        language?.uiElements.polls.create.emptyField
                    }}</label>
                    <label :for="option.id + 'dateTimeEnd'">{{
                        language?.uiElements.polls.create.optionOptEndValue
                    }}</label>
                    <input :id="option.id + 'dateTimeEnd'" v-model="option.dateTimeEnd" type="datetime-local">
                </div>
            </div>
        </div>
    </div>
    <br>
    <button @click="create">
        {{ language?.uiElements.polls.create.createBtn }}
    </button>
    <label v-show="errorMsg != ''" class="errorInfo">{{ errorMsg }}</label>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { IUser, PollType, ReturnCode } from "expoll-lib/interfaces"
import { languageData } from "../scripts/languageConstruct"
import { ComplexOption, empty } from "expoll-lib/extraInterfaces"
import { CreatePollRequest } from "expoll-lib/requestInterfaces"
import { createPoll } from "@/scripts/poll"

@Options({
    components: {},
    props: {
        userData: Object,
        language: Object
    }
})
export default class CreatePollView extends Vue {
    language?: languageData
    userData?: IUser

    pollName = ""
    maxVoteCount = -1
    allowsMaybe = true
    type: PollType = PollType.String
    description = ""

    options: ComplexOption[] = []
    currentID = 0

    clicked = false

    errorMsg = ""

    async mounted() {
        this.addOption()
    }

    addOption() {
        const ele = Object.assign({}, empty)
        ele.id = this.currentID
        this.currentID++
        this.options.push(ele)
    }

    removeOption(id: number) {
        this.options = this.options.filter((ele) => ele.id != id)
    }

    async create() {
        this.clicked = true
        if (this.pollName == "") return
        if (this.description == "") return
        if (this.options[0] == undefined) return

        // convert html/js date and datetime to unix timestamp in millis
        if (this.type == PollType.Date) {
            this.options.forEach((ele) => {
                if (ele.dateStart != undefined) {
                    ele.dateStart = new Date(ele.dateStart).getTime()
                }
                if (ele.dateEnd != undefined) {
                    ele.dateEnd = new Date(ele.dateEnd).getTime()
                }
            })
        } else if (this.type == PollType.DateTime) {
            this.options.forEach((ele) => {
                if (ele.dateTimeStart != undefined) {
                    ele.dateTimeStart = new Date(ele.dateTimeStart).getTime()
                }
                if (ele.dateTimeEnd != undefined) {
                    ele.dateTimeEnd = new Date(ele.dateTimeEnd).getTime()
                }
            })
        }


        const data: CreatePollRequest = {
            name: this.pollName,
            maxPerUserVoteCount: this.maxVoteCount,
            description: this.description,
            type: this.type,
            options: this.options,
            allowsMaybe: this.allowsMaybe,
            allowsEditing: true
        }
        const retDat = await createPoll(data)

        if (retDat == 200) {
            // @ts-ignore
            window.location = "/#/polls"
        } else if (retDat == ReturnCode.TOO_MANY_POLLS) {
            this.errorMsg = this.language?.uiElements.polls.create.maxCountExceeded ?? ""
        }
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
    border-radius: 1ch;
    padding: 1ch;
    margin: 1ch;
}
</style>
