<template>
    <div class="color-select">
        <p class="changeColor" :class="showSelect ? 'changeColorShow' : ''" @click="showSelect = !showSelect">
            {{ language?.uiElements.navigation.changeColorSchemeButton }}
        </p>
        <div v-show="showSelect" class="select-field">
            <p class="color" @click="changeColor(null)">
                Auto
            </p>
            <p class="color" @click="changeColor(false)">
                Light
            </p>
            <p class="color" @click="changeColor(true)">
                Dark
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">

import { languageData } from "@/scripts/languageConstruct"
import { ref } from "vue"
import ExpollStorage from "@/scripts/storage"

const props = defineProps<{ language: languageData }>()
const emit = defineEmits(["colorChange"])

const showSelect = ref(false)

const changeColor = (isDark: boolean | null) => {
    showSelect.value = false
    ExpollStorage.darkMode = isDark
    emit("colorChange", isDark)
}
</script>

<style scoped>
.color-select {
    display: flex;
    flex-flow: column;
}

.color {
    cursor: pointer;
    margin: 0;
    padding: 0.2rem;
}

.color:hover {
    background-color: var(--primary-color);
}

.changeColor {
    cursor: pointer;
    border-radius: 1rem;
    padding: 0.8rem;
    margin: 0;
}

.changeColorShow {
    background-color: var(--bg-color);
    border-radius: 1rem 1rem 0 0;
}

.changeColor:hover {
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