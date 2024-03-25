<template>
    <details id="authenticatorsContainer">
        <summary>{{ language?.uiElements.login.loggedIn.auths }}</summary>
        <button v-show="supportsWebauthn" @click="addAuth()">
            {{ language?.uiElements.login.loggedIn.addAuth }}
        </button>

        <div v-show="authenticators.length > 0">
            <authenticator-detail
                v-for="authenticator in authenticators" :key="authenticator.credentialID"
                :authenticator="authenticator"
                :language="language" :user-data="userData"
                @update="updateAuthenticators"
            />
        </div>
        <div v-show="authenticators.length == 0" id="emptyAuthContainer">
            {{ language?.uiElements.login.loggedIn.authEmpty }}
        </div>

        <div>{{ language?.uiElements.login.loggedIn.authDisclaimer }}</div>
    </details>
</template>

<script lang="ts" setup>
import { languageData } from "@/scripts/languageConstruct"
import AuthenticatorDetail from "@/components/account/AuthenticatorDetail.vue"
import * as webauthnJson from "@github/webauthn-json"
import * as auth from "@/scripts/authentication"
import { onMounted, ref } from "vue"
import { IUser } from "@/types/bases"


const props = defineProps<{ userData: IUser, language: languageData }>()

const authenticators = ref<unknown[]>([])

onMounted(async () => {
    await updateAuthenticators()
})

const supportsWebauthn = async () => {
    return webauthnJson.supported()
}

const updateAuthenticators = async () => {
    authenticators.value = await getAuthenticators()
}

const addAuth = async () => {
    if (authenticators.value.length == 0 && props.language) {
        alert(props.language.uiElements.login.loggedIn.authDisclaimer)
    }
    const { success, error } = await auth.register()
    if (!success) console.error(error)
    await updateAuthenticators()
}

const getAuthenticators = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (await auth.getWebauthnList()).sort((a: any, b: any) => {
        return a.created < b.created ? 1 : -1
    })
}
</script>

<style>
#authenticatorsContainer{
  text-align: left;
  background-color: var(--secondary-color);
  padding: var(--default-padding);
  border-radius: var(--default-border-radius);
}
#emptyAuthContainer {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  background: var(--secondary-color);
  border-radius: var(--aggressive-border-radius);
  margin: 1rem;
  padding: 1ch;
  text-align: left;
}
</style>