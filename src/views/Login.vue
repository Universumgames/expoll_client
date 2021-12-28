<template>
    <loading-screen v-if="this.userData == undefined && !this.failedLoading" />
    <!-- logged in -->
    <div v-show="(this.userData != undefined && this.loggedIn) || this.failedLoading">
        <login-signup-view v-if="!this.loggedIn" :language="this.language" />
        <div v-show="this.userData != undefined && this.loggedIn">
            <h1>{{ this.language?.uiElements.login.alreadyLoggedInAs(this.userData?.username) }}</h1>
            <div>
                <label>{{ this.language?.uiElements.login.form.username }}: {{ this.userData?.username }}</label
                ><br />
                <label>{{ this.language?.uiElements.login.form.mail }}: {{ this.userData?.mail }}</label
                ><br />
                <label>{{ this.language?.uiElements.login.form.firstName }}: {{ this.userData?.firstName }}</label
                ><br />
                <label>{{ this.language?.uiElements.login.form.lastName }}: {{ this.userData?.lastName }}</label
                ><br />
                <button @click="logout">{{ this.language?.uiElements.login.logoutBtn }}</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import axios from "axios"
    import { Options, Vue } from "vue-class-component"
    import { IUser } from "../scripts/interfaces"
    import { languageData } from "../scripts/languageConstruct"
    import { getUserData, signUp } from "../scripts/user"
    import LoadingScreen from "../components/LoadingScreen.vue"
    import LoginSignupView from "../components/LoginSignupView.vue"

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

        async mounted() {}

        get loggedIn() {
            return this.userData != undefined
        }

        async logout() {
            try {
                await axios.post("/api/user/logout", { withCredentials: true })
            } catch (error) {
                console.error(error)
            }
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
</style>
