<template>
    <details id="sessionContainer">
        <summary>{{ language.uiElements.login.loggedIn.activeSessions }}</summary>
        <button class="delete" @click="logoutEverywhere" @keyup.enter="logoutEverywhere" tabindex="0">
            Logout everywhere
        </button>

        <div id="sessionList">
            <div
                v-for="session in sessions ?? []" :key="session.expiration"
                :style="session.active ? 'color:var(--primary-color);' : ''"
                class="session"
            >
                <div>
                    <p v-if="session.active" style="margin: 0">
                        Current Session
                    </p>
                    <p v-if="session.platform != Platform.UNKNOWN">
                        {{ session.platform }} {{ session.version }}
                    </p>
                    <p v-if="session.platform == Platform.WEB || session.platform == Platform.UNKNOWN">
                        {{ limitLength(session.userAgent ?? "unknown", 40) }}
                    </p>
                    <small>Expires: {{ language.uiElements.dateTimeToString(new Date(session.expiration)) }}</small>
                </div>
                <button :class="session.active? 'btn-disabled':''" class="delete"
                        @click="deleteSession(session.nonce)"
                        @keyup.enter="deleteSession(session.nonce)" tabindex="0">
                    {{ language.uiElements.login.loggedIn.deleteSession }}
                </button>
            </div>
        </div>
    </details>
</template>

<script lang="ts" setup>

import type { languageData } from "@/scripts/languageConstruct"
import { limitLength } from "@/scripts/helper"
import * as auth from "@/scripts/authentication"
import * as user from "@/scripts/user"
import { onMounted, ref } from "vue"
import { type ISafeSession, type IUser, type LocalUser, Platform } from '@/types/bases'

const props = defineProps<{ userData: LocalUser, language: languageData }>()

const sessions = ref<ISafeSession[]>([])

onMounted(async () => {
    await getSessions()
})

const getSessions = async () => {
    sessions.value = await user.getSessions()
}

const deleteSession = async (session: string | undefined) => {
    if (session == undefined) return
    if (confirm(props.language?.uiElements.login.loggedIn.deleteSessionPrompt)) {
        await auth.deleteSession(session)
        await getSessions()
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