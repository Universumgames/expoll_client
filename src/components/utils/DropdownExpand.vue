<script setup lang="ts">
import { ref } from 'vue'
import CaretDownIcon from '@/assetComponents/CaretDownIcon.vue'

const emits = defineEmits<{
  (e: 'toggle', open: boolean): void
}>()

const props = defineProps<{
  initiallyOpen?: boolean
  id?: string
}>()

const open = ref(false)

const toggleEventEmit = () => {
  open.value = !open.value
  // Emit the toggle event with the new state
  emits('toggle', open.value)
}
</script>

<template>
  <div :aria-expanded="open" :id="props.id">
    <div @click="toggleEventEmit" class="summaryContainer">
      <slot name="summary" />
      <CaretDownIcon :rotated="open" height="1rem" :fill="'var(--text-color)'"/>
    </div>

    <div v-if="open" class="detailsContainer">
      <slot name="details" />
    </div>
  </div>
</template>

<style scoped>
.summaryContainer {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 1ch;
  margin-right: 1ch;
}

.detailsContainer {
}
</style>
