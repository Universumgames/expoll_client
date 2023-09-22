<template>
    <div>
        <div v-show="isImpersonating">
            You are currently impersonating {{ impersonatingMail }}
            <button class="delete" @click="unimpersonate">
                Stop impersonation
            </button>
        </div>
        <nav-bar :language="localeLanguage" :user-data="userData" />

        <div v-show="!clientIsCompatible" id="versionUnmatch">
            <strong>Warning:</strong> Your client is not compatible with the current backend version. Please update your
            client.
        </div>

        <router-view :failed-loading="failedLoading" :language="localeLanguage" :user-data="userData" />

        <footer-vue
            :backend-version="backendVersion" :frontend-version="frontendVersion"
            :language="localeLanguage"
            :user-data="userData!" @colorChange="changeColor"
            @onLangChange="onLangChange"
        />
    </div>
</template>

<script lang="ts" setup>
import { isDarkMode, isMobile } from "./scripts/helper"
import { IUser, ReturnCode } from "@/lib/interfaces"
import { getUserData } from "./scripts/user"
import getSystemLanguage, { getLanguage, languageData } from "./scripts/languageConstruct"
import axios from "axios"
import FooterVue from "./components/Footer.vue"
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getCookie } from "@/scripts/cookie"
import NavBar from "@/components/NavBar.vue"

const route = useRoute()
const router = useRouter()

const isDark = ref(false)
const userData = ref<IUser>()
const localeLanguage = ref<languageData>(getSystemLanguage())
const failedLoading = ref(false)
const isImpersonating = ref(false)
const impersonatingMail = ref("")

const frontendVersion = ref("3.2.1")
const backendVersion = ref("unknown")
const clientIsCompatible = ref(true)

const created = async () => {
    const cookieLang = getCookie("lang")
    if (cookieLang == undefined) {
        localeLanguage.value = getSystemLanguage()
    } else {
        localeLanguage.value = getLanguage({ short: cookieLang })
    }
    router.beforeEach(async (to) => {
        // update title
        document.title = to.meta.title != undefined ? (to.meta.title as string) : "404 Page not found"
        // update apple universal links to deep link
        const bannerMetaTag = document.querySelector("meta[name=\"apple-itunes-app\"]")
        const appID = bannerMetaTag?.getAttribute("content")?.split(",").find((e) => e.includes("app-id"))
        let appPath = "app-argument=expoll://" + to.meta.appPath
        // replace :id in appPath with the actual id in the route
        if (to.params.id != undefined) {
            appPath = appPath.replace(":id", to.params.id as string)
        }
        if (appID != undefined && to.meta.appPath != undefined) {
            bannerMetaTag?.setAttribute("content", appID + "," + appPath)
        } else if (appID != undefined) {
            bannerMetaTag?.setAttribute("content", appID)
        }
        // update grecaptcha visibility
        const badges = document.getElementsByClassName("grecaptcha-badge")
        for (let i = 0; i < badges.length; i++) {
            (badges[i] as HTMLElement).style.visibility = to.path == "/login" ? "visible" : "hidden"
        }

        if (to.path == "/login" && userData.value != undefined) {
            router.push({ path: "/account" })
        }
    })

    try {
        backendVersion.value = (await axios.get("/api/serverInfo")).data.version
        fetch("/api/compliance", {
            method: "OPTIONS",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ version: frontendVersion.value, platform: "web" })
        }).then((res) => {
            clientIsCompatible.value = res.status == ReturnCode.OK
        }).catch((e) => {
            clientIsCompatible.value = false
        })
    } catch (e) {
        backendVersion.value = "unknown"
    }
}

onMounted(async () => {
    created()
    const startUserGet = getUserData()
    if (startUserGet != undefined && route.path == "/login") {
        router.push({ path: "/account" })
    }
    manageDarkMode()

    // this.userData = await getUserData("d3303768-c3d1-4ada-97cb-e433c9c45d25")
    userData.value = await startUserGet
    // console.log(this.userData)
    if (userData.value == undefined) failedLoading.value = true

    await loadImpersonation()
    // this.forceLogin()
})

const forceLogin = () => {
    if (userData.value == undefined) {
        router.push({ path: "/login" })
    }
}

const manageDarkMode = () => {
    isDark.value = isDarkMode()
    // watch for darkmode changes
    window.matchMedia("(prefers-color-scheme: dark)").addListener((e) => {
        isDark.value = isDarkMode()
        document.body.classList.remove(!isDark.value ? "darkVars" : "lightVars")
        document.body.classList.add(isDark.value ? "darkVars" : "lightVars")
    })
    document.body.classList.add(isDark.value ? "darkVars" : "lightVars")
}

const changeColor = (short: string) => {
    isDark.value = isDarkMode()
    document.body.classList.remove(!isDark.value ? "darkVars" : "lightVars")
    document.body.classList.add(isDark.value ? "darkVars" : "lightVars")
}

const onLangChange = (short: string) => {
    localeLanguage.value = getLanguage({ short: short })
    console.log("Changed language to " + short)
    document.cookie = "lang=" + short
    if (route.name == "Home") {
        window.location.reload()
    }
}


const unimpersonate = async () => {
    await axios.post("/api/admin/unImpersonate")
    window.location.reload()
}

const loadImpersonation = async () => {
    try {
        const impersonationResult = await axios.get("/api/admin/isImpersonating")
        isImpersonating.value = impersonationResult.status == ReturnCode.OK
        impersonatingMail.value = impersonationResult.data.mail ?? ""
    } catch (e) {
    }
}
</script>

<style>

html {
  scroll-behavior: smooth;
}

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
  display: inline-block;
}

a.router-link-exact-active {
  color: #42b983;
}

.lightVars {
  --text-color: #2c3e50;
  --bg-color: #f5f5f5;
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

.footer-center {
  display: flex;
  justify-content: center;
}

.btn-disabled {
  background-color: grey !important;
}

.delete {
  background-color: var(--alert-color);
}

pre {
  white-space: pre-wrap;
  /* Since CSS 2.1 */
  white-space: -moz-pre-wrap;
  /* Mozilla, since 1999 */
  white-space: -pre-wrap;
  /* Opera 4-6 */
  white-space: -o-pre-wrap;
  /* Opera 7 */
  word-wrap: break-word;
  /* Internet Explorer 5.5+ */
}

#versionUnmatch {
  background-color: var(--alert-color);
  padding: 1ch;
  position: sticky;
  top: 0;
  z-index: 101;
}

.bannerContainer {
  width: 100%;
  position: sticky;
}

.evenlySpacedChildsContainer{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
