<template>
    <header>
        <div v-show="displaySize >= DisplaySize.S" id="largeNav">
            <a :href="userData != undefined ? '/#/polls' : '/'" style="float: left">Expoll</a>

            <router-link v-show="userData != undefined" to="/polls">
                {{
                    language?.uiElements.navigation.polls
                }}
            </router-link>
            <router-link to="/">
                {{ language?.uiElements.navigation.home }}
            </router-link>
            <!-- <router-link to="/about">About</router-link> -->
            <router-link v-if="userData?.admin" to="/admin">
                Admin
            </router-link>
            <a href="https://apps.apple.com/app/expoll/id1639799209">iOS App</a>

            <user-icon :language="language" :user-data="userData" />
        </div>
        <div v-show="displaySize < DisplaySize.S" id="mediumNav">
            <div style="float: left; margin: auto; position: absolute" @click="menuOpen = !menuOpen">
                <bars-icon :fill="menuOpen? 'var(--primary-color)':'white'" width="2rem" height="2rem" />
            </div>

            <div class="evenlySpacedChildsContainer">
                <p class="navigationTitle">
                    {{ title }}
                </p>
                <user-icon v-show="userData == undefined" :language="language" :user-data="userData" />
            </div>

            <div v-if="menuOpen" class="list">
                <router-link v-show="userData != undefined" to="/polls">
                    {{
                        language?.uiElements.navigation.polls
                    }}
                </router-link>
                <router-link to="/">
                    {{ language?.uiElements.navigation.home }}
                </router-link>
                <!-- <router-link to="/about">About</router-link> -->
                <router-link v-if="userData?.admin" to="/admin">
                    Admin
                </router-link>
                <a href="https://apps.apple.com/app/expoll/id1639799209">iOS App</a>

                <user-icon :language="language" :user-data="userData" />
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">

import UserIcon from "@/components/UserIcon.vue"
import { languageData } from "@/scripts/languageConstruct"
import { IUser } from "@/lib/interfaces"
import { ref } from "vue"
import * as displayHelper from "@/scripts/displayHelper"
import { DisplaySize } from "@/scripts/displayHelper"
import BarsIcon from "@/assetComponents/BarsIcon.vue"
import { useRouter } from "vue-router"

const props = defineProps<{
    userData?: IUser,
    language: languageData
}>()

const displaySize = ref(DisplaySize.XXL)
const menuOpen = ref(false)
const title = ref("Expoll")
const router = useRouter()

displaySize.value = displayHelper.getDisplaySize()


addEventListener("resize", (event) => {
    displaySize.value = displayHelper.getDisplaySize()
})

router.afterEach((to, from, failure) => {
    title.value = to.meta.title as string ?? "Expoll"
    menuOpen.value = false
})

</script>

<style>
header {
  background: var(--secondary-color);
  border-radius: 1ch;
  margin-bottom: 2rem;
  position: sticky;
  top: 0;
  z-index: 9999;
}

#largeNav {
  padding: 3ch;
}

#largeNav > a {
  margin: 1ch;
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
  font-size: 1.5rem; display: inline-block; font-weight: bold; margin: 0
}
</style>