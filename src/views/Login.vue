<template>
    <login-signup-view :language="language" :user-data="userData" />
</template>

<script setup lang="ts">
import LoginSignupView from "@/components/login/LoginSignupView.vue"
import { languageData } from "@/scripts/languageConstruct"
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { IUser } from "@/types/bases"

const props = defineProps<{
    userData?: IUser,
    language: languageData
}>()

const router = useRouter()

onMounted(() => {
    if (props.userData != undefined) router.push("/account")
})
</script>