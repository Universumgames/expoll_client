<template>
    <loading-screen v-if="loading" />
    <div v-if="!loading">
        <label>User count: {{ count }}</label>
    </div>

    <input
        v-if="!loading" v-model="search"
        type="text" placeholder="Search"
        @input="updateFilteredUsers"
        @change="updateFilteredUsers"
    >

    <button @click="createUser">
        Create new User
    </button>

    <user-row
        v-for="user in filteredUsers" :key="user.id"
        :user-info="user" :language="language"
        :admin="userData"
        :super-admin="adminIsSuper" @update="getData"
    />
</template>

<script setup lang="ts">
import { IUser } from "@/lib/interfaces"
import { UserInfo } from "@/lib/adminInterfaces"
import { languageData } from "@/scripts/languageConstruct"
import UserRow from "./UserRow.vue"
import LoadingScreen from "@/components/LoadingScreen.vue"
import { getUserData } from "@/scripts/user"
import { getAllUser } from "@/scripts/admin"
import axios from "axios"
import { onMounted, ref } from "vue"

const props = defineProps<{ userData?: IUser, language: languageData }>()

const adminIsSuper = ref(false)
const users = ref<UserInfo[]>()
const filteredUsers = ref<UserInfo[]>([])
const count = ref(0)
const loading = ref(true)

const search = ref("")

const getData = async () => {
    const data = await getAllUser()
    if (data === undefined) return
    users.value = data.users
    count.value = data.totalCount

    const u = await getUserData()

    if (u != undefined && users.value != undefined) {
        adminIsSuper.value =
            users.value.find((user) => {
                return user.id == u.id
            })?.superAdmin ?? false
    }

    updateFilteredUsers()

    loading.value = false
}

onMounted(async () => {
    getData()
})

const updateFilteredUsers = () => {
    if (users.value == undefined) return
    filteredUsers.value = users.value.filter((user) => {
        return (
            user.username.toLowerCase().includes(search.value.toLowerCase()) ||
            user.mail.toLowerCase().includes(search.value.toLowerCase()) ||
            user.firstName.toLowerCase().includes(search.value.toLowerCase()) ||
            user.lastName.toLowerCase().includes(search.value.toLowerCase())
        )
    })
}

const createUser = async () => {
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
        getData()
    } else {
        alert("Error creating user")
    }
}
</script>
