<template>
    <h1>{{ language?.uiElements.appInstall.title }}</h1>
    <a href="https://testflight.apple.com/join/OpUycQnW"> <img src="../assets/onTestflight.png"></a>
    <vue-markdown class="text" :source="markdown" style="text-align: center" />
</template>

<script setup lang="ts">
import VueMarkdown from "vue-markdown-render"
import type { languageData } from "@/scripts/languageConstruct"
import { onMounted, ref } from "vue"

const props = defineProps<{ language: languageData }>()

const markdown = ref("")

onMounted(async () => {
    markdown.value = props.language?.uiElements.appInstall.belowImage ?? ""
})
</script>

<style scoped>
.text {
    text-align: left;
}
</style>
