<template>
    <div v-if="userData?.admin">
        <div>
            <h3>Administration</h3>
            <router-link to="/admin/users">Users</router-link>
            <router-link to="/admin/polls">Polls</router-link>
            <router-link to="/admin/info">Debug Info</router-link>
        </div>
        <router-view :userData="userData" :language="language" />
    </div>
    <small v-else class="errorInfo">You are not an admin</small>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { IUser } from "expoll-lib/interfaces"
    import { languageData } from "../../scripts/languageConstruct"

    @Options({
        props: {
            userData: Object,
            language: Object
        },
        components: {}
    })
    export default class Admin extends Vue {
        userData: IUser | undefined
        language?: languageData
    }
</script>
