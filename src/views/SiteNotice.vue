<template>
    <vue-markdown :source="markdown" class="text" />
</template>

<script setup lang="ts">
import VueMarkdown from "vue-markdown-render"
import type { languageData } from "@/scripts/languageConstruct"
import { onMounted, ref } from "vue"
import ExpollStorage from "@/scripts/storage"

defineProps<{ language: languageData }>()

const markdown = ref("")

onMounted(async () => {
    const filename = "/en_site_notice.md"
    markdown.value = await (await fetch(ExpollStorage.backendUrl + filename)).text()
})
</script>

<style scoped>
.text {
    text-align: left;
}
</style>
