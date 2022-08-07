<template>
    <div class="home">
        <vue-markdown class="text" :source="language.uiElements.home" />
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
        language!: languageData

        async created() {}

        mounted() {}
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
