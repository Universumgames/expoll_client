<template>
    <h1>{{ language?.uiElements.appInstall.title }}</h1>
    <a href="https://testflight.apple.com/join/OpUycQnW"> <img src="../assets/onTestflight.png"></a>
    <vue-markdown class="text" :source="markdown" style="text-align: center" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import VueMarkdown from "vue-markdown-render"
import { languageData } from "@/scripts/languageConstruct"

@Options({
    components: {
        VueMarkdown
    },
    props: {
        language: Object
    }
})
export default class AppInstall extends Vue {
    markdown = ""
    language?: languageData

    async created() {
        this.markdown = this.language?.uiElements.appInstall.belowImage ?? ""
    }

    mounted() {
    }
}
</script>

<style scoped>
.text {
    text-align: left;
}
</style>
