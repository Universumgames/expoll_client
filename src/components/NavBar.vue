<template>
    <header>
        <div v-show="!isMobile(displaySize)" id="largeNav">
            <a :href="userData != undefined ? '/#/polls' : '/'" style="flex: 0">Expoll</a>

            <div id="mainNav">
                <template v-for="route of routes" :key="route.path">
                    <template v-if="route.path != undefined && route.vif != false">
                        <RouterLink :to="route.path!">
                            {{ route.name }}
                        </RouterLink>
                    </template>
                    <template v-if="route.url != undefined && route.vif != false">
                        <a :href="route.url!">
                            {{ route.name }}
                        </a>
                    </template>
                </template>

                <user-icon :language="language" :user-data="userData" :display-size="displaySize" />
            </div>
        </div>
        <div v-show="isMobile(displaySize)" id="mediumNav">
            <div style="float: left; margin: auto; position: absolute" @click="menuOpen = !menuOpen">
                <bars-icon :fill="menuOpen? 'var(--primary-color)':'white'" width="2rem" height="2rem" />
            </div>

            <div class="evenlySpacedChildContainer">
                <p class="navigationTitle">
                    {{ title }}
                </p> 
                <user-icon
                    v-show="userData == undefined"
                    :language="language"
                    :user-data="userData"
                    :display-size="displaySize"
                />
            </div>

            <div v-if="menuOpen" class="list">
                <template v-for="route of routes" :key="route.path">
                    <template v-if="route.path != undefined && route.vif != false">
                        <RouterLink :to="route.path!">
                            <component :is="route.icon" height="1em" fill="var(--text-color)" />
                            {{ route.name }}
                        </RouterLink>
                    </template>
                    <template v-if="route.url != undefined && route.vif != false">
                        <a :href="route.url!">
                            <component :is="route.icon" height="1em" fill="var(--text-color)" />
                            {{ route.name }}
                        </a>
                    </template>
                </template>
                <user-icon :language="language" :user-data="userData" :display-size="displaySize" />
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">

import UserIcon from "@/components/AccountLink.vue"
import type { languageData } from "@/scripts/languageConstruct"
import { computed, type ComputedRef, ref } from "vue"
import { DisplaySize, isMobile } from "@/scripts/displayHelper"
import BarsIcon from "@/assetComponents/BarsIcon.vue"
import { useRouter } from "vue-router"
import ExpollStorage from "@/scripts/storage"
import ListIcon from "@/assetComponents/ListIcon.vue"
import HouseIcon from "@/assetComponents/HouseIcon.vue"
import AppStoreIcon from "@/assetComponents/AppStoreIcon.vue"
import AdminIcon from "@/assetComponents/AdminIcon.vue"
import type { IUser } from "@/types/bases"
import { RouterLink } from 'vue-router'

const props = defineProps<{
    userData?: IUser,
    displaySize: DisplaySize,
    language: languageData
}>()

const menuOpen = ref(false)
const title = ref("Expoll")
const router = useRouter()

interface Route {
    name: string
    path?: string
    url?: string
    vif?: boolean
    icon?: unknown
}

const routes: ComputedRef<Route[]> = computed(()=>{
    return [
        {
            name: props.language?.uiElements.navigation.polls,
            path: "/polls",
            vif: props.userData != undefined,
            icon: ListIcon
        },
        {
            name: props.language?.uiElements.navigation.home,
            path: "/",
            icon: HouseIcon
        },
        {
            name: "Admin",
            path: "/admin",
            vif: props.userData?.admin ?? false,
            icon: AdminIcon
        },
        {
            name: "iOS App",
            url: "https://apps.apple.com/app/expoll/id1639799209",
            vif: !ExpollStorage.runsAsPWA() && ExpollStorage.showIOSAppBanner,
            icon: AppStoreIcon
        }
    ]
})


// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
router.afterEach((to, from, failure) => {
    title.value = to.meta.title as string ?? "Expoll"
    menuOpen.value = false
})

</script>

<style>
header {
  background: var(--secondary-color);
  border-radius: var(--default-border-radius);
  margin-bottom: 2rem;
  position: sticky;
  top: 0;
  z-index: 9999;
}

#largeNav {
  padding: 3ch;
  display: flex;
  justify-content: center;
  align-items: center;
}

#largeNav > * {
  flex: 1;
}

#largeNav a {
  margin-right: 1ch;
  text-align: center;
}

#mediumNav {
  padding: 2ch;
}

#mediumNav > .list {
  margin-top: 2ch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1ch;
}

#mediumNav > .list > * {
  margin: 0;
  padding: 1ch;
}

#mediumNav .navigationTitle {
  font-size: 1.5rem;
  display: inline-block;
  margin: 0;
}
</style>