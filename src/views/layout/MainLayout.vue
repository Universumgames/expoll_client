<script setup lang="ts">
import type { IUser } from '@/types/bases'
import { DisplaySize, isMobile } from '@/scripts/displayHelper'
import type { languageData } from '@/scripts/languageConstruct'
import DesktopLayout from '@/views/layout/DesktopLayout.vue'
import MobileLayout from '@/views/layout/MobileLayout.vue'

const props = defineProps<{
  userData?: IUser,
  displaySize: DisplaySize,
  language: languageData
}>()
</script>

<template>
  <DesktopLayout :language="language" :display-size="displaySize" :userData="userData" v-if="!isMobile(displaySize)">
    <slot/>
  </DesktopLayout>
  <MobileLayout :language="language" :display-size="displaySize" :userData="userData" v-else>
    <slot/>
  </MobileLayout>
</template>

<style scoped>

</style>