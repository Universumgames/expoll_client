<template>
    <vue-markdown class="text" :source="markdown" />
</template>

<script setup lang="ts">
import VueMarkdown from "vue-markdown-render"
import axios from "axios"
import { languageData } from "@/scripts/languageConstruct"
import { onMounted, ref } from "vue"

const props = defineProps<{ language: languageData }>()

const markdown = ref("")

onMounted(async () => {
    const filename = "/en_privacy.md"
    markdown.value = (await axios.get(filename)).data
})
</script>

<style scoped>
.text {
    text-align: left;
}
</style>
