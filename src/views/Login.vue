<template>
    <loading-screen v-if="userData == undefined && !failedLoading" />
    <!-- logged in -->
    <div v-show="(userData != undefined && loggedIn) || failedLoading">
        <login-signup-view v-if="!loggedIn" :language="language" />
        <div v-show="userData != undefined && loggedIn">
            <h1>{{ language?.uiElements.login.alreadyLoggedInAs(userData?.username ?? "") }}</h1>
            <div>
                <label>{{ language?.uiElements.login.form.username }}: {{ userData?.username }}</label
                ><br />
                <label>{{ language?.uiElements.login.form.mail }}: {{ userData?.mail }}</label
                ><br />
                <label>{{ language?.uiElements.login.form.firstName }}: {{ userData?.firstName }}</label
                ><br />
                <label>{{ language?.uiElements.login.form.lastName }}: {{ userData?.lastName }}</label
                ><br /><br />

                <details>
                    <summary>{{ language?.uiElements.login.loggedIn.viewAuth }}</summary>
                    <button @click="addAuth()" v-show="supportsWebauthn">
                        {{ language?.uiElements.login.loggedIn.addAuth }}
                    </button>

                    <div v-show="authenticators.length > 0">
                        <authenticator-detail
                            v-for="auth in authenticators"
                            :key="auth.credentialID"
                            :language="language"
                            :userData="userData"
                            :authenticator="auth"
                            @update="updateAuthenticators"
                        />
                    </div>
                    <div
                        v-show="authenticators == undefined || authenticators.length == 0"
                        style="
                            display: flex;
                            flex-wrap: wrap;
                            flex-direction: column;
                            background: var(--secondary-color);
                            border-radius: 1rem;
                            margin: 1rem;
                            padding: 1ch;
                            text-align: left;
                        "
                    >
                        {{ language?.uiElements.login.loggedIn.authEmpty }}
                    </div>

                    <div>{{ language?.uiElements.login.loggedIn.authDisclaimer }}</div>
                </details>
                <br />
                <details>
                    <summary>{{ language?.uiElements.login.loggedIn.activeSessions }}</summary>
                    <button @click="logoutEverywhere" class="delete">Logout everywhere</button>

                    <div
                        v-for="session in personalizedJSON?.sessions ?? []"
                        :key="session.expiration"
                        class="session"
                        :style="session.active ? 'color:orange;' : ''"
                    >
                        {{ session.active ? "current Session" : "" }}
                        Expires: {{ session.expiration }} userAgent: {{ session.userAgent ?? "unknown" }}
                        <button class="delete" v-show="!session.active" @click="deleteSession(session.shortKey)">
                            Delete
                        </button>
                    </div>
                </details>
                <br />
                <details>
                    <summary>{{ language?.uiElements.login.loggedIn.personalizedDBContent }}</summary>
                    <pre>{{ personalizedData }}</pre>
                </details>
                <br />
                <button @click="deleteUser" class="delete">
                    {{ language?.uiElements.login.loggedIn.deleteAccount }}
                </button>
                <br />
                <button @click="logout">{{ language?.uiElements.login.logoutBtn }}</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { IUser } from "expoll-lib/interfaces"
    import { languageData } from "../scripts/languageConstruct"
    import * as user from "../scripts/user"
    import LoadingScreen from "../components/LoadingScreen.vue"
    import LoginSignupView from "../components/LoginSignupView.vue"
    import { register, getWebauthnList, logoutAllSessions, deleteSession, logout } from "../scripts/authentication"
    import { browserSupportsWebauthn } from "@simplewebauthn/browser"
    import AuthenticatorDetail from "../components/AuthenticatorDetail.vue"

    @Options({
        props: {
            userData: Object,
            language: Object,
            failedLoading: Boolean
        },
        components: {
            LoadingScreen,
            LoginSignupView,
            AuthenticatorDetail
        }
    })
    export default class Login extends Vue {
        language?: languageData

        userData: IUser | undefined
        loggingIn: boolean = false
        failedLoading?: boolean

        personalizedData: string = ""
        personalizedJSON: any = {}

        authenticators: any[] = []

        async mounted() {
            await this.getPersonalizedData()
            await this.updateAuthenticators()
        }

        async getPersonalizedData() {
            this.personalizedJSON = await user.getPersonalizedData()
            if (this.personalizedJSON != undefined) {
                this.personalizedData = JSON.stringify(this.personalizedJSON, null, 2)
            }
        }

        async updateAuthenticators() {
            this.authenticators = await this.getAuthenticators()
            this.$forceUpdate()
        }

        get loggedIn() {
            return this.userData != undefined
        }

        async logout() {
            await logout()
            location.reload()
        }

        async deleteUser() {
            if (this.userData == undefined) return
            if (this.userData!.admin) {
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
                        "Deleting your user account will remove your access" +
                            " to your votes and polls, are you sure you want to continue?"
                    )
                ) {
                    if (confirm("A confirmation email will be delivered, once opened this action cannot be undone")) {
                        await user.deleteUser()
                        location.reload()
                    }
                }
            }
        }

        get supportsWebauthn(): boolean {
            return browserSupportsWebauthn()
        }

        async addAuth() {
            if (this.authenticators.length == 0 && !this.language) {
                alert(this.language!.uiElements.login.loggedIn.authDisclaimer)
            }
            const { success, error } = await register()
            if (!success) console.error(error)
            await this.updateAuthenticators()
        }

        async getAuthenticators(): Promise<any[]> {
            return (await getWebauthnList()).sort((a: any, b: any) => {
                return a.created < b.created ? 1 : -1
            })
        }

        async deleteSession(session: any) {
            if (confirm(this.language?.uiElements.login.loggedIn.deleteSessionPrompt)) {
                await deleteSession(session)
                await this.getPersonalizedData()
                await this.updateAuthenticators()
            }
        }

        async logoutEverywhere() {
            if (confirm(this.language?.uiElements.login.loggedIn.logoutAllPrompt)) {
                await logoutAllSessions()
                location.reload()
            }
        }
    }
</script>

<style scoped>
    .columnContainer {
        display: flex;
        max-width: 80vw;
        flex-wrap: wrap;
        flex-direction: columns;
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
</style>
