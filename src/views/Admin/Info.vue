<template>
    <pre>{{ JSON.stringify(info, null, 2) }}</pre>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import ExpollStorage from "@/scripts/storage"
import { apiFetch } from "@/scripts/apiRequests"

const info = ref("")

onMounted(async () => {
    const response = await apiFetch({
        uri: "/metaInfo"
    })
    if (!response.ok) {
        console.error("Error: " + response.status + " " + response.statusText)
        return
    }
    info.value = await response.json()
})
</script>

<style scoped>
pre {
    text-align: left;
}
</style>
