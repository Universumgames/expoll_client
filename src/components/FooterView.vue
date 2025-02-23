<template>
    <div class="footer">
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
                    tabindex="0"
                    :id="jumpToFooterID"
                >Bugreport</a>
                <RouterLink to="/privacy" tabindex="0">
                    {{ language?.uiElements.navigation.privacyPolicy }}
                </RouterLink>
                <RouterLink to="/siteNotice" tabindex="0">
                    {{ language?.uiElements.navigation.siteNotice }}
                </RouterLink>
                <RouterLink to="/support" tabindex="0">
                    {{ language?.uiElements.navigation.support }}
                </RouterLink>
            </div>
            <div class="expoll_source_links">
                <small>Source Code</small>
                <a
                    href="https://git.mt32.net/universum/expoll_server"
                    target="_blank"
                    tabindex="0"
                >Server Source</a>
                <a href="https://git.mt32.net/universum/expoll_client" target="_blank" tabindex="0">Client Source</a>
                <a href="/api/openapi" target="_blank" tabindex="0">API Documentation</a>
            </div>
            <div class="apps">
                <small>Apps</small>
                <a href="https://apps.apple.com/app/expoll/id1639799209" tabindex="0">
                    iOS App
                </a>
                <RouterLink to="/app" tabindex="0">
                    Join iOS Beta
                </RouterLink>
            </div>
            <div class="personal_links">
                <small>Other Projects</small>
                <a href="https://universegame.de" tabindex="0">Website</a>
                <a href="https://github.com/universumgames" tabindex="0">Github</a>
                <a
                    href="https://mt32.net"
                    target="_blank"
                    tabindex="0"
                >Blog</a>
            </div>
        </div>
        <div class="quickSettings">
            <languageSelect :language="language" @langChange="onLangChange" />
            <color-mode-select :language="language!" @colorChange="changeColor" />
        </div>
        <div class="bmc">
            <small>Sponsor me</small>
            <a href="https://www.buymeacoffee.com/universum" target="_blank" tabindex="0" aria-label="Buy me a coffee link">
                <img
                    alt="Buy Me A Coffee"
                    height="41"
                    loading="lazy"
                    src="https://cdn.buymeacoffee.com/buttons/default-orange.png"
                    style="border-radius: var(--default-border-radius);"
                    width="174"
                ></a>
        </div>
        <div class="belowFooter">
            <div class="versionInfo">
                <small>Frontend-Version {{ frontendVersion }} {{ ExpollStorage.platformName }}
                    {{ ExpollStorage.runsAsPWA() ? "PWA" : "" }}</small>
                <small>Backend-Version {{ backendVersion }}</small>
            </div>
            <div>
                <small>Created by universumgames</small>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { languageData } from "@/scripts/languageConstruct"
import LanguageSelect from "./LanguageSelect.vue"
import { computed } from "vue"
import ColorModeSelect from "@/components/ColorModeSelect.vue"
import ExpollStorage from "../scripts/storage"
import type { IUser, LocalUser } from '@/types/bases'
import { RouterLink } from 'vue-router'
import { jumpToFooterID } from '@/scripts/jumpElementIDs.ts'

interface Props {
    userData: LocalUser | undefined
    language: languageData | undefined
    frontendVersion: string
    backendVersion: string
}

const props = defineProps<Props>()
const emit = defineEmits(["onLangChange", "colorChange"])

const bugreportVersion = computed(() =>
    encodeURIComponent(
        "Frontend " + props.frontendVersion + " " + ExpollStorage.platformName + ", Backend " + props.backendVersion)
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
  border-radius: var(--default-border-radius);
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

.footer * {
  margin: 1ch;
}

.versionInfo {
}

.belowFooter {
  font-size: small;
  display: flex;
  justify-content: space-between;
}

.belowFooter * {
}

.quickSettings {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.quickSettings > * {
  margin: 0.5ch;
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

.bmc img {
  width: min(30ch, 80vw);
  height: auto;
}
</style>