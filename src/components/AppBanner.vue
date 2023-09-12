<template>
    <div class="bannerContainer appBanner">
        {{ language?.uiElements.appBanner }}
    </div>
</template>

<script setup lang="ts">

import { languageData } from "@/scripts/languageConstruct"

const props = defineProps<{ language: languageData }>()

</script>

<style scoped>
.appBanner {
    background-color: var(--primary-color);
}
</style>