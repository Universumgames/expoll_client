<template>
    <div v-show="this.paramLoginKeyExist">
        <h1 v-if="this.loggedIn">{{ this.language?.uiElements.login.form.loggingIn }}</h1>
        <div>Loginkey: {{ this.paramLoginKey }}</div>
    </div>
    <popup v-if="showPopup" :text="popupText" :title="popupTitle" @close="showPopup = false" />
    <div v-show="!this.paramLoginKeyExist && !this.loggingIn" class="columnContainer">
        <!-- logging in -->
        <div class="column">
            <h2>{{ this.language?.uiElements.login.form.login }}</h2>
            <label for="mail">{{ this.language?.uiElements.login.form.mail }}</label>
            <input id="mail" type="text" placeholder="max.mustermann@gmail.com" v-model="loginMail" />
            <button @click="this.request">{{ this.language?.uiElements.login.form.requestBtn }}</button>
            <br />
            <button @click="showAdvancedLogin = !showAdvancedLogin">
                {{ this.language?.uiElements.login.form.advancedLogin }}
            </button>
            <div v-show="showAdvancedLogin">
                <label for="key">{{ this.language?.uiElements.login.form.loginKey }}</label>
                <input id="key" type="text" placeholder="key" v-model="loginKey" />
                <button @click="this.login">{{ this.language?.uiElements.login.form.loginBtn }}</button>
            </div>
            <p
                v-if="(this.loginKey == '' && this.loginClicked) || (this.loginMail == '' && this.requestClicked)"
                class="errorInfo"
            >
                {{ this.language?.uiElements.login.form.loginMailOrKeyMissing }}
            </p>
            <p v-if="this.loginMsg != ''">{{ this.loginMsg }}</p>
        </div>
        <!-- register -->
        <div class="column">
            <h2>{{ this.language?.uiElements.login.form.signup }}</h2>
            <label for="mail">{{ this.language?.uiElements.login.form.mail }}</label>
            <small v-if="this.signupMail == '' && clickedSignup" class="errorInfo">{{
                this.language?.uiElements.login.form.validMailNeeded
            }}</small>
            <input id="mail" type="text" placeholder="max.mustermann@gmail.com" v-model="signupMail" /><br />

            <label for="first">{{ this.language?.uiElements.login.form.firstName }}</label>
            <small v-if="this.signupFirstName == '' && clickedSignup" class="errorInfo">{{
                this.language?.uiElements.login.form.firstNameNeeded
            }}</small>
            <input id="first" type="text" placeholder="Max" v-model="signupFirstName" /><br />

            <label for="last">{{ this.language?.uiElements.login.form.lastName }}</label>
            <small v-if="this.signupLastName == '' && clickedSignup" class="errorInfo">{{
                this.language?.uiElements.login.form.lastNameNeeded
            }}</small>
            <input id="last" type="text" placeholder="Mustermann" v-model="signupLastName" /><br />

            <label for="user">{{ this.language?.uiElements.login.form.username }}</label>
            <small v-if="this.signupUsername == '' && clickedSignup" class="errorInfo">{{
                this.language?.uiElements.login.form.usernameNeeded
            }}</small>
            <input id="user" type="text" placeholder="mustermannekin001" v-model="signupUsername" />
            <button @click="this.signup">{{ this.language?.uiElements.login.form.signupBtn }}</button>
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
    <div v-if="this.loggingIn">
        <loading-screen />
        <div>{{ this.language?.uiElements.login.form.loggingIn }}</div>
    </div>
    <div v-if="this.errorMsg != ''" class="errorInfo">{{ this.errorMsg }}</div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { ReturnCode } from "expoll-lib/interfaces"
    import { languageData } from "../scripts/languageConstruct"
    import { getUserData, requestLoginMail, signUp } from "../scripts/user"
    import LoadingScreen from "../components/LoadingScreen.vue"
    import { ReCaptchaInstance } from "../scripts/recaptcha"
    import Popup from "../components/Popup.vue"

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

        signupMail = ""
        signupFirstName = ""
        signupLastName = ""
        signupUsername = ""

        clickedSignup = false
        requestClicked = false
        loginClicked = false

        showAdvancedLogin = false

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
                this.signupMail == "" ||
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
                mail: this.signupMail.toLowerCase().replace(" ", ""),
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
