<template>
    <div>
        <h2>{{ language?.uiElements.login.form.login }}</h2>
        <label for="mail">{{ language?.uiElements.login.form.mail }}</label>
        <input
            id="mail" v-model="loginMail"
            type="text" placeholder="max.mustermann@gmail.com"
            autocomplete="mail"
        >
        <p>{{ language?.uiElements.login.form.or }}</p>
        <label for="username">{{ language?.uiElements.login.form.username }}</label>
        <input
            id="username" v-model="signupUsername"
            type="text" placeholder="maxmustermann001"
            autocomplete="username webauthn"
        >
        <button @click="webauthLogin">
            {{ language?.uiElements.login.form.loginBtn }}
        </button>
        <small>{{ language?.uiElements.login.form.quickLoginNote }}</small>
        <button class="delete" @click="$emit('return')">
            {{ language?.uiElements.login.form.leaveQuickLoginBtn }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { languageData } from "@/scripts/languageConstruct"
import { login } from "@/scripts/auth/webauthn"
import { mailIsAllowed } from "@/scripts/helper"
import { ref } from "vue"
import { MailRegexEntry } from "@/types/other"

defineProps<{
    language?: languageData
    mailRegex: MailRegexEntry[]
}>()

defineEmits(["return"])

const loginMail = ref("")
const signupUsername = ref("")
const mailRegexRules = ref<MailRegexEntry[]>([])

const webauthLogin = async () => {
    if (loginMail.value != "" && signupUsername.value != "") {
        signupUsername.value = ""
        return
    }
    let data: { username?: string; mail?: string } = { mail: undefined, username: undefined }
    if (loginMail.value != "" && mailIsAllowed(loginMail.value, mailRegexRules.value)) data = { mail: loginMail.value }
    else if (signupUsername.value != "") data = { username: signupUsername.value }

    const { success, error } = await login(data)
    console.log(success, error)

    if (!success) console.error(error)
    else window.location.reload()
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