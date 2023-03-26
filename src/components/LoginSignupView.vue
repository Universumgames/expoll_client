<template>
    <div v-show="paramOTPExist">
        <h1 v-if="loggingIn">{{ language?.uiElements.login.form.loggingIn }}</h1>
        <div>OTP: {{ paramOTP }}</div>
    </div>
    <popup v-if="showPopup" :text="popupText" :title="popupTitle" @close="showPopup = false" />
    <div v-show="!paramOTPExist && !loggingIn && !useQuickSignIn" class="columnContainer">
        <!-- logging in -->
        <div class="column">
            <h2>{{ language?.uiElements.login.form.login }}</h2>
            <div>
                <label for="mail">{{ language?.uiElements.login.form.mail }}</label>
                <input id="mail" type="text" placeholder="max.mustermann@gmail.com" v-model="loginMail" autocomplete="mail"
                    @keyup="mailUpdate()" :style="mailInvalid ? 'color:red' : 'color:green'" />
                <div>
                    <button @click="request">{{ language?.uiElements.login.form.requestBtn }}</button>
                    <button style="margin: 1ch" @click="loginQuestionClick()">?</button>
                </div>
            </div>
            <div style="margin-top: 10ch; border-top: 1px white solid;">
                <button @click="useQuickSignIn = true" v-show="supportsWebauthn" style="font-size: smaller;display: block;">
                    {{ language?.uiElements.login.form.quickLoginBtn }}
                </button>
                <small>{{ language?.uiElements.login.form.quickLoginNote }}</small>
                <br />
                <button @click="showAdvancedLogin = !showAdvancedLogin"
                    style="background-color: #00000000; font-size: small">
                    {{ language?.uiElements.login.form.advancedLogin }}
                </button>
            </div>
            <div v-show="showAdvancedLogin">
                <label for="key">{{ language?.uiElements.login.form.otp }}</label>
                <input id="key" type="text" placeholder="key" v-model="otp" />
                <button @click="login">{{ language?.uiElements.login.form.loginBtn }}</button>
            </div>
            <p v-if="(otp == '' && loginClicked) || (loginMail == '' && requestClicked)" class="errorInfo">
                {{ language?.uiElements.login.form.loginMailOrOTPMissing }}
            </p>
            <p v-if="loginMsg != ''">{{ loginMsg }}</p>
        </div>
        <!-- register -->
        <div class="column">
            <h2>{{ language?.uiElements.login.form.signup }}</h2>
            <label for="mail">{{ language?.uiElements.login.form.mail }}</label>
            <small v-if="mailInvalid" class="errorInfo">{{ language?.uiElements.login.form.validMailNeeded }}</small>
            <input id="mail" type="text" placeholder="max.mustermann@gmail.com" v-model="loginMail" autocomplete="mail"
                @keyup="mailUpdate()" :style="mailInvalid ? 'color:red' : 'color:green'" /><br />

            <label for="first">{{ language?.uiElements.login.form.firstName }}</label>
            <small v-if="signupFirstName == '' && clickedSignup" class="errorInfo">{{
                language?.uiElements.login.form.firstNameNeeded
            }}</small>
            <input id="first" type="text" placeholder="Max" v-model="signupFirstName" autocomplete="given-name" /><br />

            <label for="last">{{ language?.uiElements.login.form.lastName }}</label>
            <small v-if="signupLastName == '' && clickedSignup" class="errorInfo">{{
                language?.uiElements.login.form.lastNameNeeded
            }}</small>
            <input id="last" type="text" placeholder="Mustermann" v-model="signupLastName"
                autocomplete="family-name" /><br />

            <label for="user">{{ language?.uiElements.login.form.username }}</label>
            <small v-if="signupUsername == '' && clickedSignup" class="errorInfo">{{
                language?.uiElements.login.form.usernameNeeded
            }}</small>
            <input id="user" type="text" placeholder="mustermannekin001" v-model="signupUsername" autocomplete="username" />
            <button @click="signup">{{ language?.uiElements.login.form.signupBtn }}</button>
            <!-- notes -->
            <div style="margin: 1rem">
                <small>By creating a user account you agree that we store your personal information you provide us as well
                    as storing required cookies when logging in on any of your devices. Information like above (Mail,
                    Full Name, etc.), the polls you create and participate in as well as the votes you commit.
                    Information regarding polls (like participation and votes) are stored as long as the polls exist. If
                    you want to delete your user account, this will be possible in the future. When deleting your
                    account only your personal information wil be deleted such as your mail, and your name, your
                    username and votes will be stored going forward to serve this site's purpose.<br />
                    This site is protected by reCAPTCHA and the Google
                    <a href="https://policies.google.com/privacy">Privacy Policy</a> and
                    <a href="https://policies.google.com/terms">Terms of Service</a> apply.</small>
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
            <input id="mail" type="text" placeholder="max.mustermann@gmail.com" v-model="loginMail" autocomplete="mail" />
            <p>{{ language?.uiElements.login.form.or }}</p>
            <label for="username">{{ language?.uiElements.login.form.username }}</label>
            <input id="username" type="text" placeholder="maxmustermann001" v-model="signupUsername"
                autocomplete="username webauthn" />
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
    import { getUserData, signUp } from "../scripts/user"
    import LoadingScreen from "../components/LoadingScreen.vue"
    import { ReCaptchaInstance } from "../scripts/recaptcha"
    import Popup from "../components/Popup.vue"
    import * as webauthnJson from "@github/webauthn-json"
    import { login, otpLogin, requestLoginMail } from "../scripts/authentication"
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
        otp = ""

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
            if (this.paramOTPExist) {
                this.loggingIn = true
                try {
                    await getUserData()
                    // @ts-ignore
                    window.location = "/"
                } catch (error) {
                    this.displayError(this.language?.uiElements.login.messages.otpNotExist)
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
            this.displayPopup(error, "Error")
        }

        displayPopup(text?: string, title?: string) {
            this.popupTitle = title ?? "Info"
            this.popupText = text ?? ""
            this.showPopup = true
        }

        resetError() {
            this.errorMsg = ""
            this.showPopup = false
        }

        get paramOTP(): string {
            // @ts-ignore
            return this.$route.query.key
        }

        get paramOTPExist() {
            return this.paramOTP != undefined && this.paramOTP != ""
        }

        async request() {
            this.requestClicked = true
            if (this.loginMail == "") {
                this.displayError(this.language?.uiElements.login.form.validMailNeeded)
                return
            }
            this.loginClicked = false

            try {
                this.resetError()

                const rc = await requestLoginMail(this.loginMail)
                if (rc != ReturnCode.OK) throw new Error()

                this.displayPopup(this.language?.uiElements.login.messages.mailSent)
                this.loggingIn = false
                this.loginMsg = this.language?.uiElements.login.messages.mailSent ?? ""
            } catch (error) {
                this.loginMsg = ""
                this.displayError(this.language?.uiElements.login.messages.mailNotExist)
                this.loggingIn = false
            }
        }

        async login() {
            this.loginClicked = true
            if (this.otp == "") return
            this.requestClicked = false

            this.loggingIn = true

            this.loginMsg = ""
            try {
                console.log(this.otp)
                await otpLogin(this.otp)
                await getUserData()
                window.location.reload()
            } catch (error) {
                this.displayError(this.language?.uiElements.login.messages.otpNotExist)
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

            switch (rc) {
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

            // @ts-ignore
            if (rc == 200) {
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
            return webauthnJson.supported()
        }

        async webauthLogin() {
            if (this.loginMail != "" && this.signupUsername != "") {
                this.signupUsername = ""
                return
            }
            let data: { username?: string; mail?: string } = { mail: undefined, username: undefined }
            if (this.loginMail != "" && mailIsAllowed(this.loginMail, this.mailRegex)) data = { mail: this.loginMail }
            else if (this.signupUsername != "") data = { username: this.signupUsername }

            const { success, error } = await login(data)
            console.log(success, error)

            if (!success) console.error(error)
            else window.location.reload()
        }

        loginQuestionClick() {
            alert(this.language?.uiElements.login.form.otpQuestionAlert)
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