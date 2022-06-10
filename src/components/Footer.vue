<template>
    <div class="footer">
        <div class="footer-center">
            <languageSelect @langChange="onLangChange" :language="language" />
        </div>
        <label>Created by universumgames</label><br />
        <a href="https://universegame.de">Website</a>
        <a href="https://github.com/universumgames">Github</a>
        <a
            :href="
                'https://universegame.de/bug?app=expoll&v=' +
                bugreportVersion +
                (userData != undefined ? '&mail=' + encodeURIComponent(userData.mail) : '')
            "
            target="_blank"
            >Bugreport</a
        >
        <router-link to="/privacy">{{ language?.uiElements.navigation.privacyPolicy }}</router-link>
        <router-link to="/siteNotice">{{ language?.uiElements.navigation.siteNotice }}</router-link>
        <br />
        <a href="https://www.buymeacoffee.com/universum" target="_blank"
            ><img
                src="https://cdn.buymeacoffee.com/buttons/default-orange.png"
                alt="Buy Me A Coffee"
                height="41"
                width="174" /></a
        ><br />
        <p>Frontend-Version {{ frontendVersion }}</p>
        <p>Backend-Version {{ backendVersion }}</p>
    </div>
</template>

<script lang="ts">
    import { IUser } from "expoll-lib/interfaces"
    import { Options, Vue } from "vue-class-component"
    import { languageData } from "../scripts/languageConstruct"
    import LanguageSelect from "./LanguageSelect.vue"

    @Options({
        props: {
            userData: Object,
            language: Object,
            frontendVersion: Object,
            backendVersion: Object
        },
        components: {
            LanguageSelect
        }
    })
    export default class FooterVue extends Vue {
        language?: languageData

        userData: IUser | undefined

        frontendVersion?: string
        backendVersion?: string

        get bugreportVersion() {
            return encodeURIComponent("Frontend " + this.frontendVersion + ", Backend " + this.backendVersion)
        }

        onLangChange(short: string) {
            this.$emit("onLangChange", short)
        }
    }
</script>
