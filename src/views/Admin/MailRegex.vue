<template>
    <loading-screen v-if="loading" />
    <div v-if="!loading">
        <label>Regex count: {{ regex.length }}</label>
    </div>

    <!-- regex entries -->
    <div>
        <RegexTest v-for="reg of regex" :key="reg.regex" :reg="reg" @remove="removeRegex(reg.regex)" @update="update" />
    </div>

    <button @click="showNewRegex = !showNewRegex">New Regex Rule</button>

    <div v-show="showNewRegex">
        <label>New Regex:</label>
        <input type="text" v-model="newRegex" />
        <label>Blacklist/Whitelist</label>
        <input type="checkbox" v-model="newRegexBlacklist" />
        <button @click="addRegex">Add</button>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { IUser } from "expoll-lib/interfaces"
    import { languageData } from "../../scripts/languageConstruct"
    import UserRow from "./UserRow.vue"
    import axios from "axios"
    import LoadingScreen from "../../components/LoadingScreen.vue"
    import RegexTest from "./RegexTest.vue"
    import { MailRegexEntry } from "expoll-lib/extraInterfaces"

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
        newRegexBlacklist: boolean = false
        showNewRegex: boolean = false

        loading = true

        async mounted() {
            this.getData()
        }

        async getData() {
            const data = (await axios.get("/api/admin/mailregex", { withCredentials: true })).data as {
                regex: MailRegexEntry[]
            }

            this.regex = data.regex

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
            await axios.post(
                "/api/admin/mailregex",
                {
                    mailRegex: this.regex.filter((r) => r.regex != reg)
                },
                { withCredentials: true }
            )

            await this.getData()
        }

        async update() {
            await axios.post(
                "/api/admin/mailregex",
                {
                    mailRegex: this.regex
                },
                { withCredentials: true }
            )
            await this.getData()
        }

        regexMatchChange(e: any) {
            return true
        }
    }
</script>
