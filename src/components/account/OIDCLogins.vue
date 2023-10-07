<template>
    <div id="oidcLoginsContainer">
        <p>{{ language?.uiElements.login.loggedIn.oidcLogins }}</p>

        <div>
            <p v-for="connection in oidcConnections" :key="connection.subject">
                {{
                    capitalizeFirstLetter(connection.name)
                }}: {{ connection.mail }}
            </p>
        </div>

        <h3 v-show="missingProviders.length != 0">
            {{
                language?.uiElements.login.loggedIn.oidcConnectionNote
            }}
        </h3>

        <div v-for="provider in missingProviders" :key="provider">
            <a
                style="min-width: 25ch; width: 40vw; max-width: 60ch;"
                :href="'/api/auth/oidc/addConnection/' + provider"
            >
                <img :src="'/oidc/' + provider + '_signin.png'" style="width: 100%;">
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IUser } from "@/lib/interfaces"
import { languageData } from "@/scripts/languageConstruct"
import { onMounted, ref } from "vue"
import * as auth from "@/scripts/authentication"
import { capitalizeFirstLetter } from "@/scripts/helper"

const props = defineProps<{ userData: IUser, language: languageData }>()
const oidcConnections = ref<auth.OIDCConnection[]>([])
const providers = ref<{ key: string, imageURI: string, imageSmallURI: string, altName: string }[]>([])
const missingProviders = ref<string[]>([])


onMounted(async () => {
    oidcConnections.value = await auth.getOIDCConnections()
    providers.value = await auth.getAvailableOIDCProviders()
    const existingProviders = oidcConnections.value.map(t => t.name)

    missingProviders.value = providers.value
        .filter(prov => !existingProviders.includes(prov.key))
        .map(prov => prov.key)
})
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

</style>