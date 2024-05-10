<template>
    <banner v-if="show" class="bannerContainer appBanner">
        <a href="https://apps.apple.com/app/expoll/id1639799209">
            {{ language?.uiElements.appBanner }}
            <button
                style="position:absolute; top: 0; right: 0" 
                @click="close"
            >
                Close
            </button>
        </a>
    </banner>
</template>

<script setup lang="ts">
import Banner from "@/components/Banner.vue"

import type { languageData } from "@/scripts/languageConstruct"
import ExpollStorage from "@/scripts/storage"
import { ref } from "vue"

const props = defineProps<{ language: languageData }>()

const show = ref(true)

const close = (event: Event) => {
    event.preventDefault()
    ExpollStorage.showIOSAppBanner = false
    show.value = false
}

</script>

<style scoped>
.appBanner {
    background-color: var(--primary-color);
  position: relative;
}
</style>