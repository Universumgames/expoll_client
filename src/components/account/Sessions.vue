<template>
    <details id="sessionContainer">
        <summary>{{ language.uiElements.login.loggedIn.activeSessions }}</summary>
        <button class="delete" @click="logoutEverywhere">
            Logout everywhere
        </button>

        <div id="sessionList">
            <div
                v-for="session in personalizedJSON?.sessions ?? []" :key="session.expiration"
                :style="session.active ? 'color:var(--primary-color);' : ''"
                class="session"
            >
                <div>
                    <p v-if="session.active" style="margin: 0">
                        Current Session
                    </p>
                    <p>{{ limitLength(session.userAgent ?? "unknown", 40) }}</p>
                    <small>Expires: {{ language.uiElements.dateTimeToString(new Date(session.expiration)) }}</small>
                </div>
                <button class="delete" :class="session.active? 'btn-disabled':''" @click="deleteSession(session.nonce)">
                    {{ language.uiElements.login.loggedIn.deleteSession }}
                </button>
            </div>
        </div>
    </details>
</template>

<script lang="ts" setup>

import { IUser } from "@/lib/interfaces"
import { languageData } from "@/scripts/languageConstruct"
import { limitLength } from "@/scripts/helper"
import * as auth from "@/scripts/authentication"
import * as user from "@/scripts/user"
import { onMounted, ref } from "vue"

const props = defineProps<{ userData: IUser, language: languageData }>()

const personalizedData = ref("")
const personalizedJSON = ref<any>({})

onMounted(async () => {
    await getPersonalizedData()
})

const getPersonalizedData = async () => {
    personalizedJSON.value = await user.getPersonalizedData()
    if (personalizedJSON.value != undefined) {
        personalizedData.value = JSON.stringify(personalizedJSON.value, null, 2)
    }
}

const deleteSession = async (session: any) => {
    if (confirm(props.language?.uiElements.login.loggedIn.deleteSessionPrompt)) {
        await deleteSession(session)
        await getPersonalizedData()
    }
}

const logoutEverywhere = async () => {
    if (confirm(props.language?.uiElements.login.loggedIn.logoutAllPrompt)) {
        await auth.logoutAllSessions()
        location.reload()
    }
}

</script>

<style>
#sessionContainer {
  text-align: left;
  background-color: var(--secondary-color);
  padding: var(--default-padding);
  border-radius: var(--default-border-radius);
}

#sessionList {
  display: flex;
  flex-direction: column;
}

#sessionList p{
  margin: 0;
  white-space: unset;
}

.session {
  background: var(--secondary-color);
  border-radius: var(--default-border-radius);
  padding: 0.2rem;
  margin: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>