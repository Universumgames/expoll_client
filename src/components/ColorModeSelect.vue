<template>
    <div class="color-select">
        <p class="changeColor" :class="showSelect ? 'changeColorShow' : ''" @click="showSelect = !showSelect">
            {{ language?.uiElements.navigation.changeColorSchemeButton }}
        </p>
        <div v-show="showSelect" class="select-field">
            <p class="color" @click="changeColor(undefined)">
                Auto
            </p>
            <p class="color" @click="changeColor('light')">
                Light
            </p>
            <p class="color" @click="changeColor('dark')">
                Dark
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">

import { languageData } from "@/scripts/languageConstruct"
import { ref } from "vue"
import { deleteCookie, setCookie } from "@/scripts/cookie"

const props = defineProps<{ language: languageData }>()
const emit = defineEmits(["colorChange"])

const showSelect = ref(false)

const changeColor = (short: string | undefined) => {
    showSelect.value = false
    if (short == undefined) {
        deleteCookie("colorMode")
    } else
        setCookie("colorMode", short)
    emit("colorChange", short)
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