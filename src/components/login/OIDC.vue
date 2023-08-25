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
import axios from "axios"
import { onMounted, Ref, ref } from "vue"

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
    providers.value = await axios.get("/api/auth/oidc/providers").then(res => res.data)
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