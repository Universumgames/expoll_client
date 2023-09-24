<template>
    <loading-screen v-if="userData == undefined && !failedLoading" />

    <div v-show="userData != undefined && loggedIn">
        <h1>{{ language?.uiElements.login.alreadyLoggedInAs(userData?.username ?? "") }}</h1>
        <div>
            <label>{{ language?.uiElements.login.form.username }}: {{ userData?.username }}
                <button
                    @click="editUsername"
                >
                    <edit-icon class="normalIcon" />
                </button>
            </label><br>
            <label>{{ language?.uiElements.login.form.mail }}: {{ userData?.mail }}</label><br>
            <label>{{ language?.uiElements.login.form.firstName }}: {{ userData?.firstName }}
                <button
                    @click="editFirstName"
                >
                    <edit-icon class="normalIcon" />
                </button>
            </label><br>
            <label>{{ language?.uiElements.login.form.lastName }}: {{ userData?.lastName }}
                <button
                    @click="editLastName"
                >
                    <edit-icon class="normalIcon" />
                </button>
            </label><br>

            <label>{{ language.uiElements.login.loggedIn.createdOn }}:
                {{ new Date(userData?.createdTimestamp).toLocaleString() }}</label><br><br>

            <a href="/api/auth/simple/app" target="_blank">
                <button>{{ language?.uiElements.login.loggedIn.loginAppBtn }}</button>
            </a>

            <details open>
                <summary>{{ language?.uiElements.login.loggedIn.oidcLogins }}</summary>


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
            </details>
            <br>

            <details>
                <summary>{{ language?.uiElements.login.loggedIn.viewAuth }}</summary>
                <button v-show="supportsWebauthn" @click="addAuth()">
                    {{ language?.uiElements.login.loggedIn.addAuth }}
                </button>

                <div v-show="authenticators.length > 0">
                    <authenticator-detail
                        v-for="auth in authenticators" :key="auth.credentialID"
                        :language="language"
                        :user-data="userData" :authenticator="auth"
                        @update="updateAuthenticators"
                    />
                </div>
                <div v-show="authenticators == undefined || authenticators.length == 0" id="emptyAuthContainer">
                    {{ language?.uiElements.login.loggedIn.authEmpty }}
                </div>

                <div>{{ language?.uiElements.login.loggedIn.authDisclaimer }}</div>
            </details>
            <br>
            <details>
                <summary>{{ language?.uiElements.login.loggedIn.activeSessions }}</summary>
                <button class="delete" @click="logoutEverywhere">
                    Logout everywhere
                </button>

                <div
                    v-for="session in personalizedJSON?.sessions ?? []" :key="session.expiration"
                    class="session"
                    :style="session.active ? 'color:orange;' : ''"
                >
                    {{ session.active ? "current Session" : "" }}
                    Expires: {{ language?.uiElements.dateTimeToString(new Date(session.expiration)) }} userAgent: {{
                        limitLength(session.userAgent ?? "unknown", 40)
                    }}
                    <button v-show="!session.active" class="delete" @click="deleteSession(session.nonce)">
                        Delete
                    </button>
                </div>
            </details>
            <br>
            <details>
                <summary>{{ language?.uiElements.login.loggedIn.personalizedDBContent }}</summary>
                <pre>{{ personalizedData }}</pre>
            </details>

            <br>
            <button @click="logout">
                {{ language?.uiElements.login.logoutBtn }}
            </button>
            <br>
            <button class="delete" style="margin-top: 30vh;" @click="deleteUser">
                {{ language?.uiElements.login.loggedIn.deleteAccount }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IUser } from "@/lib/interfaces"
import { languageData } from "@/scripts/languageConstruct"
import * as user from "../scripts/user"
import LoadingScreen from "../components/LoadingScreen.vue"
import * as auth from "@/scripts/authentication"
import * as webauthnJson from "@github/webauthn-json"

import AuthenticatorDetail from "../components/AuthenticatorDetail.vue"
import { capitalizeFirstLetter, limitLength } from "@/scripts/helper"
import EditIcon from "@/assetComponents/EditIcon.vue"
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import ExpollStorage from "@/scripts/storage"

