<template>
    <div class="lang-select" :class="showSelect ? 'changeLangShow' : ''">
        <div class="changeLang" :class="showSelect? 'radius-top':''" @click="showSelect = !showSelect" @keyup.enter="showSelect = !showSelect" role="menu" tabindex="0">
            <language-icon fill="var(--text-color)" height="1.5em" />
            <small>{{ language?.uiElements.navigation.changeLanguageButton }}</small>
        </div>
        <template v-if="showSelect">
            <p
                v-for="(lang, index) in languageList" v-show="showSelect"
                :key="lang.short" class="lang"
                :class="index == (languageList.length - 1)? 'radius-bottom' : ''"
                @click="changeLang(lang.short)"
                @keyup.enter="changeLang(lang.short)"
                tabindex="0"
                role="menuitem"
            >
                {{ lang.name[0] }}
            </p>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { languageData } from "@/scripts/languageConstruct"
import { ref } from "vue"
import { languageList } from "@/scripts/languages/languageConfig"
import LanguageIcon from "@/assetComponents/LanguageIcon.vue"

defineProps<{ language: languageData | undefined }>()
const emit = defineEmits(["langChange"])

const showSelect = ref(false)

const changeLang = (short: string) => {
    emit("langChange", short)
    showSelect.value = false
}
</script>

<style scoped>
.lang-select {
    display: flex;
    flex-flow: column;

}

.lang-select > *:hover{
  background-color: var(--primary-color);
}

.lang {
    cursor: pointer;
    margin: 0;
    padding: 0.4rem;
}

.lang:hover {

}

.changeLang {
    cursor: pointer;
    border-radius: var(--aggressive-border-radius);
    margin: 0;
    display: flex;
    flex-flow: row;
    align-items: center;
    width: max-content;
    color: var(--text-color);
}

.changeLang small {
    flex: 1;
    color: var(--text-color);
}

.changeLangShow {
    background-color: var(--bg-color);
    border-radius: var(--aggressive-border-radius);
}

.changeLang:hover {
    background-color: var(--primary-color);
}

.select-field {
    display: flex;
    flex-flow: column;
    gap: 0.5rem;
    background-color: var(--bg-color);
    border-radius: 0 0 1rem 1rem;
    padding: 0.3rem 0.8em 0.8em;
    margin: 0;
}
</style>
