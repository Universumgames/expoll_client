<template>
    <div>
        <p @click="showSelect = !showSelect" class="changeLang">
            {{ this.language?.uiElements.navigation.changeLanguageButton }}
        </p>
        <div v-show="showSelect" style="background-color: var(--bg-color); border-radius: 1ch">
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
    .lang {
        cursor: pointer;
        border-radius: 1ch;
        margin: 0.5ch;
    }

    .lang:hover {
        background-color: var(--primary-color);
    }

    .changeLang {
        cursor: pointer;
        border-radius: 1ch;
        padding: 1ch;
    }

    .changeLang:hover {
        background-color: var(--primary-color);
    }
</style>
