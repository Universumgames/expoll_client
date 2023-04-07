<template>
    <div>
        <h2>{{ language?.uiElements.login.form.login }}</h2>
        <label for="mail">{{ language?.uiElements.login.form.mail }}</label>
        <input id="mail" type="text" placeholder="max.mustermann@gmail.com" v-model="loginMail" autocomplete="mail" />
        <p>{{ language?.uiElements.login.form.or }}</p>
        <label for="username">{{ language?.uiElements.login.form.username }}</label>
        <input id="username" type="text" placeholder="maxmustermann001" v-model="signupUsername"
            autocomplete="username webauthn" />
        <button @click="webauthLogin">{{ language?.uiElements.login.form.loginBtn }}</button>
        <small>{{ language?.uiElements.login.form.quickLoginNote }}</small>
        <button @click="$emit('return')" class="delete">
            {{ language?.uiElements.login.form.leaveQuickLoginBtn }}
        </button>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { languageData } from "../../scripts/languageConstruct"
import { login } from "../../scripts/authentication"
import { mailIsAllowed } from "@/scripts/helper"
import { MailRegexEntry } from "expoll-lib/extraInterfaces"

@Options({
    props: {
        language: Object,
        mailRegex: Array
    },
    components: {
    }
})
export default class Webauthn extends Vue {
    language?: languageData
    loginMail = ""
    signupUsername = ""
    mailRegex: MailRegexEntry[] = []

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
}
</script>

<style scoped>
button {
    margin: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

input {
    background: var(--bg-color);
}

input[type="text"] {
    margin: auto;
    width: min(70vw, 40ch);
}
</style>