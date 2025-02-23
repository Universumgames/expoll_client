<template>
    <div id="oidcLoginsContainer">
        <b>{{ language?.uiElements.login.loggedIn.oidcLogins }}</b>

        <div v-for="connection in oidcConnections" :key="connection.subject" class="savedOidcLogin">
            <p>{{
                    capitalizeFirstLetter(connection.key)
                }}:
            </p>
            <p>{{ connection.mail }}</p>
        </div>

        <h3 v-show="missingProviders.length != 0">
            {{
                language?.uiElements.login.loggedIn.oidcConnectionNote
            }}
        </h3>

        <div class="addOidcConnections">
            <b v-show="missingProviders.length == 0">{{ language?.uiElements.login.loggedIn.additionalOIDC}}</b>
            <a
                v-for="provider in providers" :key="provider.key"
                :href="'/api/auth/oidc/addConnection/' + provider.key"
                tabindex="0"
                role="link"
                class="providerLink"
                :style="'background-color:' + provider.iconBackgroundColorHex + '; color:' + provider.textColorHex"
            >
                <img
                    :src="imageURI(provider)"
                    style="height: 2rem"
                    :alt="'sign in with ' + provider.key + ' image'"
                >
                <p>{{ provider.title }}</p>
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { languageData } from "@/scripts/languageConstruct"
import { onMounted, ref } from "vue"
import * as auth from "@/scripts/auth/oidc"
import { capitalizeFirstLetter } from "@/scripts/helper"
import type { IUser, LocalUser } from '@/types/bases'
import type { OIDCInfo } from '@/scripts/auth/oidc'

defineProps<{ userData: LocalUser, language: languageData }>()
const oidcConnections = ref<auth.OIDCConnection[]>([])
const providers = ref<OIDCInfo[]>([])
const missingProviders = ref<string[]>([])

onMounted(async () => {
    oidcConnections.value = await auth.getOIDCConnections()
    providers.value = await auth.getAvailableOIDCProviders()
    const existingProviders = oidcConnections.value.map(t => t.key)

    missingProviders.value = providers.value
        .filter(prov => !existingProviders.includes(prov.key))
        .map(prov => prov.key)

    console.log(providers)
})

const imageURI = (provider: OIDCInfo) => {
    let uriNotProvided = provider.imageURI == undefined || provider.imageURI == "" || provider.imageURI == null
    return uriNotProvided ? ('/oidc/' + provider.iconFileName) : provider.imageURI
}
</script>

<style>
#oidcLoginsContainer{
  text-align: center;
  padding: var(--default-padding);
  background-color: var(--secondary-color);
  border-radius: var(--default-border-radius);
  display: flex;
  flex-direction: column;
}

.addOidcConnections {
  display: flex;
  margin: 0 auto;
  justify-content: center;
  flex-direction: column;
  width: min(60ch, 80vw);
}

.savedOidcLogin {
    display: flex;
    margin: 0 auto;
    justify-content: center;
    flex-direction: row;
}

.savedOidcLogin > * {
    display: inline-block;
    margin: 0;
}

.providerLink {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: 1ch;
    width: min(60ch, 80vw);
    border-radius: var(--default-border-radius);
    margin: 1ch;
}
</style>