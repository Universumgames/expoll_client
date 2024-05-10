<template>
    <div class="home">
        <VueMarkdown class="text" :source="language.uiElements.home" />
    </div>
</template>

<script setup lang="ts">
import VueMarkdown from "vue-markdown-render"
import type { languageData } from "@/scripts/languageConstruct"

defineProps<{ language: languageData }>()

</script>

<style scoped>
.home {
    display: flex;
    justify-content: center;
}

.text {
    max-width: 80ch;
    text-align: justify;
}
</style>
