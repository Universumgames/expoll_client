<template>
    <div>
        <header>
            <user-icon :userData="userData" :language="localeLanguage" />
            <div id="nav">
                <a style="float: left" :href="userData != undefined ? '/#/polls' : '/'">Expoll</a>

                <router-link v-show="userData != undefined" to="/polls">{{
                    localeLanguage?.uiElements.navigation.polls
                }}</router-link>
                <router-link to="/">{{ localeLanguage?.uiElements.navigation.home }}</router-link>
                <!-- <router-link to="/about">About</router-link> -->
                <router-link to="/admin" v-if="userData?.admin">Admin</router-link>
            </div>
        </header>

        <router-view :userData="userData" :language="localeLanguage" :failedLoading="failedLoading" />

        <footer-vue
            @onLangChange="onLangChange"
            :language="localeLanguage"
            :backendVersion="backendVersion"
            :frontendVersion="frontendVersion"
            :userData="userData"
        />
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import UserIcon from "./components/UserIcon.vue"
    import LanguageSelect from "./components/LanguageSelect.vue"
    import { isDarkMode } from "./scripts/helper"
    import { IUser } from "expoll-lib/interfaces"
    import { getUserData } from "./scripts/user"
    import getSystemLanguage, { getLanguage, languageData } from "./scripts/languageConstruct"
    import axios from "axios"
    import FooterVue from "./components/Footer.vue"

    @Options({
        components: {
            UserIcon,
            LanguageSelect,
            FooterVue
        }
    })
    export default class App extends Vue {
        isDark: boolean = false
        userData?: IUser
        localeLanguage!: languageData
        failedLoading = false

        frontendVersion = "2.3.0"
        backendVersion = "unknown"

        async created() {
            const cookieLang = this.getCookie("lang")
            if (cookieLang == undefined) {
                this.localeLanguage = getSystemLanguage()
            } else {
                this.localeLanguage = getLanguage({ short: cookieLang })
            }
            // @ts-ignore
            this.$router.beforeEach(async (to) => {
                document.title = to.meta.title != undefined ? (to.meta.title as string) : "404 Page not found"
                const badges = document.getElementsByClassName("grecaptcha-badge")
                for (let i = 0; i < badges.length; i++) {
                    // @ts-ignore
                    badges[i].style.visibility = to.path == "/login" ? "visible" : "hidden"
                }
            })

            this.backendVersion = (await axios.get("/api/serverInfo")).data.version
        }

        async mounted() {
            const startUserGet = getUserData()
            this.manageDarkMode()

            // this.userData = await getUserData("d3303768-c3d1-4ada-97cb-e433c9c45d25")
            try {
                this.userData = await startUserGet
                // console.log(this.userData)
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

        onLangChange(short: string) {
            this.localeLanguage = getLanguage({ short: short })
            console.log("Changed language to " + short)
            document.cookie = "lang=" + short
            this.$forceUpdate()
            // @ts-ignore
            if (this.$route.name == "Home") {
                window.location.reload()
            }
        }

        getCookie(cname: string): string | undefined {
            const name = cname + "="
            const decodedCookie = decodeURIComponent(document.cookie)
            const ca = decodedCookie.split(";")
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i]
                while (c.charAt(0) == " ") {
                    c = c.substring(1)
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length)
                }
            }
            return undefined
        }
    }
</script>

<style>
    body {
        background: var(--bg-color);
        margin: 0;
        padding: 0;
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
        margin: 2ch;
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

    header {
        background: var(--secondary-color);
        border-radius: 1ch;
        margin-bottom: 2rem;
    }

    #nav {
        padding: 3ch;
        margin: 2ch;
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

    .footer-center {
        display: flex;
        justify-content: center;
    }

    .btn-disabled {
        background-color: gray !important;
    }

    .delete {
        background-color: var(--alert-color);
    }
</style>
