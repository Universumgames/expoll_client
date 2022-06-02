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
                    <summary>See what data of you is in our database</summary>
                    <pre>{{ personalizedData }}</pre>
                </details>
                <br />
                <p>
                    To delete your account please notify me via
                    <a href="mailto:programming@universegame.de">programming@universegame.de</a> and please use the mail
                    address you used to register your account
                </p>
                <button @click="logout">{{ language?.uiElements.login.logoutBtn }}</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { IUser } from "expoll-lib/interfaces"
    import { languageData } from "../scripts/languageConstruct"
    import { logout } from "../scripts/user"
    import LoadingScreen from "../components/LoadingScreen.vue"
    import LoginSignupView from "../components/LoginSignupView.vue"
    import axios from "axios"

    @Options({
        props: {
            userData: Object,
            language: Object,
            failedLoading: Boolean
        },
        components: {
            LoadingScreen,
            LoginSignupView
        }
    })
    export default class Login extends Vue {
        language?: languageData

        userData: IUser | undefined
        loggingIn: boolean = false
        failedLoading?: boolean

        personalizedData: string = ""

        async mounted() {
            this.personalizedData = JSON.stringify(
                (await axios.get("/api/user/personalizeddata", { withCredentials: true })).data,
                null,
                2
            )
        }

        get loggedIn() {
            return this.userData != undefined
        }

        async logout() {
            await logout()
            location.reload()
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
</style>
