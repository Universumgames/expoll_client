<template>
  <LoadingScreen v-if="userData == undefined && !failedLoading" />

  <div v-if="userData != undefined && loggedIn" id="accountContainer">
    <div
      class="flexColumns"
      :class="useSmallDisplay ? 'smallDisplay' : 'largeDisplay'"
    >
      <div class="column">
        <BasicAccountInfo :language="language" :user-data="userData" class="block" />
        <NotificationPreferences :language="language" :user-data="userData" class="block" />
      </div>
      <div class="column">
        <OIDCLogins :language="language" :user-data="userData" class="block" />
        <Authenticators :language="language" :user-data="userData" class="block" />
        <Sessions :language="language" :user-data="userData" class="block" />

        <button
          style="
            background-color: var(--secondary-color);
            border-radius: var(--default-border-radius);
            color: var(--primary-color);
          "
          @click="requestPersonalData"
          tabindex="0"
        >
          {{ language?.uiElements.login.loggedIn.personalizedDBContent }}
        </button>

        <button @click="loginApp" @keyup.enter="loginApp" tabindex="0">
          {{ language?.uiElements.login.loggedIn.loginAppBtn }}
        </button>
      </div>
    </div>
    <button @click="logout" tabindex="0" class="delete">
      {{ language?.uiElements.login.logoutBtn }}
    </button>
    <button class="delete" style="margin-top: 30vh" @click="deleteUser" tabindex="0">
      {{ language?.uiElements.login.loggedIn.deleteAccount }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { languageData } from '@/scripts/languageConstruct'
import * as user from '../scripts/user'
import LoadingScreen from '../components/utils/LoadingScreen.vue'
import * as auth from '@/scripts/authentication'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BasicAccountInfo from '@/components/account/BasicAccountInfo.vue'
import Authenticators from '@/components/account/AuthenticatorView.vue'
import Sessions from '@/components/account/SessionsView.vue'
import NotificationPreferences from '@/components/account/NotificationPreferences.vue'
import OIDCLogins from '@/components/account/OIDCLogins.vue'
import type { LocalUser } from '@/types/bases'
import { setCookie } from '@/scripts/cookie'
import ExpollStorage from '@/scripts/storage'
import { DisplaySize } from '@/scripts/displayHelper.ts'

const props = defineProps<{
  userData?: LocalUser
  language: languageData
  failedLoading: boolean
  displaySize: DisplaySize
}>()
const router = useRouter()

onMounted(async () => {
  if (props.userData == undefined) {
    router.push('/login')
    return
  }
})

const loggedIn = computed(() => {
  return props.userData != undefined
})

const requestPersonalData = async () => {
  await user.requestPersonalData()
  alert('Personal data has been requested, please check your email')
}

const logout = async () => {
  await auth.logout()
  location.reload()
}

const deleteUser = async () => {
  if (props.userData?.admin) {
    alert('You are an admin, you cannot delete your account')
    return
  }
  if (
    confirm(
      'Are you sure you want to delete your user account? ' +
        'You loose your access to the account and your personal information will be deleted'
    )
  ) {
    if (
      confirm(
        'Deleting your user account will remove your access to your votes and polls, ' +
          'are you sure you want to continue?'
      )
    ) {
      if (
        confirm('A confirmation email will be delivered, once opened this action cannot be undone')
      ) {
        await user.deleteUser()
        location.reload()
      }
    }
  }
}

const loginApp = () => {
  setCookie('expoll_session', JSON.stringify({ jwt: ExpollStorage.jwt ?? '' }))
  window.open('/api/auth/simple/app', '_blank')
}

const useSmallDisplay = computed(() => {
  return DisplaySize.M >= props.displaySize
})
</script>

<style scoped>
.smallDisplay {
  flex-direction: column;
}

.largeDisplay {
  flex-direction: row;
}

.flexColumns {
  display: flex;
  gap: 2ch;
  flex-wrap: wrap;
}

.column {
  display: flex;
  gap: 2ch;
  flex-direction: column;
  flex: 1;
}

.column > button {
  width: 100%;
  margin: 0;
  padding: 1rem;
}

button {
  margin: auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
}

input {
  background: var(--bg-color);
}

pre {
  text-align: left;
  background: var(--secondary-color);
  padding: 1rem;
  border-radius: var(--default-border-radius);
}
</style>
