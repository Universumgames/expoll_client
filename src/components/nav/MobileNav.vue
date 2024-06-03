<script lang="ts" setup>
import '../../styles/nav.scss'
import UserIcon from "@/assetComponents/UserIcon.vue"
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { routes } from '@/router/navbar'
import type { IUser } from '@/types/bases'
import { DisplaySize, isMobile } from '@/scripts/displayHelper'
import type { languageData } from '@/scripts/languageConstruct'

const props = defineProps<{
  userData?: IUser,
  displaySize: DisplaySize,
  language: languageData
}>()

const routerRoute = useRoute()
</script>

<template>
  <nav class="mobile">
    <hr class="divider"/>
    <div class="evenlySpacedChildContainer">
      <template v-for="route of routes(props)" :key="route.path">
        <template v-if="route.path != undefined && route.vif != false">
          <RouterLink :to="route.path!">
            <component :is="route.icon" fill="var(--text-color)" height="1.5em" />
            <p>{{ route.name }}</p>
          </RouterLink>
        </template>
        <template v-if="route.url != undefined && route.vif != false">
          <a :href="route.url!">
            <component :is="route.icon" :fill="'var(--text-color)'" height="1.5em" />
            <p>{{ route.name }}</p>
          </a>
        </template>
      </template>
    </div>
  </nav>
</template>