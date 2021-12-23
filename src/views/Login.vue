<template>
    <div v-show="this.paramLoginKeyExist && !this.loggedIn">
        <h1 v-if="loggedIn">{{ this.language?.uiElements.login.form.loggingIn }}</h1>
        <div>Loginkey: {{ this.paramLoginKey }}</div>
    </div>
    <div v-show="!this.paramLoginKeyExist && !this.loggedIn && !this.loggingIn" class="columnContainer">
        <div class="column">
            <h2>{{ this.language?.uiElements.login.form.login }}</h2>
            <label for="mail">{{ this.language?.uiElements.login.form.mail }}</label>
            <input id="mail" type="text" placeholder="max.mustermann@gmail.com" ref="loginMail" />
            <br />
            <label for="key">{{ this.language?.uiElements.login.form.loginKey }}</label>
            <input id="key" type="text" placeholder="key" ref="loginKey" />
            <button @click="this.login">{{ this.language?.uiElements.login.form.loginBtn }}</button>
            <p v-if="this.loginMissing" class="errorInfo">
                {{ this.language?.uiElements.login.form.loginMailOrKeyMissing }}
            </p>
            <p v-if="this.loginMsg != ''">{{ this.loginMsg }}</p>
        </div>
        <div class="column">
            <h2>{{ this.language?.uiElements.login.form.signup }}</h2>
            <label for="mail">{{ this.language?.uiElements.login.form.mail }}</label>
            <small v-if="this.signMailMis" class="errorInfo">{{
                this.language?.uiElements.login.form.validMailNeeded
            }}</small>
            <input id="mail" type="text" placeholder="max.mustermann@gmail.com" ref="signupMail" /><br />

            <label for="first">{{ this.language?.uiElements.login.form.firstName }}</label>
            <small v-if="this.signFirstMis" class="errorInfo">{{
                this.language?.uiElements.login.form.firstNameNeeded
            }}</small>
            <input id="first" type="text" placeholder="Max" ref="signupFirstName" /><br />

            <label for="last">{{ this.language?.uiElements.login.form.lastName }}</label>
            <small v-if="this.signLastMis" class="errorInfo">{{
                this.language?.uiElements.login.form.lastNameNeeded
            }}</small>
            <input id="last" type="text" placeholder="Mustermann" ref="signupLastName" /><br />

            <label for="user">{{ this.language?.uiElements.login.form.username }}</label>
            <small v-if="this.signUsrMis" class="errorInfo">{{
                this.language?.uiElements.login.form.usernameNeeded
            }}</small>
            <input id="user" type="text" placeholder="mustermannekin001" ref="signupUsername" />
            <button @click="this.signup">{{ this.language?.uiElements.login.form.signupBtn }}</button>
        </div>
    </div>
    <div v-if="this.loggingIn">{{ this.language?.uiElements.login.form.loggingIn }}</div>
    <div v-if="this.errorMsg != ''" class="errorInfo">{{ this.errorMsg }}</div>
    <div v-show="this.loggedIn">
        <h1>{{ this.language?.uiElements.login.alreadyLoggedInAs(this.userData?.username) }}</h1>
        <button @click="logout">{{ this.language?.uiElements.login.logoutBtn }}</button>
    </div>
</template>

