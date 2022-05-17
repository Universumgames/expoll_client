<template>
    <loading-screen v-if="loading" />
    <div v-if="!loading">
        <label>User count: {{ count }}</label>
    </div>

    <user-row
        v-for="user in users"
        :key="user.id"
        :userInfo="user"
        :language="language"
        @update="getData"
        :admin="userData"
        :superAdmin="adminIsSuper"
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
    import { getUserData } from "../../scripts/user"

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
        adminIsSuper = false

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

            const u = await getUserData()

            if (u != undefined && this.users != undefined) {
                this.adminIsSuper =
                    this.users?.find((user) => {
                        return user.id == u.id
                    })?.superAdmin ?? false
            }

            this.$forceUpdate()
            this.loading = false
        }
    }
</script>
