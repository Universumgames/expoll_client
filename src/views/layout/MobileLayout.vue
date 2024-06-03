<script lang="ts" setup>
import ViewContainer from '@/views/layout/ViewContainer.vue'
import type { IUser } from '@/types/bases'
import { DisplaySize } from '@/scripts/displayHelper'
import type { languageData } from '@/scripts/languageConstruct'
import MobileNav from '@/components/nav/MobileNav.vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  userData?: IUser,
  displaySize: DisplaySize,
  language: languageData
}>()

const route = useRoute()

</script>

<template>
  <ViewContainer>
    <template #top>
      <h1 class="mobileHeader">{{ route.meta.title }}</h1>
    </template>
    <template #content>
      <slot/>
      <div style="height: 5rem; content: ''"/>
    </template>
    <template #bottom>
      <MobileNav :language="language" :userData="userData" :displaySize="displaySize"/>
    </template>
  </ViewContainer>
</template>

<style scoped>
.mobileHeader{
  background: var(--secondary-color);
  border-radius: var(--default-border-radius);
  margin-bottom: 2rem;
  position: sticky;
  top: 0;
  z-index: 9999;
  padding: 0.5ch;
}
</style>