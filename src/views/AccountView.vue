<template>
    <LoadingScreen v-if="userData == undefined && !failedLoading" />

    <div v-if="userData != undefined && loggedIn" id="accountContainer">
        <BasicAccountInfo :language="language" :user-data="userData" />
        <Authenticators :language="language" :user-data="userData" />
        <Sessions :language="language" :user-data="userData" />
        <NotificationPreferences :language="language" :user-data="userData" />
        <OIDCLogins :language="language" :user-data="userData" />


        <button @click="loginApp">
            {{ language?.uiElements.login.loggedIn.loginAppBtn }}
        </button>

        <button style="background-color: var(--secondary-color); 
            border-radius: var(--default-border-radius); 
            padding: var(--default-padding);" @click="requestPersonalData">
            {{ language?.uiElements.login.loggedIn.personalizedDBContent }}
        </button>

        <br>
        <button @click="logout">
            {{ language?.uiElements.login.logoutBtn }}
        </button>
        <br>
        <button class="delete" style="margin-top: 30vh;" @click="deleteUser">
            {{ language?.uiElements.login.loggedIn.deleteAccount }}
        </button>
    </div>
</template>

<script lang="ts" setup>
import type { languageData } from "@/scripts/languageConstruct"
import * as user from "../scripts/user"
import LoadingScreen from "../components/utils/LoadingScreen.vue"
import * as auth from "@/scripts/authentication"
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import BasicAccountInfo from "@/components/account/BasicAccountInfo.vue"
import Authenticators from "@/components/account/Authenticators.vue"
import Sessions from "@/components/account/Sessions.vue"
import NotificationPreferences from "@/components/account/NotificationPreferences.vue"
import OIDCLogins from "@/components/account/OIDCLogins.vue"
import type { IUser } from "@/types/bases"
import { setCookie } from "@/scripts/cookie"
import ExpollStorage from "@/scripts/storage"
import type { DisplaySize } from '@/scripts/displayHelper'

const props = defineProps<{ userData?: IUser, language: languageData, failedLoading: boolean, displaySize: DisplaySize }>()
const router = useRouter()

onMounted(async () => {
    if (props.userData == undefined) {
        router.push("/login")
        return
    }
})

const loggedIn = computed(() => {
    return props.userData != undefined
})

const requestPersonalData = async () => {
    const data = await user.requestPersonalData()
    alert(data)
}

const logout = async () => {
    await auth.logout()
    location.reload()
}

const deleteUser = async () => {
    if (props.userData?.admin) {
        alert("You are an admin, you cannot delete your account")
        return
    }
    if (
        confirm(
            "Are you sure you want to delete your user account? " +
            "You loose your access to the account and your personal information will be deleted"
        )
    ) {
        if (
            confirm(
                "Deleting your user account will remove your access to your votes and polls, " +
                "are you sure you want to continue?"
            )
        ) {
            if (confirm("A confirmation email will be delivered, once opened this action cannot be undone")) {
                await user.deleteUser()
                location.reload()
            }
        }
    }
}

const loginApp = () => {
    setCookie("expoll_session", JSON.stringify({ jwt: ExpollStorage.jwt ?? "" }))
    window.open("/api/auth/simple/app", "_blank")
}


</script>

<style scoped>
#accountContainer {
    display: flex;
    flex-direction: column;
    gap: 2ch;
}

.columnContainer {
    display: flex;
    max-width: 80vw;
    flex-wrap: wrap;
    flex-direction: row;
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

pre {
    text-align: left;
    background: var(--secondary-color);
    padding: 1rem;
    border-radius: var(--default-border-radius);
}
</style>
