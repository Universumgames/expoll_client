<template>
  <div v-show="paramOTPExist">
    <h1 v-if="loggingIn">
      {{ language?.uiElements.login.form.loggingIn }}
    </h1>
    <div>OTP: {{ paramOTP }}</div>
  </div>
  <popup v-if="showPopup" :text="popupText" :title="popupTitle" @close="showPopup = false" />
  <form v-show="!paramOTPExist && !loggingIn && view != 2" class="columnContainer">
    <!-- logging in -->
    <div v-show="view == 0" class="column">
      <h2>{{ language?.uiElements.login.form.login }}</h2>
      <div>
        <label for="mail">{{ language?.uiElements.login.form.mail }}</label>
        <input
          id="mail" v-model="loginMail"
          :autocomplete="'mail' + supportsWebauthn? '' : ' webauthn'"
          :style="mailInvalid ? 'color:red' : 'color:green'"
          autofocus
          placeholder="max.mustermann@gmail.com"
          type="text" @keyup="mailUpdate()"
        >
        <div>
          <button @click="request">
            {{ language?.uiElements.login.form.loginBtn }}
          </button>
          <button style="margin: 1ch" @click="loginQuestionClick()">
            ?
          </button>
        </div>
      </div>
      <OIDC :language="language" />
      <div style="margin-top: 10ch; border-top: 1px white solid;">
        <button v-show="supportsWebauthn" style="font-size: smaller;display: block;" @click="view = 2">
          {{ language?.uiElements.login.form.quickLoginBtn }}
        </button>
        <small>{{ language?.uiElements.login.form.quickLoginNote }}</small>
        <br>
        <button
          style="background-color: #00000000; font-size: small"
          @click="showAdvancedLogin = !showAdvancedLogin"
        >
          {{ language?.uiElements.login.form.advancedLogin }}
        </button>
      </div>
      <div v-show="showAdvancedLogin">
        <label for="key">{{ language?.uiElements.login.form.otp }}</label>
        <input
          id="key" v-model="otp"
          autocomplete="one-time-code" placeholder="key"
          type="text"
        >
        <button @click="login">
          {{ language?.uiElements.login.form.loginBtn }}
        </button>
      </div>
      <p v-if="(otp == '' && loginClicked) || (loginMail == '' && requestClicked)" class="errorInfo">
        {{ language?.uiElements.login.form.loginMailOrOTPMissing }}
      </p>
      <p v-if="loginMsg != ''">
        {{ loginMsg }}
      </p>
    </div>
    <!-- register -->
    <div v-show="view == 1" class="column">
      <h2>{{ language?.uiElements.login.form.signup }}</h2>
      <label for="mail">{{ language?.uiElements.login.form.mail }}</label>
      <small v-if="mailInvalid" class="errorInfo">{{ language?.uiElements.login.form.validMailNeeded }}</small>
      <input
        id="mail" v-model="loginMail"
        :style="mailInvalid ? 'color:red' : 'color:green'" autocomplete="mail"
        placeholder="max.mustermann@gmail.com"
        type="text" @keyup="mailUpdate()"
      ><br>

      <label for="first">{{ language?.uiElements.login.form.firstName }}</label>
      <small v-if="signupFirstName == '' && clickedSignup" class="errorInfo">{{
          language?.uiElements.login.form.firstNameNeeded
        }}</small>
      <input
        id="first" v-model="signupFirstName"
        autocomplete="given-name" placeholder="Max"
        type="text"
      ><br>

      <label for="last">{{ language?.uiElements.login.form.lastName }}</label>
      <small v-if="signupLastName == '' && clickedSignup" class="errorInfo">{{
          language?.uiElements.login.form.lastNameNeeded
        }}</small>
      <input
        id="last" v-model="signupLastName"
        autocomplete="family-name" placeholder="Mustermann"
        type="text"
      ><br>

      <label for="user">{{ language?.uiElements.login.form.username }}</label>
      <small v-if="signupUsername == '' && clickedSignup" class="errorInfo">{{
          language?.uiElements.login.form.usernameNeeded
        }}</small>
      <input
        id="user" v-model="signupUsername"
        autocomplete="username" placeholder="mustermannekin001"
        type="text"
      >
      <button @click="signup">
        {{ language?.uiElements.login.form.signupBtn }}
      </button>
      <button class="delete" @click="view = 0">
        {{ language?.uiElements.login.form.tryOtherMail }}
      </button>
      <!-- notes -->
      <div style="margin: 1rem">
        <small>By creating a user account you agree that we store your personal information you provide us as
          well
          as storing required cookies when logging in on any of your devices. Information like above (Mail,
          Full Name, etc.), the polls you create and participate in as well as the votes you commit.
          Information regarding polls (like participation and votes) are stored as long as the polls exist.
          If
          you want to delete your user account, this will be possible in the future. When deleting your
          account only your personal information wil be deleted such as your mail, and your name, your
          username and votes will be stored going forward to serve this site's purpose.<br>
          This site is protected by reCAPTCHA and the Google
          <a href="https://policies.google.com/privacy">Privacy Policy</a> and
          <a href="https://policies.google.com/terms">Terms of Service</a> apply.</small>
      </div>
    </div>
  </form>
  <div v-if="loggingIn">
    <LoadingScreen />
    <div>{{ language?.uiElements.login.form.loggingIn }}</div>
  </div>
  <div v-show="view == 2" class="columnContainer">
    <Webauthn :language="language" :mail-regex="mailRegex" class="column" @return="view = 0" />
  </div>
  <div v-if="errorMsg != ''" class="errorInfo">
    {{ errorMsg }}
  </div>
