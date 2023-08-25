<template>
    <pre>{{ JSON.stringify(info, null, 2) }}</pre>
</template>

<script setup lang="ts">
import axios from "axios"
import { onMounted, ref } from "vue"

const info = ref("")

onMounted(async () => {
    info.value = (await axios.get("/api/metaInfo")).data
})
</script>

<style scoped>
pre {
    text-align: left;
}
</style>
