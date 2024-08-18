<script setup lang="ts">
import { ref, watch } from 'vue'

const model = defineModel<Number>()

const props = defineProps<{
    id: string,
    disabled: boolean,
    dateType: string,
}>()

const timestampToDateString = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toISOString()
}

const storedValue = ref(timestampToDateString(model.value))

watch(storedValue, (newValue, oldValue) => {
  console.log(newValue)
  const parsed = Date.parse(newValue)
  model.value = parsed
  console.log(parsed)
})

</script>

<template>
  <input :id="id" v-model="storedValue" :disabled="disabled" :type="dateType">
</template>

<style scoped>

</style>