<template>
    <span
        id="userico"
        :title="
            this.loggedIn
                ? this.language?.uiElements.login.loggedInAs(userData.username)
                : this.language?.uiElements.login.notLoggedIn
        "
    >
        <router-link to="/login">
            <div v-show="this.loggedIn" id="userIcoImg">
                <img src="../assets/logo.png" alt="" />
            </div>
            <div v-show="!this.loggedIn" id="loginText">{{ this.language?.uiElements.login.loginLink }}</div>
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

        mounted() {}

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
        position: absolute;
        top: 0;
        right: 0;
        margin: 1ch;

        width: 3rem;
        height: 3rem;
    }

    #userIcoImg {
        background: var(--secondary-color);
        clip-path: circle(1.5rem at center);
    }

    #loginText {
        transform: translateY(50%);
    }

    a {
        margin: 0 !important;
    }
</style>
