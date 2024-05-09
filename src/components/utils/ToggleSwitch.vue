<template>
    <input
        type="checkbox"
        :checked="modelValue"
        @change="(event)=>{emit('update:modelValue', event.target?.checked)}"
    >
</template>

<script setup lang="ts">

import { computed } from "vue"

const props = withDefaults(defineProps<{ modelValue: boolean, colorOn: string, colorOff: string, scale: number }>(), {
    modelValue: false,
    colorOn: "var(--primary-color)",
    colorOff: "#c6c6c6",
    scale: 2
})

const emit = defineEmits(["update:modelValue"])

const widthToggle = computed(() => {
    return props.scale * 2 + "rem"
})

const sizeToggleCircle = computed(() => {
    return props.scale + "rem"
})
</script>

<style scoped>
input[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: v-bind(widthToggle);
    height: v-bind(sizeToggleCircle);
    border-radius: 2rem;
    background: v-bind(colorOff);
    outline: none;
    transition: 0.25s;
    position: relative;
    cursor: pointer;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    transform: translateY(50%);
    margin-top: -2ch;
}

input[type="checkbox"]:before {
    content: "";
    position: absolute;
    width: v-bind(sizeToggleCircle);
    height: v-bind(sizeToggleCircle);
    border-radius: 50%;
    top: 0;
    left: 0;
    background: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: 0.25s;
}

input[type="checkbox"]:checked:before {
    left: v-bind(sizeToggleCircle);
}

input[type="checkbox"]:checked {
    background: v-bind(colorOn);
}
</style>