<template>
    <login-signup-view :language="language" />
</template>

<script setup lang="ts">
import LoginSignupView from "@/components/LoginSignupView.vue"
import { languageData } from "@/scripts/languageConstruct"
import { onMounted } from "vue"
import { IUser } from "@/lib/interfaces"
import { useRouter } from "vue-router"

const props = defineProps<{
    userData: IUser,
    language: languageData
}>()

const router = useRouter()

onMounted(() => {
    if (props.userData != undefined) router.push("/account")
})
</script>