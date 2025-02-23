<template>
    <LoadingScreen v-if="loading" />
    <div v-if="!loading">
        <label>User count: {{ count }}</label>
    </div>

    <div class="adminUserListHeader">
        <input
            v-if="!loading" v-model="search"
            type="text" placeholder="Search"
            @input="updateFilteredUsers"
            @change="updateFilteredUsers"
        >
  
        <div>
            <label for="deletedUserOnlyCheckbox">Deleted Users only</label>
            <input id="deletedUserOnlyCheckbox" v-model="deletedOnly" type="checkbox" @change="updateFilteredUsers">
        </div>

        <button @click="createUser">
            Create new User
        </button>
    </div>

    <div class="adminUserListContainer">
        <user-row
            v-for="user in filteredUsers" :key="user.id"
            :user-info="user" :language="language"
            :admin="userData as UserInfo"
            :super-admin="adminIsSuper" @update="getData"
        />
    </div>
</template>

<script setup lang="ts">
import UserRow from "./UserRow.vue"
import LoadingScreen from "@/components/utils/LoadingScreen.vue"
import { getUserData } from "@/scripts/user"
import { getAllUser } from "@/scripts/admin"
import { onMounted, ref } from "vue"
import ExpollStorage from "@/scripts/storage"
import type { UserInfo } from "@/types/admin/userInfo"
import { apiFetch } from "@/scripts/apiRequests"
import type { IUser, LocalUser } from '@/types/bases'
import type { languageData } from '@/scripts/languageConstruct'

defineProps<{ userData: LocalUser, language: languageData }>()

const adminIsSuper = ref(false)
const users = ref<UserInfo[]>()
const filteredUsers = ref<UserInfo[]>([])
const count = ref(0)
const loading = ref(true)
const deletedOnly = ref(false)

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
        ) && (!deletedOnly.value || user.deletedTimestamp != null || !user.active)
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

    const jwt = ExpollStorage.jwt
    if (jwt == null) return

    const response = await apiFetch({
        uri: "/admin/user",
        useAuth: true,
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                mail,
                firstName,
                lastName
            })
        }
    })
    if (response.ok) {
        alert("User created")
        getData()
    } else {
        alert("Error creating user")
    }
}
</script>

<style>
.adminUserListHeader{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.adminUserListContainer{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>