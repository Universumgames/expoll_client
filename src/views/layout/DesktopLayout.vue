<script lang="ts" setup>
import ViewContainer from '@/views/layout/ViewContainer.vue'
import type { IUser } from '@/types/bases'
import { DisplaySize } from '@/scripts/displayHelper'
import type { languageData } from '@/scripts/languageConstruct'
import NavBar from '@/components/nav/NavBar.vue'

const props = defineProps<{
  userData?: IUser,
  displaySize: DisplaySize,
  language: languageData
}>()

</script>

<template>
  <ViewContainer>
    <template #top>
      <NavBar :language="language" :userData="userData" :displaySize="displaySize"/>
    </template>
    <template #content>
      <slot/>
    </template>
  </ViewContainer>
</template>

<style scoped>

</style>