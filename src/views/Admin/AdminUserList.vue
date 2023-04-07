<template>
    <loading-screen v-if="loading" />
    <div v-if="!loading">
        <label>User count: {{ count }}</label>
    </div>

    <input v-if="!loading" type="text" placeholder="Search" v-model="search" @input="updateFilteredUsers"
        @change="updateFilteredUsers" />

    <button @click="createUser">Create new User</button>

    <user-row v-for="user in filteredUsers" :key="user.id" :userInfo="user" :language="language" @update="getData"
        :admin="userData" :superAdmin="adminIsSuper" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { IUser } from "expoll-lib/interfaces"
import { UserInfo } from "expoll-lib/adminInterfaces"
import { languageData } from "../../scripts/languageConstruct"
import UserRow from "./UserRow.vue"
import LoadingScreen from "../../components/LoadingScreen.vue"
import { getUserData } from "../../scripts/user"
import { getAllUser } from "../../scripts/admin"
import axios from "axios"

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
    filteredUsers: UserInfo[] = []
    count = 0

    loading = true

    search = ""

    async mounted() {
        this.getData()
    }

    async getData() {
        const data = await getAllUser()
        if (data === undefined) return
        this.users = data.users
        this.count = data.totalCount

        const u = await getUserData()

        if (u != undefined && this.users != undefined) {
            this.adminIsSuper =
                this.users?.find((user) => {
                    return user.id == u.id
                })?.superAdmin ?? false
        }

        this.updateFilteredUsers()

        this.$forceUpdate()
        this.loading = false
    }

    updateFilteredUsers() {
        if (this.users == undefined) return []
        if (this.search == "") {
            this.filteredUsers = this.users
            return
        }
        this.filteredUsers = this.users.filter((user) => {
            return user.mail.toLowerCase().includes(this.search.toLowerCase()) ||
                user.firstName.toLowerCase().includes(this.search.toLowerCase()) ||
                user.lastName.toLowerCase().includes(this.search.toLowerCase()) ||
                user.id.toLowerCase().includes(this.search.toLowerCase()) ||
                user.username.toLowerCase().includes(this.search.toLowerCase()) ||
                (user.superAdmin ? "superadmin" : "").includes(this.search.toLowerCase()) ||
                (user.admin ? "admin" : "").includes(this.search.toLowerCase())
        })
    }

    async createUser() {
        const username = prompt("Provide a Username")
        if (username == null || username == "") return
        const mail = prompt("Provide the mail address")
        if (mail == null || mail == "") return
        const firstName = prompt("Provide the first name")
        if (firstName == null || firstName == "") return
        const lastName = prompt("Provide the last name")
        if (lastName == null || lastName == "") return

        if (!confirm("Create user?")) return

        const result = await axios.post("/api/admin/user", {
            username,
            mail,
            firstName,
            lastName
        })
        if (result.status == 200) {
            alert("User created")
            this.getData()
        } else {
            alert("Error creating user")
        }
    }
}
</script>
