<template>
  <nav class="desktop">
    <div v-show="!isSmall(displaySize)" id="largeNav">
      <a :href="userData != undefined ? '/#/polls' : '/'" style="flex: 0" tabindex="0" role="link" aria-label="Homepage">Expoll</a>
      <AccessibleJumpTo />

      <div id="mainNav" role="menubar">
        <template v-for="route of routes(props)" :key="route.path">
          <template v-if="route.path != undefined && route.vif != false">
            <RouterLink :to="route.path!" tabindex="0" role="link" :id="route.isJumpMark ? jumpToNavID : undefined">
              {{ route.name }}
            </RouterLink>
          </template>
          <template v-if="route.url != undefined && route.vif != false">
            <a :href="route.url!" tabindex="0" role="link" :id="route.isJumpMark ? jumpToNavID : undefined">
              {{ route.name }}
            </a>
          </template>
        </template>
      </div>
    </div>
    <div v-show="isSmall(displaySize)" id="mediumNav">
      <div style="float: left; margin: auto; position: absolute" @click="menuOpen = !menuOpen">
        <bars-icon :fill="menuOpen? 'var(--primary-color)':'white'" height="2rem" width="2rem" />
      </div>

      <div class="evenlySpacedChildContainer">
        <p class="navigationTitle">
          {{ title }}
        </p>
        <RouterLink :to="'/login'"  v-if="userData == undefined" role="link">
          <user-icon fill="var(--text-color)" height="1.5em" role="img"/>
          <p style="margin: 0">{{ userData != undefined ? language.uiElements.login.loggedInText : language?.uiElements.login.loginLink }}</p>
        </RouterLink>
      </div>

      <div v-if="menuOpen" class="list">
        <template v-for="route of routes(props)" :key="route.path">
          <template v-if="route.path != undefined && route.vif != false">
            <RouterLink :to="route.path!">
              <component :is="route.icon" fill="var(--text-color)" height="1em" />
              {{ route.name }}
            </RouterLink>
          </template>
          <template v-if="route.url != undefined && route.vif != false">
            <a :href="route.url!">
              <component :is="route.icon" fill="var(--text-color)" height="1em" />
              {{ route.name }}
            </a>
          </template>
        </template>
      </div>
    </div>
  </nav>

</template>

<script lang="ts" setup>
import '../../styles/nav.scss'
import AccountLink from '@/components/AccountLink.vue'
import type { languageData } from '@/scripts/languageConstruct'
import { ref } from 'vue'
import { DisplaySize, isSmall } from '@/scripts/displayHelper'
import BarsIcon from '@/assetComponents/BarsIcon.vue'
import { RouterLink, useRouter } from 'vue-router'
import type { IUser } from '@/types/bases'
import { routes } from '@/router/navbar'
import UserIcon from '@/assetComponents/UserIcon.vue'
import AccessibleJumpTo from '@/components/nav/AccessibleJumpTo.vue'
import { jumpToNavID } from '@/scripts/jumpElementIDs.ts'

const props = defineProps<{
  userData?: IUser,
  displaySize: DisplaySize,
  language: languageData
}>()

const menuOpen = ref(false)
const title = ref('Expoll')
const router = useRouter()

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
router.afterEach((to, from, failure) => {
  title.value = to.meta.title as string ?? 'Expoll'
  menuOpen.value = false
})

</script>

<style>

</style>