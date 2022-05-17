<template>
    <div class="home">
        <vue-markdown class="text" :source="markdown" />
    </div>
</template>

<script lang="ts">
    import axios from "axios"
    import { Options, Vue } from "vue-class-component"
    import VueMarkdown from "vue-markdown-render"
    import { languageData } from "../scripts/languageConstruct"

    @Options({
        components: {
            VueMarkdown
        },
        props: {
            language: Object
        }
    })
    export default class Home extends Vue {
        markdown: string = ""
        language!: languageData

        async created() {
            this.loadMarkdown()
        }

        mounted() {}

        async loadMarkdown() {
            const filename = "/" + this.language.short.toLowerCase() + "_startpage.md"
            this.markdown = (await axios.get(filename)).data
        }
    }
</script>

<style scoped>
    .home {
        display: flex;
        justify-content: center;
    }
    .text {
        max-width: 80ch;
        text-align: justify;
    }
</style>
