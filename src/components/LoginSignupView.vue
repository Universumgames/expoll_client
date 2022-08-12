<template>
    <div v-show="paramLoginKeyExist">
        <h1 v-if="loggingIn">{{ language?.uiElements.login.form.loggingIn }}</h1>
        <div>Loginkey: {{ paramLoginKey }}</div>
    </div>
    <popup v-if="showPopup" :text="popupText" :title="popupTitle" @close="showPopup = false" />
    <div v-show="!paramLoginKeyExist && !loggingIn && !useQuickSignIn" class="columnContainer">
        <!-- logging in -->
        <div class="column">
            <h2>{{ language?.uiElements.login.form.login }}</h2>
            <label for="mail">{{ language?.uiElements.login.form.mail }}</label>
            <input
                id="mail"
                type="text"
                placeholder="max.mustermann@gmail.com"
                v-model="loginMail"
                autocomplete="mail"
                @keyup="mailUpdate()"
                :style="mailInvalid ? 'color:red' : 'color:green'"
            />
            <button @click="request">{{ language?.uiElements.login.form.requestBtn }}</button>
            <button @click="useQuickSignIn = true" v-show="supportsWebauthn" style="font-size: smaller">
                {{ language?.uiElements.login.form.quickLoginBtn }}
            </button>
            <small>{{ language?.uiElements.login.form.quickLoginNote }}</small>
            <br />
            <button
                @click="showAdvancedLogin = !showAdvancedLogin"
                style="background-color: #00000000; font-size: small"
            >
                {{ language?.uiElements.login.form.advancedLogin }}
            </button>
            <div v-show="showAdvancedLogin">
                <label for="key">{{ language?.uiElements.login.form.loginKey }}</label>
                <input id="key" type="text" placeholder="key" v-model="loginKey" />
                <button @click="login">{{ language?.uiElements.login.form.loginBtn }}</button>
            </div>
            <p v-if="(loginKey == '' && loginClicked) || (loginMail == '' && requestClicked)" class="errorInfo">
                {{ language?.uiElements.login.form.loginMailOrKeyMissing }}
            </p>
            <p v-if="loginMsg != ''">{{ loginMsg }}</p>
        </div>
        <!-- register -->
        <div class="column">
            <h2>{{ language?.uiElements.login.form.signup }}</h2>
            <label for="mail">{{ language?.uiElements.login.form.mail }}</label>
            <small v-if="mailInvalid" class="errorInfo">{{ language?.uiElements.login.form.validMailNeeded }}</small>
            <input
                id="mail"
                type="text"
                placeholder="max.mustermann@gmail.com"
                v-model="loginMail"
                autocomplete="mail"
                @keyup="mailUpdate()"
                :style="mailInvalid ? 'color:red' : 'color:green'"
            /><br />

            <label for="first">{{ language?.uiElements.login.form.firstName }}</label>
            <small v-if="signupFirstName == '' && clickedSignup" class="errorInfo">{{
                language?.uiElements.login.form.firstNameNeeded
            }}</small>
            <input id="first" type="text" placeholder="Max" v-model="signupFirstName" autocomplete="given-name" /><br />

            <label for="last">{{ language?.uiElements.login.form.lastName }}</label>
            <small v-if="signupLastName == '' && clickedSignup" class="errorInfo">{{
                language?.uiElements.login.form.lastNameNeeded
            }}</small>
            <input
                id="last"
                type="text"
                placeholder="Mustermann"
                v-model="signupLastName"
                autocomplete="family-name"
            /><br />

            <label for="user">{{ language?.uiElements.login.form.username }}</label>
            <small v-if="signupUsername == '' && clickedSignup" class="errorInfo">{{
                language?.uiElements.login.form.usernameNeeded
            }}</small>
            <input
                id="user"
                type="text"
                placeholder="mustermannekin001"
                v-model="signupUsername"
                autocomplete="username"
            />
            <button @click="signup">{{ language?.uiElements.login.form.signupBtn }}</button>
            <!-- notes -->
            <div style="margin: 1rem">
                <small
                    >By creating a user account you agree that we store your personal information you provide us as well
                    as storing required cookies when logging in on any of your devices. Information like above (Mail,
                    Full Name, etc.), the polls you create and participate in as well as the votes you commit.
                    Information regarding polls (like participation and votes) are stored as long as the polls exist. If
                    you want to delete your user account, this will be possible in the future. When deleting your
                    account only your personal information wil be deleted such as your mail, and your name, your
                    username and votes will be stored going forward to serve this site's purpose.<br />
                    This site is protected by reCAPTCHA and the Google
                    <a href="https://policies.google.com/privacy">Privacy Policy</a> and
                    <a href="https://policies.google.com/terms">Terms of Service</a> apply.</small
                >
            </div>
        </div>
    </div>
    <div v-if="loggingIn">
        <loading-screen />
        <div>{{ language?.uiElements.login.form.loggingIn }}</div>
    </div>
    <div v-show="useQuickSignIn" class="columnContainer">
        <div class="column">
            <h2>{{ language?.uiElements.login.form.login }}</h2>
            <label for="mail">{{ language?.uiElements.login.form.mail }}</label>
            <input
                id="mail"
                type="text"
                placeholder="max.mustermann@gmail.com"
                v-model="loginMail"
                autocomplete="mail"
            />
            <p>{{ language?.uiElements.login.form.or }}</p>
            <label for="username">{{ language?.uiElements.login.form.username }}</label>
            <input
                id="username"
                type="text"
                placeholder="maxmustermann001"
                v-model="signupUsername"
                autocomplete="username webauthn"
            />
            <button @click="webauthLogin">{{ language?.uiElements.login.form.loginBtn }}</button>
            <small>{{ language?.uiElements.login.form.quickLoginNote }}</small>
            <button @click="useQuickSignIn = false" class="delete">
                {{ language?.uiElements.login.form.leaveQuickLoginBtn }}
            </button>
        </div>
    </div>
    <div v-if="errorMsg != ''" class="errorInfo">{{ errorMsg }}</div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { ReturnCode } from "expoll-lib/interfaces"
    import { languageData } from "../scripts/languageConstruct"
    import { getUserData, requestLoginMail, signUp } from "../scripts/user"
    import LoadingScreen from "../components/LoadingScreen.vue"
    import { ReCaptchaInstance } from "../scripts/recaptcha"
    import Popup from "../components/Popup.vue"
    import { browserSupportsWebauthn } from "@simplewebauthn/browser"
    import { login } from "../scripts/webauthn"
    import { mailIsAllowed } from "@/scripts/helper"
    import { MailRegexEntry } from "expoll-lib/extraInterfaces"
    import { getLoginRegex } from "../scripts/regex"

    declare global {
        // eslint-disable-next-line no-unused-vars
        interface Window {
            grecaptcha: ReCaptchaInstance
            captchaOnLoad: () => void
        }
    }

    const captchaKey = "6LcreNsdAAAAAAGYzVEJFg1IcKLQsWDrh_LAYHsB"

    @Options({
        props: {
            language: Object
        },
        components: {
            LoadingScreen,
            Popup
        }
    })
    export default class LoginSignupView extends Vue {
        language?: languageData

        loggingIn: boolean = false
        loginMissing: boolean = false
        loginMsg = ""
        errorMsg = ""

        showPopup = false
        popupTitle = ""
        popupText = ""

        loginMail = ""
        loginKey = ""

        signupFirstName = ""
        signupLastName = ""
        signupUsername = ""

        mailRegex: MailRegexEntry[] = []

        clickedSignup = false
        requestClicked = false
        loginClicked = false

        showAdvancedLogin = false

        useQuickSignIn = false

        mailInvalid = false

        async mounted() {
            if (this.paramLoginKeyExist) {
                this.loggingIn = true
                try {
                    await getUserData(this.paramLoginKey)
                    // @ts-ignore
                    window.location = "/"
                } catch (error) {
                    this.displayError(this.language?.uiElements.login.messages.loginKeyNotExist)
                    this.loggingIn = false
                }
            }

            this.mailRegex = await getLoginRegex()
        }

        mailUpdate() {
            if (!mailIsAllowed(this.loginMail, this.mailRegex)) {
                this.mailInvalid = true
            } else this.mailInvalid = false
        }

        displayError(error?: string) {
            this.errorMsg = error ?? ""
            this.popupTitle = "Error"
            this.popupText = this.errorMsg
            this.showPopup = true
        }

        resetError() {
            this.errorMsg = ""
            this.showPopup = false
        }

        get paramLoginKey(): string {
            // @ts-ignore
            return this.$route.query.key
        }

        get paramLoginKeyExist() {
            return this.paramLoginKey != undefined && this.paramLoginKey != ""
        }

        async request() {
            this.requestClicked = true
            if (this.loginMail == "") return
            this.loginClicked = false

            try {
                const rc = await requestLoginMail(this.loginMail)
                if (rc != ReturnCode.OK) throw new Error()
                this.loginMsg = this.language?.uiElements.login.messages.mailSent ?? ""
                this.loggingIn = false
                this.resetError()
            } catch (error) {
                this.loginMsg = ""
                this.displayError(this.language?.uiElements.login.messages.mailNotExist)
                this.loggingIn = false
            }
        }

        async login() {
            this.loginClicked = true
            if (this.loginKey == "") return
            this.requestClicked = false

            this.loggingIn = true

            this.loginMsg = ""
            try {
                console.log(this.loginKey)
                await getUserData(this.loginKey)
                window.location.reload()
            } catch (error) {
                this.displayError(this.language?.uiElements.login.messages.loginKeyNotExist)
                this.loggingIn = false
            }
        }

        async signup() {
            this.clickedSignup = true

            if (
                this.loginMail == "" ||
                this.signupUsername == "" ||
                this.signupLastName == "" ||
                this.signupFirstName == ""
            ) {
                return
            }

            this.resetError()

            const rc = await signUp({
                firstName: this.signupFirstName,
                lastName: this.signupLastName,
                username: this.signupUsername,
                mail: this.loginMail.toLowerCase().replace(" ", ""),
                captcha: await this.getCaptchaToken()
            })

            switch (rc.code) {
                case ReturnCode.USER_EXISTS:
                    this.displayError(this.language?.uiElements.login.messages.userExists)
                    break
                case ReturnCode.INTERNAL_SERVER_ERROR:
                    this.displayError(this.language?.uiElements.serverError)
                    break
                case ReturnCode.CAPTCHA_INVALID:
                    this.errorMsg = "Captcha invalid"
                    break
            }

            console.log(rc)

            // @ts-ignore
            if (rc.code == 200) {
                window.location.reload()
            }
        }

        async getCaptchaToken(): Promise<string> {
            return new Promise((resolve, reject) => {
                window.grecaptcha.ready(() => {
                    window.grecaptcha.execute(captchaKey, { action: "signup" }).then((token: string) => {
                        resolve(token)
                    })
                })
            })
        }

        get supportsWebauthn(): boolean {
            return browserSupportsWebauthn()
        }

        async webauthLogin() {
            if (this.loginMail != "" && this.signupUsername != "") {
                this.signupUsername = ""
                return
            }
            let data: { username?: string; mail?: string } = { mail: undefined, username: undefined }
            if (this.loginMail != "") data = { mail: this.loginMail }
            else if (this.signupUsername != "") data = { username: this.signupUsername }

            const { success, error } = await login(data)
            if (!success) console.error(error)
            else window.location.reload()
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

    input {
        background: var(--bg-color);
    }
</style>
