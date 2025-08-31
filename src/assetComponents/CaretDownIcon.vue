<script lang="ts" setup>
/* eslint-disable max-len */

defineProps<{
  fill?: string
  width?: string
  height?: string
  rotated?: boolean
}>()
</script>

<template>
  <svg
    :fill="fill"
    viewBox="0 0 384 512"
    xmlns="http://www.w3.org/2000/svg"
    style="display: inline-block"
    :style="'height: ' + height + '; width: ' + width + ';'"
    :class="rotated ? 'rotated' : 'normal'"
  >
    <!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
    <path
      d="M352 160c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-9.2-9.2-11.9-22.9-6.9-34.9S19.1 160 32 160l320 0z"
    />
  </svg>
</template>

<style scoped>
.normal {
  transform: rotate(-90deg);
}

.rotated {
  transform: rotate(0deg);
}
</style>
