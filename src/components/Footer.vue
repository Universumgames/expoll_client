<template>
    <div class="footer">
        <div class="quickSettings">
            <languageSelect :language="language" @langChange="onLangChange" />
            <color-mode-select :language="language" @colorChange="changeColor" />
        </div>
        <div class="footer_links">
            <div class="expoll_about_links">
                <small>Expoll</small>
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
            </div>
            <div class="expoll_source_links">
                <small>Source Code and documentation</small>
                <a
                    href="https://git.mt32.net/universum/expoll_server"
                    target="_blank"
                >Server Source</a>
                <a href="https://git.mt32.net/universum/expoll_client" target="_blank">Client Source</a>
                <a href="/api/openapi" target="_blank">API Documentation</a>
            </div>
            <div class="apps">
                <small>Apps</small>
                <a href="https://apps.apple.com/app/expoll/id1639799209">
                    iOS App
                </a>
                <router-link to="/app">
                    iOS Beta
                </router-link>
            </div>
            <div class="personal_links">
                <small>Other Projects</small>
                <a href="https://universegame.de">Website</a>
                <a href="https://github.com/universumgames">Github</a>
                <a
                    href="https://mt32.net"
                    target="_blank"
                >Blog</a>
            </div>
        </div>
        <div class="bmc">
            <small>Sponsor me</small>
            <a href="https://www.buymeacoffee.com/universum" target="_blank">
                <img
                    alt="Buy Me A Coffee"
                    height="41"
                    loading="lazy"
                    src="https://cdn.buymeacoffee.com/buttons/default-orange.png"
                    width="174"
                ></a>
        </div>
        <div class="belowFooter">
            <div class="versionInfo">
                <small>Frontend-Version {{ frontendVersion }}</small>
                <small>Backend-Version {{ backendVersion }}</small>
            </div>
            <div>
                <small>Created by universumgames</small>
            </div>
        </div>
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

<style>
.footer {
  background: var(--secondary-color);
  padding: 1rem;
  border-radius: 1ch;
  margin: 1ch auto 1ch auto;
  text-align: left;
}

.footer_links {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.footer_links > div {
  display: flex;
  flex-direction: column;
}

.footer  * {
  margin: 1ch;
}

.versionInfo {
}

.belowFooter {
  font-size: small;
  display: flex;
  justify-content: space-between;
}

.quickSettings{
  display: flex;
  justify-content: center;
}

.footer small {
  color: var(--text-color-dimmed);
  display: block;
}

.bmc {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.bmc * {
  margin: 0.5ch;
}

.bmc img{
  width: min(40ch, 80vw);
  height: auto;
}
</style>