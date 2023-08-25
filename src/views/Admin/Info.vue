<template>
    <pre>{{ JSON.stringify(info, null, 2) }}</pre>
</template>

<script lang="ts">
import axios from "axios"
import { Vue } from "vue-class-component"

export default class InfoView extends Vue {
    info = ""

    async created() {
        this.info = (await axios.get("/api/metaInfo")).data
    }
}
</script>

<style scoped>
pre {
    text-align: left;
}
</style>
