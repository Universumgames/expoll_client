<script lang="ts" setup>
import '../../styles/nav.scss'
import UserIcon from "@/assetComponents/UserIcon.vue"
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { routes } from '@/router/navbar'
import type { IUser } from '@/types/bases'
import { DisplaySize, isMobile } from '@/scripts/displayHelper'
import type { languageData } from '@/scripts/languageConstruct'
import { jumpToNavID } from '@/scripts/jumpElementIDs.ts'

const props = defineProps<{
  userData?: IUser,
  displaySize: DisplaySize,
  language: languageData
}>()

const routerRoute = useRoute()
</script>

<template>
  <nav class="mobile" role="menubar" id="navigation">
    <hr class="divider"/>
    <div class="evenlySpacedChildContainer" role="none">
      <template v-for="route of routes(props)" :key="route.path">
        <template v-if="route.path != undefined && route.vif != false">
          <RouterLink :to="route.path!" tabindex="0" role="link" :id="route.isJumpMark ? jumpToNavID : undefined">
            <component :is="route.icon" fill="var(--text-color)" height="1rem" role="img"/>
            <p>{{ route.name }}</p>
          </RouterLink>
        </template>
        <template v-if="route.url != undefined && route.vif != false">
          <a :href="route.url!" tabindex="0" role="link" :id="route.isJumpMark ? jumpToNavID : undefined">
            <component :is="route.icon" :fill="'var(--text-color)'" height="1rem" role="img"/>
            <p>{{ route.name }}</p>
          </a>
        </template>
      </template>
    </div>
  </nav>
</template>