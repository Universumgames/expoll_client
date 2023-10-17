<template>
    <div class="popupContainer">
        <div class="popupContent">
            <div class="popupHeader">
                <slot name="header">
                    <button @click="emit('close')">
                        Cancel
                    </button>
                </slot>
            </div>
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">

import { onMounted, onUnmounted } from "vue"

withDefaults(defineProps<{ padding: string, cornerRadius: string, backdropColor: string, backgroundColor: string }>(), {
    padding: "3rem",
    cornerRadius: "2ch",
    backdropColor: "rgba(50, 50, 50, 0.7)",
    backgroundColor: "var(--bg-color)"
})

const emit = defineEmits(["close"])

onMounted(() => {
    document.body.style.overflow = "hidden"
})

onUnmounted(() => {
    document.body.style.overflow = "auto"
})

</script>

<style scoped>
.popupContainer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: v-bind(backdropColor);
    z-index: 99999;
}

.popupContent {
    width: min(max(80vw, 50ch), 95vw);
    height: 90vh;
    margin: auto;
    position: relative;
    overflow: auto;
    top: 1vh;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    border-radius: v-bind(cornerRadius);
    background-color: v-bind(backgroundColor);
    padding: v-bind(padding);
}

.popupContent::-webkit-scrollbar {
    display: none;
}

.popupHeader {
    position: sticky;
    top: -2ch;
    background-color: v-bind(backgroundColor);
    z-index: 5000;
}
</style>