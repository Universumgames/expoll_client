<template>
    <h2>{{ this.language?.uiElements.polls.create.createPoll(pollName) }}</h2>

    <label for="pollNameInput">{{ this.language?.uiElements.polls.create.pollNameInputLabel }}</label>
    <input type="text" v-model="pollName" id="pollNameInput" /><br />

    <label for="pollDescriptionInput">{{ this.language?.uiElements.polls.create.description }}</label>
    <textarea type="text" v-model="description" id="pollDescriptionInput" maxlength="255" rows="7" cols="50" /><br />

    <label for="typeSelect">{{ this.language?.uiElements.polls.create.typeSelect.label }}</label>
    <select v-model="type" id="typeSelect">
        <option value="0">{{ this.language?.uiElements.polls.create.typeSelect.stringOption }}</option>
        <option value="1">{{ this.language?.uiElements.polls.create.typeSelect.dateOption }}</option>
        <option value="2">
            {{ this.language?.uiElements.polls.create.typeSelect.dateTimeOption }}
        </option>
    </select>
    <br />

    <label for="pollMaxVote">{{ this.language?.uiElements.polls.create.maxVoteLabel }}</label>
    <input type="number" v-model="maxVoteCount" id="pollMaxVote" min="-1" /><br />

    <label>{{ this.language?.uiElements.polls.create.optionList }}</label>
    <br />
    <button @click="addOption">{{ this.language?.uiElements.polls.create.optionListAddOption }}</button><br />

    <div>
        <div v-for="option in options" :key="option.id" class="optionElement">
            <label>{{ this.language?.uiElements.polls.create.optionName(option.id) }}</label>
            <button @click="removeOption(option.id)">-</button>
            <!-- String poll options -->
            <div v-show="type == 0">
                <label :for="option.id + 'value'">{{ this.language?.uiElements.polls.create.optionValue }}</label>
                <input v-model="option.value" :id="option.id + 'value'" type="text" />
            </div>
            <!-- Date options -->
            <div v-show="type == 1">
                <label :for="option.id + 'dateStart'">{{ this.language?.uiElements.polls.create.optionValue }}</label>
                <input v-model="option.dateStart" :id="option.id + 'dateStart'" type="date" />
                <label :for="option.id + 'dateEnd'">{{
                    this.language?.uiElements.polls.create.optionOptEndValue
                }}</label>
                <input v-model="option.dateEnd" :id="option.id + 'dateEnd'" type="date" />
            </div>
            <!-- Date time options -->
            <div v-show="type == 2">
                <label :for="option.id + 'dateTimeStart'">{{
                    this.language?.uiElements.polls.create.optionValue
                }}</label>
                <input v-model="option.dateTimeStart" :id="option.id + 'dateTimeStart'" type="datetime-local" />
                <label :for="option.id + 'dateTimeEnd'">{{
                    this.language?.uiElements.polls.create.optionOptEndValue
                }}</label>
                <input v-model="option.dateTimeEnd" :id="option.id + 'dateTimeEnd'" type="datetime-local" />
            </div>
        </div>
    </div>
    <br />
    <button @click="create">{{ this.language?.uiElements.polls.create.createBtn }}</button>
</template>

<script lang="ts">
    import axios from "axios"
    import { Options, Vue } from "vue-class-component"
    import {
        IPoll,
        IPollOption,
        IPollOptionDate,
        IPollOptionDateTime,
        IPollOptionString,
        IUser,
        PollType,
        tDate,
        tDateTime
    } from "../scripts/interfaces"
    import { languageData } from "../scripts/languageConstruct"
    import { ComplexOption, empty } from "../scripts/extraInterfaces"

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

        pollName: string = ""
        maxVoteCount: number = -1
        type: PollType = PollType.String
        description: string = ""

        options: ComplexOption[] = []
        currentID = 0

        async mounted() {
            this.options.push(empty)
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
            const data = {
                name: this.pollName,
                maxPerUserVoteCount: this.maxVoteCount,
                description: this.description,
                type: this.type,
                options: this.options
            }
            const retData = await axios.post("/api/poll", data)
            console.log(data)
            console.log(retData)
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
