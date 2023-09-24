<template>
    <div class="footer">
        <div class="footer-center">
            <languageSelect :language="language" @langChange="onLangChange" />
            <color-mode-select :language="language" @colorChange="changeColor" />
        </div>
        <label>Created by universumgames</label><br>
        <a href="https://apps.apple.com/app/expoll/id1639799209">
            iOS App <br>
            <img src="/app_icons/mac128.png">
        </a>
        <br>
        <router-link to="/app">
            <small>iOS Beta</small>
        </router-link>
        <br>
        <a href="https://universegame.de">Website</a>
        <a href="https://github.com/universumgames">Github</a>
        <a
            :href="
                'https://universegame.de/bug?app=expoll&v=' +
                    bugreportVersion +
                    (userData != undefined ? '&mail=' + encodeURIComponent(userData.mail) : '')
            "
            target="_blank"
        >Bugreport</a>
        <router-link to="/privacy">
            {{ language?.uiElements.navigation.privacyPolicy }}
        </router-link>
        <router-link to="/siteNotice">
            {{ language?.uiElements.navigation.siteNotice }}
        </router-link>
        <a
            href="https://mt32.net"
            target="_blank"
        >Blog</a>
        <br>
        <a
            href="https://git.mt32.net/universum/expoll_server"
            target="_blank"
        >Server Source</a>
        <a href="https://git.mt32.net/universum/expoll_client" target="_blank">Client Source</a>
        <a href="/api/openapi" target="_blank">API Documentation</a>

        <br>
        <a href="https://www.buymeacoffee.com/universum" target="_blank">
            <img
                alt="Buy Me A Coffee"
                height="41"
                loading="lazy"
                src="https://cdn.buymeacoffee.com/buttons/default-orange.png"
                width="174"
            ></a>
        <br>
        <p>Frontend-Version {{ frontendVersion }}</p>
        <p>Backend-Version {{ backendVersion }}</p>
    </div>
</template>

<script setup lang="ts">
import { IUser } from "@/lib/interfaces"
import { languageData } from "@/scripts/languageConstruct"
import LanguageSelect from "./LanguageSelect.vue"
import { computed } from "vue"
import ColorModeSelect from "@/components/ColorModeSelect.vue"

interface Props {
    userData: IUser|undefined
    language: languageData
    frontendVersion: string
    backendVersion: string
}

const props = defineProps<Props>()
const emit = defineEmits(["onLangChange", "colorChange"])

const bugreportVersion = computed(() =>
    encodeURIComponent("Frontend " + props.frontendVersion + ", Backend " + props.backendVersion)
)

const onLangChange = (short: string) => {
    emit("onLangChange", short)
}

const changeColor = (short: string | undefined) => {
    emit("colorChange", short)
}

</script>
