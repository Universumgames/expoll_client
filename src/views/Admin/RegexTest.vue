<template>
    <div class="container">
        {{ reg?.regex }}
        <small style="color: var(--primary-color)">{{ reg?.blacklist ? "Blacklist" : "Required" }}</small>
        <input v-model="reg!.blacklist" type="checkbox" @change="emit('update')">
        <button class="delete" @click="emit('remove')">
            Remove
        </button>

        <label>Test regex</label>
        <input
            v-model="test" type="text"
            :style="!matches ? 'color:green' : 'color:red'"
            style="background-color: var(--bg-color)"
            @keyup="matches = 
                (test.match(reg!.regex) && reg!.blacklist) || 
                (!test.match(reg!.regex) && !reg!.blacklist)"
        >
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { MailRegexEntry } from '@/types/other'

defineProps<{ reg?: MailRegexEntry }>()
const emit = defineEmits(["remove", "update"])

const test = ref("")

const matches = ref(false)

</script>

<style scoped>
.container {
    background-color: var(--secondary-color);
    border-radius: var(--default-border-radius);
    margin: 0.5ch;
    padding: 0ch;
}
</style>