</template>

<script lang="ts" setup>
import { languageData } from '@/scripts/languageConstruct'
import { getUserData, signUp } from '@/scripts/user'
import LoadingScreen from '../utils/LoadingScreen.vue'
import Popup from '../utils/TextPopup.vue'
import * as webauthnJson from '@github/webauthn-json'
import { otpLogin, requestLoginMail } from '@/scripts/auth/otp'
import { mailIsAllowed } from '@/scripts/helper'
import { getLoginRegex } from '@/scripts/regex'
import OIDC from './OIDC.vue'
import Webauthn from './Webauthn.vue'
import { computed, onMounted, ref } from 'vue'
import { ReCaptchaInstance } from '@/scripts/recaptcha'
import { useRoute } from 'vue-router'
import ExpollStorage from '@/scripts/storage'
import { IUser } from '@/types/bases'
import { ReturnCode } from '@/types/constants'
import { MailRegexEntry } from '@/types/other'
import { setCookie } from '@/scripts/cookie'
import { apiFetch } from '@/scripts/apiRequests'
import * as webauthn from '@/scripts/auth/webauthn'

/* eslint-disable no-unused-vars */
enum LoginType {
  LOGIN = 0,
  SIGNUP = 1,
  WEBAUTHN = 2
}

const captchaKey = '6LcreNsdAAAAAAGYzVEJFg1IcKLQsWDrh_LAYHsB'

const props = defineProps<{ language: languageData, userData?: IUser }>()
const route = useRoute()

const loggingIn = ref(false)
const view = ref<LoginType>(LoginType.LOGIN)
const loginMsg = ref('')
const errorMsg = ref('')

const showPopup = ref(false)
const popupTitle = ref('')
const popupText = ref('')

const loginMail = ref('')
const otp = ref('')

const signupFirstName = ref('')
const signupLastName = ref('')
const signupUsername = ref('')

const mailRegex = ref<MailRegexEntry[]>([])

const clickedSignup = ref(false)
const requestClicked = ref(false)
const loginClicked = ref(false)

const showAdvancedLogin = ref(false)

const mailInvalid = ref(false)

onMounted(async () => {
  if (props.userData != undefined) {
    window.location.href = '/#/account'
  }
  if (paramOTPExist.value) {
    loggingIn.value = true
    try {
      otp.value = paramOTP.value
      await login()
      // window.location = "/"

    } catch (error) {
      displayError(props.language?.uiElements.login.messages.otpNotExist)
      loggingIn.value = false
    }
  }

  if (paramMailExist.value) {
    loginMail.value = paramMail.value
    view.value = LoginType.SIGNUP
  }

  mailRegex.value = await getLoginRegex()
  //await webauthn.setupWebauthnAutofill()
})

const mailUpdate = () => {
  mailInvalid.value = !mailIsAllowed(loginMail.value, mailRegex.value)
}

const displayError = (error?: string) => {
  errorMsg.value = error ?? ''
  displayPopup(error, 'Error')
}

