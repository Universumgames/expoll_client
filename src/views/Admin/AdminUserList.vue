<template>
    <loading-screen v-if="this.loading" />
    <user-row v-for="user in this.users" :key="user.id" :userInfo="user" :language="this.language" />
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { IUser } from "../../scripts/interfaces"
    import { UserInfo } from "../../scripts/adminInterfaces"
    import { languageData } from "../../scripts/languageConstruct"
    import UserRow from "./UserRow.vue"
    import axios from "axios"
    import LoadingScreen from "../../components/LoadingScreen.vue"

    @Options({
        props: {
            userData: Object,
            language: Object
        },
        components: {
            UserRow,
            LoadingScreen
        }
    })
    export default class AdminUserList extends Vue {
        userData: IUser | undefined
        language?: languageData

        users?: UserInfo[]

        loading = true

        async mounted() {
            this.users = (await axios.get("/api/admin/users", { withCredentials: true })).data.users

            this.$forceUpdate()
            this.loading = false
        }
    }
</script>
