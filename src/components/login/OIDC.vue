<template>
    <div class="container">
        <h2>{{ language?.uiElements.login.form.oidc }}</h2>
        <div class="providers">
            <a
                v-for="provider in providers" :key="provider.key"
                :href="'/api/auth/oidc/' + provider.key"
                class="providerLink"
                :style="'background-color: ' + provider.iconBackgroundColorHex + '; color: ' + provider.textColorHex"
            >
                <img :alt="provider.key" :src="'/api/auth/oidc/images/' + provider.iconFileName" style="width: 5ch; color: var(--primary-color)">
                <h3>{{provider.title}}</h3>
            </a>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { languageData } from "@/scripts/languageConstruct"
import { onMounted, Ref, ref } from "vue"
import ExpollStorage from "@/scripts/storage"
import { apiFetch } from "@/scripts/apiRequests"

interface Provider {
    key: string,
    imageURI: string,
    iconFileName: string,
    iconBackgroundColorHex: string,
    textColorHex: string,
    title: string
}

withDefaults(defineProps<{
    language?: languageData
}>(), {
    language: undefined
})

const providers: Ref<Provider[]> = ref([])

onMounted(async () => {
    const response = await apiFetch({
        uri:"/auth/oidc/providers"
    })
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
  border-radius: 1ch;
}

.providerLink > * {
  display: inline-block;
  vertical-align: middle;
}
</style>