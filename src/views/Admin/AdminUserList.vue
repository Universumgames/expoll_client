<template>
    <loading-screen v-if="this.loading" />
    <div v-if="!this.loading">
        <label>User count: {{ this.count }}</label>
    </div>

    <user-row
        v-for="user in this.users"
        :key="user.id"
        :userInfo="user"
        :language="this.language"
        @update="getData"
        :admin="userData"
    />
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { IUser } from "expoll-lib/interfaces"
    import { UserInfo } from "expoll-lib/adminInterfaces"
    import { languageData } from "../../scripts/languageConstruct"
    import UserRow from "./UserRow.vue"
    import axios from "axios"
    import LoadingScreen from "../../components/LoadingScreen.vue"
    import { AdminUserListResponse } from "expoll-lib/requestInterfaces"

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
        count = 0

        loading = true

        async mounted() {
            this.getData()
        }

        async getData() {
            const data = (await axios.get("/api/admin/users", { withCredentials: true })).data as AdminUserListResponse
            this.users = data.users
            this.count = data.totalCount

            this.$forceUpdate()
            this.loading = false
        }
    }
</script>