<script lang="ts">
    import axios from "axios"
    import { Options, Vue } from "vue-class-component"
    import { IUser } from "../scripts/interfaces"
    import { languageData } from "../scripts/languageConstruct"
    import { getUserData, signUp } from "../scripts/user"

    @Options({
        props: {
            userData: Object,
            language: Object
        }
    })
    export default class Login extends Vue {
        language?: languageData

        userData: IUser | undefined
        loggingIn: boolean = false
        loginMissing: boolean = false
        loginMsg = ""
        errorMsg = ""

        loginMailEle!: HTMLInputElement
        loginKeyEle!: HTMLInputElement

        signupFirstName!: HTMLInputElement
        signupLastName!: HTMLInputElement
        signupUsername!: HTMLInputElement
        signupMail!: HTMLInputElement

        signMailMis = false
        signLastMis = false
        signFirstMis = false
        signUsrMis = false

        async mounted() {
            this.loginMailEle = this.$refs.loginMail as HTMLInputElement
            this.loginKeyEle = this.$refs.loginKey as HTMLInputElement
            this.signupFirstName = this.$refs.signupFirstName as HTMLInputElement
            this.signupLastName = this.$refs.signupLastName as HTMLInputElement
            this.signupUsername = this.$refs.signupUsername as HTMLInputElement
            this.signupMail = this.$refs.signupMail as HTMLInputElement

            if (this.paramLoginKeyExist) {
                this.loggingIn = true
                try {
                    const user = await getUserData(this.paramLoginKey)
                    // @ts-ignore
                    window.location = "/"
                } catch (error) {
                    this.errorMsg = this.language?.uiElements.login.messages.loginKeyNotExist ?? ""
                    this.loggingIn = false
                }
            }
        }

        get loggedIn() {
            return this.userData != undefined
        }

        get paramLoginKey(): string {
            // @ts-ignore
            return this.$route.params.key
        }

        get paramLoginKeyExist() {
            return this.paramLoginKey != undefined && this.paramLoginKey != ""
        }

        async login() {
            if (this.loginMailEle.value == "" && this.loginKeyEle.value == "") {
                this.loginMissing = true
                return
            } else this.loginMissing = false

            this.loggingIn = true

            if (this.loginMailEle.value != "") {
                try {
                    const user = (await axios.post("/api/user/login", { mail: this.loginMailEle.value })).data as IUser
                    this.loginMsg = this.language?.uiElements.login.messages.mailSent ?? ""
                    this.loggingIn = false
                } catch (error) {
                    this.loginMsg = ""
                    this.errorMsg = this.language?.uiElements.login.messages.mailNotExist ?? ""
                    this.loggingIn = false
                }
            } else if (this.loginKeyEle.value != "") {
                this.loginMsg = ""
                try {
                    const user = await getUserData(this.loginKeyEle.value)
                    // @ts-ignore
                    window.location = "/"
                } catch (error) {
                    this.errorMsg = this.language?.uiElements.login.messages.loginKeyNotExist ?? ""
                    this.loggingIn = false
                }
            }
        }

        async signup() {
            this.signMailMis = this.signupMail.value == ""
            this.signUsrMis = this.signupUsername.value == ""
            this.signLastMis = this.signupLastName.value == ""
            this.signFirstMis = this.signupFirstName.value == ""

            if (this.signMailMis || this.signUsrMis || this.signLastMis || this.signFirstMis) return

            this.errorMsg = ""

            const rc = await signUp({
                firstName: this.signupFirstName.value,
                lastName: this.signupLastName.value,
                username: this.signupUsername.value,
                mail: this.signupMail.value
            })

            switch (rc.code) {
                case 406:
                    this.errorMsg = this.language?.uiElements.login.messages.userExists ?? ""
                    break
                case 500:
                    this.errorMsg = this.language?.uiElements.serverError ?? ""
                    break
            }

            console.log(rc)

            // @ts-ignore
            if (rc.code == 200) window.location = "/"
        }

        async logout() {
            try {
                await axios.post("/api/user/logout", { withCredentials: true })
            } catch (error) {
                console.error(error)
            }
            location.reload()
        }
    }
</script>

<style scoped>
    .columnContainer {
        display: flex;
        max-width: 80vw;
        flex-wrap: wrap;
        flex-direction: columns;
        background: var(--secondary-color);
        margin: auto;
        border-radius: 1rem;
    }

    .column {
        display: flex;
        flex-direction: column;
        min-width: 30ch;
        flex: 1;
        padding: 1rem;
    }

    button {
        margin: auto;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
</style>
