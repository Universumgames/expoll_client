<template>
    <div class="lang-select">
        <p @click="showSelect = !showSelect" class="changeLang" :class="showSelect ? 'changeLangShow' : ''">
            {{ this.language?.uiElements.navigation.changeLanguageButton }}
        </p>
        <div v-show="showSelect" class="selec-field">
            <p class="lang" v-for="lang in availableLangs" :key="lang.short" @click="changeLang(lang.short)">
                {{ lang.name[0] }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { languageData, languageList } from "../scripts/languageConstruct"

    @Options({
        props: {
            language: Object
        }
    })
    export default class LanguageSelect extends Vue {
        showSelect = false
        language?: languageData

        mounted() {}

        get availableLangs() {
            return languageList
        }

        changeLang(short: string) {
            this.$emit("langChange", short)
            this.showSelect = false
        }
    }
</script>

<style scoped>
    .lang-select {
        display: flex;
        flex-flow: column;
    }

    .lang {
        cursor: pointer;
        margin: 0;
        padding: 0.2rem;
    }

    .lang:hover {
        background-color: var(--primary-color);
    }

    .changeLang {
        cursor: pointer;
        border-radius: 1rem;
        padding: 0.8rem;
        margin: 0;
    }

    .changeLangShow {
        background-color: var(--bg-color);
        border-radius: 1rem 1rem 0 0;
    }

    .changeLang:hover {
        background-color: var(--primary-color);
    }

    .selec-field {
        display: flex;
        flex-flow: column;
        gap: 0.5rem;
        background-color: var(--bg-color);
        border-radius: 0 0 1rem 1rem;
        padding-bottom: 0.8em;
        padding-top: 0.3rem;
    }
</style>
