<template>
    <loading-screen v-if="loading" />
    <div v-if="!loading">
        <label>Regex count: {{ regex.length }}</label>
    </div>

    <!-- regex entries -->
    <div>
        <RegexTest
            v-for="reg of regex" :key="reg.regex"
            :reg="reg" @remove="removeRegex(reg.regex)"
            @update="update"
        />
    </div>

    <button @click="showNewRegex = !showNewRegex">
        New Regex Rule
    </button>

    <div v-show="showNewRegex">
        <label>New Regex:</label>
        <input v-model="newRegex" type="text">
        <label>Blacklist/Whitelist</label>
        <input v-model="newRegexBlacklist" type="checkbox">
        <button @click="addRegex">
            Add
        </button>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { IUser } from "expoll-lib/interfaces"
import { languageData } from "../../scripts/languageConstruct"
import UserRow from "./UserRow.vue"
import LoadingScreen from "../../components/LoadingScreen.vue"
import RegexTest from "./RegexTest.vue"
import { MailRegexEntry } from "expoll-lib/extraInterfaces"
import { getRegexAdmin, updateRegeAdmin } from "@/scripts/regex"

@Options({
    props: {
        userData: Object,
        language: Object
    },
    components: {
        UserRow,
        LoadingScreen,
        RegexTest
    }
})
export default class MailRegex extends Vue {
    userData: IUser | undefined
    language?: languageData

    regex: Array<MailRegexEntry> = []

    newRegex?: string
    newRegexBlacklist = false
    showNewRegex = false

    loading = true

    async mounted() {
        this.getData()
    }

    async getData() {
        this.regex = await getRegexAdmin()

        this.$forceUpdate()
        this.loading = false
    }

    async addRegex() {
        if (this.newRegex == undefined || this.newRegex == "") {
            this.newRegex = undefined
            return
        }
        this.regex.push({
            regex: this.newRegex,
            blacklist: this.newRegexBlacklist
        })

        this.update()

        this.newRegex = undefined
    }

    async removeRegex(reg: string) {
        await updateRegeAdmin(this.regex.filter((r) => r.regex != reg))

        await this.getData()
    }

    async update() {
        await updateRegeAdmin(this.regex)
        await this.getData()
    }

    regexMatchChange(e: any) {
        return true
    }
}
</script>
