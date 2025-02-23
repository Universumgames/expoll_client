<template>
    <div id="basicAccountInfoContainer">
        <p>
            {{ language.uiElements.login.form.username }}: {{ userData.username }}
            <button
                @click="editUsername"
                @keyup.enter="editUsername"
                tabindex="0"
                aria-label="Edit username"
                :id="jumpToContentID"
            >
                <edit-icon class="normalIcon" height="1em" fill="var(--text-color)" />
            </button>
        </p>
        <p>{{ language.uiElements.login.form.mail }}: {{ userData.mail }}</p>
        <p>
            {{ language.uiElements.login.form.firstName }}: {{ userData.firstName }} <button
                @click="editFirstName"
                @keyup.enter="editFirstName"
                tabindex="0"
                aria-label="Edit first name"
            >
                <edit-icon class="normalIcon" height="1em" fill="var(--text-color)" />
            </button>
        </p>
        <p>
            {{ language.uiElements.login.form.lastName }}: {{ userData.lastName }} <button
                @click="editLastName"
                @keyup.enter="editLastName"
                tabindex="0"
                aria-label="Edit last name"
            >
                <edit-icon class="normalIcon" height="1em" fill="var(--text-color)" />
            </button>
        </p>
        <small>{{ language.uiElements.login.loggedIn.createdOn }}: {{
            new Date(userData.createdTimestamp).toLocaleString()
        }}</small>
        <small>{{ language.uiElements.login.loggedIn.pollCounts}} ({{pollCounts}})</small>
    </div>
</template>

<script setup lang="ts">
import type { languageData } from "@/scripts/languageConstruct"
import ExpollStorage from "@/scripts/storage"
import EditIcon from "@/assetComponents/EditIcon.vue"
import type { IPoll, IUser, LocalUser } from '@/types/bases'
import { apiFetch } from "@/scripts/apiRequests"
import { jumpToContentID } from '@/scripts/jumpElementIDs.ts'
import { computed, ref } from 'vue'
import { getPollOverviews } from '@/scripts/poll.ts'

const props = defineProps<{ userData: LocalUser, language: languageData}>()

let pollsJoined = ref(0)

getPollOverviews().then((polls) => {
    pollsJoined.value = polls?.polls.length ?? 0
})

const pollCounts = computed(() => {
    return `${pollsJoined.value}/${props.userData.pollsOwned}/${props.userData.maxPollsOwned == -1 ? "∞" : props.userData.maxPollsOwned}`
})

const editUsername = async () => {
    const username = prompt(props.language?.uiElements.login.loggedIn.editUsernamePrompt, props.userData?.username)
    if (username == null) return
    const jwt = ExpollStorage.jwt
    if (!jwt) return
    const response = await apiFetch({ 
        uri: "/user", 
        useAuth: true, 
        options: {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username
            })
        } 
    })
    if (response.ok) {
        window.location.reload()
    }
}

const editFirstName = async () => {
    const firstName = prompt(props.language?.uiElements.login.loggedIn.editFirstNamePrompt, props.userData?.firstName)
    if (firstName == null) return
    const jwt = ExpollStorage.jwt
    if (!jwt) return
    const response = await apiFetch({
        uri: "/user", 
        useAuth: true, 
        options: {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName
            })
        } })
    if (response.ok) {
        window.location.reload()
    }
}

const editLastName = async () => {
    const lastName = prompt(props.language?.uiElements.login.loggedIn.editLastNamePrompt, props.userData?.lastName)
    if (lastName == null) return
    const jwt = ExpollStorage.jwt
    if (!jwt) return
    const response = await apiFetch({
        uri: "/user", 
        useAuth: true, 
        options: {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                lastName
            })
        } })
    if (response.ok) {
        window.location.reload()
    }
}
</script>

<style>
#basicAccountInfoContainer{
  text-align: left;
  padding: var(--default-padding);
  background-color: var(--secondary-color);
  border-radius: var(--default-border-radius);
  display: flex;
  flex-direction: column;
}

#basicAccountInfoContainer > *{
  margin: 0.5ch;
}

</style>