const displayPopup = (text?: string, title?: string) => {
  popupTitle.value = title ?? 'Info'
  popupText.value = text ?? ''
  showPopup.value = true
}

const resetError = () => {
  errorMsg.value = ''
  showPopup.value = false
}

const paramOTP = computed(() => {
  return route.query.key as string
})

const paramMail = computed(() => {
  return route.query.mail as string
})

const paramForApp = computed(() => {
  return (route.query.forApp as string == '1')
})

const paramOTPExist = computed(() => {
  return paramOTP.value != undefined && paramOTP.value != ''
})

const paramMailExist = computed(() => {
  return paramMail.value != undefined && paramMail.value != ''
})

const request = async () => {
  requestClicked.value = true
  if (loginMail.value == '') {
    displayError(props.language?.uiElements.login.form.validMailNeeded)
    return
  }
  loginClicked.value = false

  try {
    resetError()

    const rc = await requestLoginMail(loginMail.value)
    if (rc != ReturnCode.OK) throw new Error()

    displayPopup(props.language?.uiElements.login.messages.mailSent)
    loggingIn.value = false
    loginMsg.value = props.language?.uiElements.login.messages.mailSent ?? ''
  } catch (error) {
    loginMsg.value = ''
    loggingIn.value = false
    view.value = LoginType.SIGNUP
    displayPopup(props.language?.uiElements.login.form.emailNotExistSignupRequired)
  }
}

const login = async () => {
  loginClicked.value = true

  if (otp.value == '') return
  requestClicked.value = false

  loggingIn.value = true

  loginMsg.value = ''
  try {
    const { forApp } = await otpLogin(otp.value)
    const user = await getUserData()
    if (route.query.isNewUser == '1') {
      const newUsername = prompt(props.language.uiElements.login.form.defineUsernameAfterOIDC, user?.username)
      const jwt = ExpollStorage.jwt
      if (jwt == null) return
      await apiFetch({
        uri: '/user',
        useAuth: true,
        options: {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: newUsername
          })
        }
      })
    }
    if (paramForApp.value || forApp) {
      setCookie('expoll_session', JSON.stringify({ jwt: ExpollStorage.jwt ?? '' }))
      window.location.href = '/api/auth/simple/app'
      return
    }
    window.location.href = '/#/account'
    window.location.reload()
  } catch (error) {
    displayError(props.language?.uiElements.login.messages.otpNotExist)
    loggingIn.value = false
  }
}

const signup = async () => {
  clickedSignup.value = true

  if (
    loginMail.value == '' ||
    signupUsername.value == '' ||
    signupLastName.value == '' ||
    signupFirstName.value == ''
  ) {
    return
  }

  resetError()

  const rc = await signUp({
    firstName: signupFirstName.value,
    lastName: signupLastName.value,
    username: signupUsername.value,
    mail: loginMail.value.toLowerCase().replace(' ', ''),
    captcha: await getCaptchaToken(),
    forApp: false,
    useURL: true,
    redirect: false
  })

  switch (rc) {
    case ReturnCode.USER_EXISTS:
      displayError(props.language?.uiElements.login.messages.userExists)
      break
    case ReturnCode.INTERNAL_SERVER_ERROR:
      displayError(props.language?.uiElements.serverError)
      break
    case ReturnCode.CAPTCHA_INVALID:
      errorMsg.value = 'Captcha invalid'
      break
  }

  if (rc == 200) {
    window.location.reload()
  }
}

// eslint-disable-next-line no-unused-vars
interface Window {
  grecaptcha: ReCaptchaInstance
  captchaOnLoad: () => void
}


const getCaptchaToken = async (): Promise<string> => {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  return new Promise((resolve, reject) => {
    (window as unknown as Window).grecaptcha.ready(() => {
      (window as unknown as Window).grecaptcha.execute(captchaKey, { action: 'signup' }).then((token: string) => {
        resolve(token)
      })
    })
  })
}

const supportsWebauthn = computed(() => {
  return webauthnJson.supported()
})


const loginQuestionClick = () => {
  alert(props.language?.uiElements.login.form.otpQuestionAlert)
}

</script>

<style scoped>
.columnContainer {
  display: flex;
  max-width: 80vw;
  flex-wrap: wrap;
  flex-direction: column;
  background: var(--secondary-color);
  margin: auto;
  border-radius: var(--aggressive-border-radius);
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