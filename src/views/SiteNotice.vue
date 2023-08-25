<template>
    <vue-markdown :source="markdown" class="text" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import VueMarkdown from "vue-markdown-render"
import axios from "axios"

@Options({
    components: {
        VueMarkdown
    },
    props: {
        language: Object
    }
})
export default class SiteNotice extends Vue {
    markdown = ""

    async created(): Promise<void> {
        this.loadMarkdown()
    }

    async loadMarkdown(): Promise<void> {
        const filename = "/en_site_notice.md"
        this.markdown = (await axios.get(filename)).data
    }
}
</script>

<style scoped>
.text {
    text-align: left;
}
</style>
