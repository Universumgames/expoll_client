<template>
    <div>
        <user-icon :userData="this.userData" :language="this.localeLanguage" />
        <div id="nav">
            <router-link v-show="this.userData != undefined" to="/">Polls</router-link> |
            <router-link to="/home">Home</router-link> |
            <router-link to="/about">About</router-link>
        </div>
        <router-view :userData="this.userData" :language="localeLanguage" />
    </div>
</template>

<script lang="ts">
    import axios from "axios"
    import { Options, Vue } from "vue-class-component"
    import UserIcon from "./components/UserIcon.vue"
    import { isDarkMode } from "./scripts/helper"
    import { IUser } from "./scripts/interfaces"
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

        async created() {
            this.localeLanguage = getSystemLanguage()
            // @ts-ignore
            this.$router.beforeEach((to) => {
                document.title = to.meta.title != undefined ? (to.meta.title as string) : "404 Page not found"
            })

            console.log(this.localeLanguage)
        }

        async mounted() {
            const startUserGet = getUserData()
            this.manageDarkMode()

            // this.userData = await getUserData("d3303768-c3d1-4ada-97cb-e433c9c45d25")
            try {
                this.userData = await startUserGet
            } catch {}
            this.$forceUpdate()
            this.forceLogin()
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

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: var(--text-color);
    }

    button {
        background: #42b983;
        border: none;
        padding: 1rem;
        border-radius: 1rem;
        color: var(--text-color);
        font-weight: bold;
        font-size: 1rem;
        cursor: pointer;
        width: fit-content;
        transition-duration: 0.4s;
    }

    button:hover {
        filter: invert(100%);
    }

    input,
    textarea {
        color: var(--text-color);
        padding: 1ch;
        background: var(--bg-color);
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
    }

    a.router-link-exact-active {
        color: #42b983;
    }

    .lightVars {
        --text-color: #2c3e50;
        --bg-color: whitesmoke;
        --secondary-color: #dddddd;
    }

    .darkVars {
        --text-color: whitesmoke;
        --bg-color: #2c3e50;
        --secondary-color: #314961;
    }

    .errorInfo {
        color: red;
    }
</style>
