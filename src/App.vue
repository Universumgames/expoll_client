<template>
    <div>
        <user-icon :userData="this.userData" />
        <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link>
        </div>
        <router-view :userData="this.userData" />
    </div>
</template>

<script lang="ts">
    import axios from "axios"
    import { Options, Vue } from "vue-class-component"
    import UserIcon from "./components/UserIcon.vue"
    import { isDarkMode } from "./scripts/helper"
    import { IUser } from "./scripts/interfaces"
    import { getUserData } from "./scripts/user"

    @Options({
        components: {
            UserIcon
        }
    })
    export default class App extends Vue {
        isDark: boolean = false
        userData?: IUser

        async mounted() {
            this.manageDarkMode()

            // @ts-ignore
            this.$router.beforeEach((to) => {
                document.title = to.meta.title != undefined ? (to.meta.title as string) : "404 Page not found"
            })

            // this.userData = await getUserData("d3303768-c3d1-4ada-97cb-e433c9c45d25")
            try {
                this.userData = await getUserData()
            } catch {}
            this.$forceUpdate()

            console.log(await (await axios.get("/api/poll")).data)
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
    }

    input {
        color: var(--text-color);
        padding: 1ch;
        background: var(--bg-color);
        border: none;
        margin: 1ch;
        border-radius: 1ch;
    }

    #nav {
        padding: 30px;
    }

    a {
        font-weight: bold;
        color: var(--text-color);
    }

    a.router-link-exact-active {
        color: #42b983;
    }

    .lightVars {
        --text-color: #2c3e50;
        --bg-color: whitesmoke;
        --secondary-color: rgb(192, 192, 192);
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
