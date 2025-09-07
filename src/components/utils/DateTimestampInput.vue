<script setup lang="ts">
import { ref, watch } from 'vue'

const model = defineModel<number>()

const props = defineProps<{
  id: string
  disabled: boolean
  dateType: string
}>()

const timestampToDateString = (timestamp: number) => {
  const date = new Date(timestamp)
  const isoString = date.toISOString()
  if (props.dateType === 'date') {
    return isoString.split('T')[0]
  }
  return isoString
}

const storedValue = ref(timestampToDateString(model.value!))

watch(storedValue, (newValue, oldValue) => {
  model.value = Date.parse(newValue)
})
</script>

<template>
  <input :id="id" v-model="storedValue" :disabled="disabled" :type="dateType" />
</template>

<style scoped></style>