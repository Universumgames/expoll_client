<template>
    <MainLayout :displaySize="displaySize" :userData="userData" :language="localeLanguage">
      <div v-show="isImpersonating">
          You are currently impersonating {{ impersonatingMail }}
          <button class="delete" @click="unimpersonate">
              Stop impersonation
          </button>
      </div>
      <app-banner v-if="ExpollStorage.showIOSAppBanner" :language="localeLanguage" />

      <div v-show="!clientIsCompatible" id="versionUnmatch">
          <strong>Warning:</strong> Your client is not compatible with the current backend version. Please update your
          client.
      </div>

      <RouterView
          :display-size="displaySize"
          :failed-loading="failedLoading"
          :language="localeLanguage"
          :user-data="userData"
      />

      <Footer
          :backend-version="backendVersion" :frontend-version="frontendVersion"
          :language="localeLanguage"
          :user-data="undefined" @colorChange="changeColor"
          @onLangChange="onLangChange"
      />
    </MainLayout>
</template>

<script lang="ts" setup>
import "./styles/main.scss"
import { isDarkMode } from "./scripts/helper"
import { getUserData } from "./scripts/user"
import { getLanguage, getSystemLanguage, type languageData } from "./scripts/languageConstruct"
import Footer from "./components/FooterView.vue"
import { onMounted, ref } from "vue"
import NavBar from "./components/nav/NavBar.vue"
import ExpollStorage from "./scripts/storage"
import { initializePushNotifications } from "./scripts/notification"
import * as displayHelper from "./scripts/displayHelper"
import { DisplaySize } from "./scripts/displayHelper"
import type { IUser } from "./types/bases"
import { ReturnCode } from "./types/constants"
import { apiFetch } from "./scripts/apiRequests"
import AppBanner from "./components/AppBanner.vue"
import { RouterView, useRoute, useRouter } from 'vue-router'
import ViewContainer from '@/views/layout/ViewContainer.vue'
import MainLayout from '@/views/layout/MainLayout.vue'
import AccessibleJumpTo from '@/components/nav/AccessibleJumpTo.vue'


const route = useRoute()
const router = useRouter()

const isDark = ref(false)
const userData = ref<IUser>()
const localeLanguage = ref<languageData>(getSystemLanguage())
const failedLoading = ref(false)
const isImpersonating = ref(false)

const impersonatingMail = ref("")

const frontendVersion = ref(ExpollStorage.appVersion)
const backendVersion = ref("unknown")
const clientIsCompatible = ref(true)

const created = async () => {
    await ExpollStorage.init()
    const cookieLang = ExpollStorage.language
    if (cookieLang == null) {
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
        apiFetch({ uri: "/serverInfo" })
            .then(async (res) => {
                const response = await res.json()
                backendVersion.value = response.version
            })
            .catch(() => {
                backendVersion.value = "unknown"
            })
        apiFetch({ 
            uri: "/compatibility",
            options: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ version: ExpollStorage.appVersion, platform: ExpollStorage.platformName })
            } 
        }).then((res) => {
            clientIsCompatible.value = res.status == ReturnCode.OK
        }).catch(() => {
            clientIsCompatible.value = false
        })
    } catch (e) {
        backendVersion.value = "unknown"
    }
}

onMounted(async () => {
    await created()
    const startUserGet = await getUserData()
    if (startUserGet != undefined) {
        initializePushNotifications()
    }
    if (startUserGet != undefined && route.path == "/login") {
        router.push({ path: "/account" })
        await openOutstandingPoll()
    }
    manageDarkMode()

    // this.userData = await getUserData("d3303768-c3d1-4ada-97cb-e433c9c45d25")
    userData.value = await startUserGet
    // console.log(this.userData)
    if (userData.value == undefined) failedLoading.value = true

    await loadImpersonation()
    // this.forceLogin()
})

const manageDarkMode = () => {
    isDark.value = isDarkMode()
    // watch for darkmode changes
    window.matchMedia("(prefers-color-scheme: dark)").addListener(() => {
        isDark.value = isDarkMode()
        document.body.classList.remove(!isDark.value ? "darkVars" : "lightVars")
        document.body.classList.add(isDark.value ? "darkVars" : "lightVars")
    })
    document.body.classList.add(isDark.value ? "darkVars" : "lightVars")
}

const changeColor = () => {
    isDark.value = isDarkMode()
    document.body.classList.remove(!isDark.value ? "darkVars" : "lightVars")
    document.body.classList.add(isDark.value ? "darkVars" : "lightVars")
}

const onLangChange = (short: string) => {
    localeLanguage.value = getLanguage({ short: short })
    console.log("Changed language to " + short)
    ExpollStorage.language = short
    if (route.name == "Home") {
        window.location.reload()
    }
}


const unimpersonate = async () => {
    await apiFetch({ uri: "/admin/unImpersonate", options: {
        method: "POST"
    } })
    ExpollStorage.jwt = ExpollStorage.originalJwt
    ExpollStorage.originalJwt = null
    window.location.reload()
}

const loadImpersonation = async () => {
    try {
        const response = (await apiFetch({ uri: "/admin/isImpersonating", useAuth: true, options: {
            method: "GET",
            headers: {

                "originalJWT": ExpollStorage.originalJwt ?? ""
            }
        } }))
        const impersonationResult = await response.json()
        isImpersonating.value = response.ok
        impersonatingMail.value = impersonationResult.mail ?? ""
    } catch (e) {
        isImpersonating.value = false
    }
}

const displaySize = ref(DisplaySize.XXL)

displaySize.value = displayHelper.getDisplaySize()

addEventListener("resize", () => {
    displaySize.value = displayHelper.getDisplaySize()
})

const openOutstandingPoll = async () => {
    const pollID = ExpollStorage.outstandingJoinPollID
    if (pollID == null) return
    ExpollStorage.outstandingJoinPollID = null
    await router.push({ path: "/polls/" + pollID })
}
</script>