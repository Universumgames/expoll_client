<template>
    <span
        id="userico" :title="
            loggedIn
                ? language?.uiElements.login.loggedInAs(userData?.username ?? '')
                : language?.uiElements.login.notLoggedIn
        "
    >
        <router-link to="/login">
            <div v-show="loggedIn" id="userIcoImg">
                <img src="../assets/userIcon.svg" alt="" loading="lazy">
            </div>
            <div v-show="!loggedIn" id="loginText">{{ language?.uiElements.login.loginLink }}</div>
        </router-link>
    </span>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { IUser } from "expoll-lib/interfaces"
import { languageData } from "../scripts/languageConstruct"

@Options({
    props: {
        userData: Object,
        language: Object
    }
})
export default class UserIcon extends Vue {
    userData: IUser | undefined
    language?: languageData

    created() {
        // this.language = getSystemLanguage()
    }

    mounted() {
    }

    get loggedIn() {
        return this.userData != undefined
    }
}
</script>

<style scoped>
img {
    width: 3rem;
    height: 3rem;
}

#userico {
    float: right;
}

#userIcoImg {
    /* background: var(--secondary-color); */
    clip-path: circle(1.5rem at center);
    transform: translateY(-25%);
}

#loginText {
}

a {
    margin: 0 !important;
}
</style>
