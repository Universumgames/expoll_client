<template>
    <div v-if="userData?.admin">
        <div id="adminNav">
            <h3>Administration</h3>
            <router-link to="/admin/users">
                Users
            </router-link>
            <router-link to="/admin/polls">
                Polls
            </router-link>
            <router-link to="/admin/info">
                Debug Info
            </router-link>
            <router-link to="/admin/mailregex">
                Mail Regex
            </router-link>
        </div>
        <router-view :user-data="userData" :language="language" />
    </div>
    <small v-else class="errorInfo">You are not an admin</small>
</template>

<script setup lang="ts">
import { languageData } from "@/scripts/languageConstruct"
import { IUser } from "@/types/bases"

defineProps<{ userData?: IUser, language: languageData }>()
</script>

<style>
#adminNav > a {
    margin: 1ch;
}
</style>
