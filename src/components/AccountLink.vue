<template>
    <span
        id="userico" :title="title"
        :style="loggedIn? '' : 'float: right;'"
    >
        <user-icon v-if="isMobile(displaySize)" fill="var(--text-color)" height="1em" />
        <router-link v-show="loggedIn" to="/account">
            <!--<img src="../assets/userIcon.svg" alt="" loading="lazy">-->
            {{ language.uiElements.login.loggedInText }}
        </router-link>
        <router-link v-show="!loggedIn" to="/login">
            <div id="loginText">{{ language?.uiElements.login.loginLink }}</div>
        </router-link>
    </span>
</template>

<script setup lang="ts">
import { IUser } from "@/lib/interfaces"
import { languageData } from "@/scripts/languageConstruct"
import { computed } from "vue"
import UserIcon from "@/assetComponents/UserIcon.vue"
import { DisplaySize, isMobile } from "@/scripts/displayHelper"

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
