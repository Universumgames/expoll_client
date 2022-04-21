<template>
    <div>
        <user-icon :userData="this.userData" :language="this.localeLanguage" />
        <div id="nav">
            <router-link v-show="this.userData != undefined" to="/polls">{{
                this.localeLanguage?.uiElements.navigation.polls
            }}</router-link>
            <router-link to="/">{{ this.localeLanguage?.uiElements.navigation.home }}</router-link>
            <router-link to="/about">About</router-link>
            <router-link to="/admin" v-if="userData?.admin">Admin</router-link>
        </div>
        <router-view :userData="this.userData" :language="localeLanguage" :failedLoading="this.failedLoading" />

        <div class="footer">
            <label>Created by universumgames</label><br />
            <a href="https://universegame.de">Website</a>
            <a href="https://github.com/universumgames">Github</a>
            <a href="https://universegame.de/bug">Bugreport</a><br />
            <a href="https://www.buymeacoffee.com/universum" target="_blank"
                ><img
                    src="https://cdn.buymeacoffee.com/buttons/default-orange.png"
                    alt="Buy Me A Coffee"
                    height="41"
                    width="174" /></a
            ><br />
            <p>Version 1.2</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import UserIcon from "./components/UserIcon.vue"
    import { isDarkMode } from "./scripts/helper"
    import { IUser } from "expoll-lib/interfaces"
    import { getUserData } from "./scripts/user"
    import getSystemLanguage, { languageData } from "./scripts/languageConstruct"

    @Options({
        components: {
            UserIcon
        }
    })
    export default class App extends Vue {
        isDark: boolean = false
        userData?: IUser
        localeLanguage!: languageData
        failedLoading = false

        async created() {
            this.localeLanguage = getSystemLanguage()
            // @ts-ignore
            this.$router.beforeEach(async (to) => {
                document.title = to.meta.title != undefined ? (to.meta.title as string) : "404 Page not found"
                const badges = document.getElementsByClassName("grecaptcha-badge")
                for (let i = 0; i < badges.length; i++) {
                    // @ts-ignore
                    badges[i].style.visibility = to.path == "/login" ? "visible" : "hidden"
                }
            })
        }

        async mounted() {
            const startUserGet = getUserData()
            this.manageDarkMode()

            // this.userData = await getUserData("d3303768-c3d1-4ada-97cb-e433c9c45d25")
            try {
                this.userData = await startUserGet
                console.log(this.userData)
            } catch {
                this.failedLoading = true
            }
            this.$forceUpdate()
            // this.forceLogin()
        }

        forceLogin() {
            // @ts-ignore
            if (this.userData == undefined) {
                // @ts-ignore
                this.$router.push({ path: "/login" })
            }
        }

        manageDarkMode() {
            this.isDark = isDarkMode()
            // watch for darkmode changes
            window.matchMedia("(prefers-color-scheme: dark)").addListener((e) => {
                this.isDark = isDarkMode()
                document.body.classList.remove(!this.isDark ? "darkVars" : "lightVars")
                document.body.classList.add(this.isDark ? "darkVars" : "lightVars")
            })
            document.body.classList.add(this.isDark ? "darkVars" : "lightVars")
        }
    }
</script>

<style>
    body {
        background: var(--bg-color);
    }

    p {
        white-space: pre-wrap;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: var(--text-color);
        position: relative;
    }

    button {
        background: #42b983;
        border: none;
        padding: 0.5rem;
        border-radius: 1ch;
        color: var(--text-color);
        font-weight: bold;
        font-size: 1rem;
        cursor: pointer;
        width: fit-content;
        transition-duration: 0.4s;
        margin: 1ch;
    }

    button:hover {
        filter: invert(100%);
    }

    input,
    textarea {
        color: var(--text-color);
        padding: 1ch;
        background: var(--secondary-color);
        border: none;
        margin: 1ch;
        border-radius: 1ch;
    }

    select {
        border: none;
        background: var(--secondary-color);
        color: var(--text-color);
        margin: 1ch;
        padding: 1ch;
        border-radius: 1ch;
    }

    #nav {
        padding: 30px;
    }

    a {
        font-weight: bold;
        color: var(--text-color);
        text-decoration: none;
        margin-left: 1ch;
        display: inline-block;
    }

    a.router-link-exact-active {
        color: #42b983;
    }

    .lightVars {
        --text-color: #2c3e50;
        --bg-color: whitesmoke;
        --secondary-color: #dddddd;
        --primary-color: #42b983;
        --blank-text-color: var(--bg-color);
        --alert-color: #ba4b4a;
    }

    .darkVars {
        --text-color: whitesmoke;
        --bg-color: #2c3e50;
        --secondary-color: #314961;
        --primary-color: #42b983;
        --blank-text-color: var(--bg-color);
        --alert-color: #ba4b4a;
    }

    .errorInfo {
        color: var(--alert-color);
    }

    .normalIcon {
        width: 1rem;
        height: 1rem;
    }

    td,
    th {
        padding: 0.5rem;
        background: var(--secondary-color);
    }

    .footer {
        background: var(--secondary-color);
        padding: 1rem;
        border-radius: 1ch;
        margin: 1ch auto 1ch auto;
    }

    .footer > * {
        margin: 1ch;
    }

    .grecaptcha-badge {
        visibility: hidden;
    }
</style>
