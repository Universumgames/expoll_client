<template>
    <div class="color-select" :class="showSelect ? 'changeColorShow' : ''">
        <div class="changeColor" :class="showSelect? 'radius-top':''" @click="showSelect = !showSelect">
            <ColorThemeIcon fill="var(--text-color)" height="1.5em" />
            <small>{{ language?.uiElements.navigation.changeColorSchemeButton }}</small>
        </div>
        <template v-if="showSelect">
            <p class="color" @click="changeColor(null)">
                Auto
            </p>
            <p class="color" @click="changeColor(false)">
                Light
            </p>
            <p class="color radius-bottom" @click="changeColor(true)">
                Dark
            </p>
        </template>
    </div>
</template>

<script setup lang="ts">

import { languageData } from "@/scripts/languageConstruct"
import { ref } from "vue"
import ExpollStorage from "@/scripts/storage"
import ColorThemeIcon from "@/assetComponents/ColorThemeIcon.vue"

defineProps<{ language: languageData }>()
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

.color-select > *:hover{
  background-color: var(--primary-color);
}

.color {
    cursor: pointer;
    margin: 0;
    padding: 0.4rem;
}


.color:hover {

}

.changeColor {
    cursor: pointer;
    border-radius: var(--aggressive-border-radius);
    margin: 0;
    display: flex;
    flex-flow: row;
    align-items: center;
    width: max-content;
    color: var(--text-color);
}

.changeColor small{
    flex-shrink: 0;
    color: var(--text-color);
}

.changeColorShow {
    background-color: var(--bg-color);
    border-radius: var(--aggressive-border-radius);
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
    padding: 0.3rem 0.8em 0.8em;
    margin: 0;
}
</style>