<template>
    <span
        id="userico" :title="title"
        :style="loggedIn? '' : 'float: right;'"
    >
        <router-link v-show="loggedIn" to="/account">
            <div id="userText">
                <!--<img src="../assets/userIcon.svg" alt="" loading="lazy">-->
                {{ language.uiElements.login.loggedInText }}
            </div>
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

const props = defineProps<{ userData?: IUser, language: languageData }>()

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