const props = defineProps<{ userData: IUser, language: languageData, failedLoading: boolean }>()
const router = useRouter()

const personalizedData = ref("")
const personalizedJSON = ref<any>({})

const authenticators = ref<any[]>([])
const oidcConnections = ref<auth.OIDCConnection[]>([])
const providers = ref<{ key: string, imageURI: string, imageSmallURI: string, altName: string }[]>([])
const missingProviders = ref<string[]>([])

onMounted(async () => {
    if (props.userData == undefined) {
        router.push("/login")
        return
    }
    await getPersonalizedData()
    await updateAuthenticators()
    oidcConnections.value = await auth.getOIDCConnections()
    providers.value = await auth.getAvailableOIDCProviders()
    const existingProviders = oidcConnections.value.map(t => t.name)

    missingProviders.value = providers.value
        .filter(prov => !existingProviders.includes(prov.key))
        .map(prov => prov.key)
})

const getPersonalizedData = async () => {
    personalizedJSON.value = await user.getPersonalizedData()
    if (personalizedJSON.value != undefined) {
        personalizedData.value = JSON.stringify(personalizedJSON.value, null, 2)
    }
}

const updateAuthenticators = async () => {
    authenticators.value = await getAuthenticators()
}

const loggedIn = computed(() => {
    return props.userData != undefined
})

const logout = async () => {
    await auth.logout()
    location.reload()
}

const deleteUser = async () => {
    if (props.userData == undefined) return
    if (props.userData!.admin) {
        alert("You are an admin, you cannot delete your account")
        return
    }
    if (
        confirm(
            "Are you sure you want to delete your user account? You loose your access to the account and your personal information will be deleted"
        )
    ) {
        if (
            confirm(
                "Deleting your user account will remove your access  to your votes and polls, are you sure you want to continue?"
            )
        ) {
            if (confirm("A confirmation email will be delivered, once opened this action cannot be undone")) {
                await user.deleteUser()
                location.reload()
            }
        }
    }
}

const supportsWebauthn = async () => {
    return webauthnJson.supported()
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
    return (await auth.getWebauthnList()).sort((a: any, b: any) => {
        return a.created < b.created ? 1 : -1
    })
}

const deleteSession = async (session: any) => {
    if (confirm(props.language?.uiElements.login.loggedIn.deleteSessionPrompt)) {
        await deleteSession(session)
        await getPersonalizedData()
        await updateAuthenticators()
    }
}

const logoutEverywhere = async () => {
    if (confirm(props.language?.uiElements.login.loggedIn.logoutAllPrompt)) {
        await auth.logoutAllSessions()
        location.reload()
    }
}

const editUsername = async () => {
    const username = prompt(props.language?.uiElements.login.loggedIn.editUsernamePrompt, props.userData?.username)
    if (username == null) return
    const jwt = ExpollStorage.jwt
    if (!jwt) return
    const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwt
        },
        body: JSON.stringify({
            username
        })
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
    const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwt
        },
        body: JSON.stringify({
            firstName
        })
    })
    if (response.ok) {
        window.location.reload()
    }
}

const editLastName = async () => {
    const lastName = prompt(props.language?.uiElements.login.loggedIn.editLastNamePrompt, props.userData?.lastName)
    if (lastName == null) return
    const jwt = ExpollStorage.jwt
    if (!jwt) return
    const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwt
        },
        body: JSON.stringify({
            lastName
        })
    })
    if (response.ok) {
        window.location.reload()
    }
}
</script>

<style scoped>
.columnContainer {
    display: flex;
    max-width: 80vw;
    flex-wrap: wrap;
    flex-direction: row;
    background: var(--secondary-color);
    margin: auto;
    border-radius: 1rem;
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
    border-radius: 1ch;
}

.session {
    background: var(--secondary-color);
    border-radius: 1ch;
    padding: 0.2rem;
    margin: 0.5rem;
}

#emptyAuthContainer {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    background: var(--secondary-color);
    border-radius: 1rem;
    margin: 1rem;
    padding: 1ch;
    text-align: left;
}
</style>
