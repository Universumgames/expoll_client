<template>
    <vue-markdown class="text" :source="markdown" />
</template>

<script setup lang="ts">
import VueMarkdown from "vue-markdown-render"

import { languageData } from "@/scripts/languageConstruct"
import { onMounted, ref } from "vue"
import ExpollStorage from "@/scripts/storage"

const props = defineProps<{ language: languageData }>()

const markdown = ref("")

onMounted(async () => {
    const filename = "/en_privacy.md"
  markdown.value = await (await fetch(ExpollStorage.backendUrl + filename)).text()
})
</script>

<style scoped>
.text {
    text-align: left;
}
</style>
