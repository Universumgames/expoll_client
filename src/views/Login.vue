<template>
  <login-signup-view :language="language" :user-data="userData" :displaySize="displaySize" :failed-loading="failedLoading" />
</template>

<script lang="ts" setup>
import LoginSignupView from '@/components/login/LoginSignupView.vue'
import type { languageData } from '@/scripts/languageConstruct'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { IUser } from '@/types/bases'
import type { DisplaySize } from '@/scripts/displayHelper'

const props = defineProps<{
  userData?: IUser,
  language: languageData,
  displaySize: DisplaySize,
  failedLoading: boolean
}>()

const router = useRouter()

onMounted(() => {
  if (props.userData != undefined) router.push('/account')
})
</script>