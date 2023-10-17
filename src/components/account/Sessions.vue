<template>
    <details id="sessionContainer">
        <summary>{{ language.uiElements.login.loggedIn.activeSessions }}</summary>
        <button class="delete" @click="logoutEverywhere">
            Logout everywhere
        </button>

        <div id="sessionList">
            <div
                v-for="session in personalizedData?.sessions ?? []" :key="session.expiration"
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
                <button :class="session.active? 'btn-disabled':''" class="delete" @click="deleteSession(session.nonce)">
                    {{ language.uiElements.login.loggedIn.deleteSession }}
                </button>
            </div>
        </div>
    </details>
</template>

<script lang="ts" setup>

import { languageData } from "@/scripts/languageConstruct"
import { limitLength } from "@/scripts/helper"
import * as auth from "@/scripts/authentication"
import * as user from "@/scripts/user"
import { onMounted, ref } from "vue"
import { IUser } from "@/types/bases"

const props = defineProps<{ userData: IUser, language: languageData }>()

const personalizedData = ref<any>({})

onMounted(async () => {
    await getPersonalizedData()
})

const getPersonalizedData = async () => {
    personalizedData.value = await user.getPersonalizedData()
}

const deleteSession = async (session: string | undefined) => {
    if (session == undefined) return
    if (confirm(props.language?.uiElements.login.loggedIn.deleteSessionPrompt)) {
        await auth.deleteSession(session)
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

#sessionList p {
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