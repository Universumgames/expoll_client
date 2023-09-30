<template>
    <div class="container">
        <h2>{{ language?.uiElements.login.form.oidc }}</h2>
        <div class="providers">
            <a
                v-for="provider in providers" :key="provider.key"
                class="providerLink"
                :href="'/api/auth/oidc/' + provider.key"
            >
                <img :src="provider.imageURI" style="width: 100%; color: var(--primary-color)" :alt="provider.altName">
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">

import { languageData } from "@/scripts/languageConstruct"
import { onMounted, Ref, ref } from "vue"
import ExpollStorage from "@/scripts/storage"

interface Provider {
    key: string,
    imageURI: string,
    imageSmallURI: string,
    altName: string
}

const props = withDefaults(defineProps<{
    language?: languageData
}>(), {
    language: undefined
})

const providers: Ref<Provider[]> = ref([])

onMounted(async () => {
    const response = await fetch(ExpollStorage.backendUrl + "/api/auth/oidc/providers")
    if (response.ok) {
        providers.value = await response.json()
    } else {
        console.error("Error: " + response.status + " " + response.statusText)
    }
})

</script>

<style scoped>
.container {
}

.providers {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.providerLink {
    display: block;
    width: 100%;
    margin-bottom: 1ch;
    max-width: 70vw;
    width: 50ch;
}
</style>