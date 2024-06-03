<template>
    <span
        id="userico" :title="title"
        :style="loggedIn? '' : 'float: right;'"
    >
        <user-icon fill="var(--text-color)" height="1em" />
        <RouterLink v-show="loggedIn" to="/account">
            <!--<img src="../assets/userIcon.svg" alt="" loading="lazy">-->
            {{ language.uiElements.login.loggedInText }}
        </RouterLink>
        <RouterLink v-show="!loggedIn" to="/login">
            {{ language?.uiElements.login.loginLink }}
        </RouterLink>
    </span>
</template>

<script setup lang="ts">
import type { languageData } from "@/scripts/languageConstruct"
import { computed } from "vue"
import UserIcon from "@/assetComponents/UserIcon.vue"
import { DisplaySize } from "@/scripts/displayHelper"
import type { IUser } from "@/types/bases"

const props = defineProps<{ userData?: IUser, language: languageData, displaySize: DisplaySize }>()

const loggedIn = computed(() => props.userData != undefined)

const title = computed(() => {
    if (loggedIn.value)
        return props.language?.uiElements.login.loggedInAs(props.userData?.username ?? "")
    else
        return props.language?.uiElements.login.notLoggedIn

})
</script>

<style scoped>
img {
    width: 3rem;
    height: 3rem;
}

#userico {

}

#loginText {

}

a {
    margin: 0 !important;
}
</style>
