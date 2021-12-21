<template>
    <span id="userico" :title="this.loggedIn ? 'Logged in as ' + userData.username : 'Not Logged in'">
        <router-link to="/login">
            <div v-show="this.loggedIn">
                <img src="../assets/logo.png" alt="" />
            </div>
            <div v-show="!this.loggedIn">Login</div>
        </router-link>
    </span>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { IUser } from "../scripts/interfaces"

    @Options({
        props: {
            userData: Object
        }
    })
    export default class UserIcon extends Vue {
        userData: IUser | undefined

        get loggedIn() {
            return this.userData != undefined
        }
    }
</script>

<style scoped>
    img {
        clip-path: circle(3rem at center);
        width: 3rem;
        height: 3rem;
    }

    #userico {
        position: absolute;
        top: 0;
        right: 0;
        margin: 1ch;
    }
</style>
