<template>
    <div v-show="paramOTPExist">
        <h1 v-if="loggingIn">{{ language?.uiElements.login.form.loggingIn }}</h1>
        <div>OTP: {{ paramOTP }}</div>
    </div>
    <popup v-if="showPopup" :text="popupText" :title="popupTitle" @close="showPopup = false" />
    <div v-show="!paramOTPExist && !loggingIn && view != 2" class="columnContainer">
        <!-- logging in -->
        <div class="column" v-show="view == 0">
            <h2>{{ language?.uiElements.login.form.login }}</h2>
            <div>
                <label for="mail">{{ language?.uiElements.login.form.mail }}</label>
                <input id="mail" type="text" placeholder="max.mustermann@gmail.com" v-model="loginMail" autocomplete="mail"
                    @keyup="mailUpdate()" :style="mailInvalid ? 'color:red' : 'color:green'" />
                <div>
                    <button @click="request">{{ language?.uiElements.login.form.loginBtn }}</button>
                    <button style="margin: 1ch" @click="loginQuestionClick()">?</button>
                </div>
            </div>
            <OIDC :language="language" />
            <div style="margin-top: 10ch; border-top: 1px white solid;">
                <button @click="view = 2" v-show="supportsWebauthn" style="font-size: smaller;display: block;">
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
                <input id="key" type="text" placeholder="key" v-model="otp" autocomplete="one-time-code" />
                <button @click="login">{{ language?.uiElements.login.form.loginBtn }}</button>
            </div>
            <p v-if="(otp == '' && loginClicked) || (loginMail == '' && requestClicked)" class="errorInfo">
                {{ language?.uiElements.login.form.loginMailOrOTPMissing }}
            </p>
            <p v-if="loginMsg != ''">{{ loginMsg }}</p>
        </div>
        <!-- register -->
        <div class="column" v-show="view == 1">
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
            <button @click="view = 0" class="delete">{{ language?.uiElements.login.form.tryOtherMail }}</button>
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
    <div v-show="view == 2" class="columnContainer">
        <Webauthn :language="language" :mailRegex="mailRegex" @return="view = 0" class="column" />
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
import axios from "axios"
import OIDC from "./login/OIDC.vue"
import Webauthn from "./login/Webauthn.vue"

declare global {
    // eslint-disable-next-line no-unused-vars
    interface Window {
        grecaptcha: ReCaptchaInstance
        captchaOnLoad: () => void
    }
}

enum LoginType {
    LOGIN = 0,
    SIGNUP = 1,
    WEBAUTHN = 2
}

const captchaKey = "6LcreNsdAAAAAAGYzVEJFg1IcKLQsWDrh_LAYHsB"

@Options({
    props: {
        language: Object
    },
    components: {
        LoadingScreen,
        Popup,
        OIDC,
        Webauthn
    }
})
export default class LoginSignupView extends Vue {
    language?: languageData

    loggingIn: boolean = false
    view: LoginType = LoginType.LOGIN
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

    mailInvalid = false

    async mounted() {
        if (this.paramOTPExist) {
            this.loggingIn = true
            try {
                this.otp = this.paramOTP
                await this.login()
                // @ts-ignore
                // window.location = "/"
            } catch (error) {
                this.displayError(this.language?.uiElements.login.messages.otpNotExist)
                this.loggingIn = false
            }
        }

        if (this.paramMailExist) {
            this.loginMail = this.paramMail!
            this.view = LoginType.SIGNUP
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

    get paramMail(): string | undefined {
        // @ts-ignore
        return this.$route.query.mail
    }

    get paramOTPExist() {
        return this.paramOTP != undefined && this.paramOTP != ""
    }

    get paramMailExist() {
        return this.paramMail != undefined && this.paramMail != ""
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
            this.loggingIn = false
            this.view = LoginType.SIGNUP
            this.displayPopup(this.language?.uiElements.login.form.emailNotExistSignupRequired)
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
            window.location.href = "/#/polls"
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