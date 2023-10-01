<template>
    <div class="lang-select">
        <p class="changeLang" :class="showSelect ? 'changeLangShow' : ''" @click="showSelect = !showSelect">
            {{ language?.uiElements.navigation.changeLanguageButton }}
        </p>
        <div v-show="showSelect" class="select-field">
            <p v-for="lang in languageList" :key="lang.short" class="lang" @click="changeLang(lang.short)">
                {{ lang.name[0] }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { languageData } from "@/scripts/languageConstruct"
import { ref } from "vue"
import { languageList } from "@/scripts/languages/languageConfig"

const props = defineProps<{ language: languageData }>()
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

.select-field {
    display: flex;
    flex-flow: column;
    gap: 0.5rem;
    background-color: var(--bg-color);
    border-radius: 0 0 1rem 1rem;
    padding-bottom: 0.8em;
    padding-top: 0.3rem;
}
</style>
