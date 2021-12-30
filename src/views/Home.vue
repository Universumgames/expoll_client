<template>
    <vue-markdown :source="this.markdown" />
</template>

<script lang="ts">
    import axios from "axios"
    import { Options, Vue } from "vue-class-component"
    import VueMarkdown from "vue-markdown-render"

    @Options({
        components: {
            VueMarkdown
        }
    })
    export default class Home extends Vue {
        markdown: string = ""

        mounted() {
            this.loadMarkdown()
        }

        async loadMarkdown() {
            this.markdown = (await axios.get("/startpage.md")).data
        }
    }
</script>
