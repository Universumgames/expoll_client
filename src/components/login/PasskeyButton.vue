<template>
    <button class="providerLink" @click="login">
      <img src="../../assets/FIDO_Passkey_mark_A.png" alt="FIDO Passkey" style="width: 5ch; color: var(--primary-color)" />
        <p>{{ language?.uiElements.login.form.passkeyLoginBtn }}</p>
    </button>
</template>

<script setup lang="ts">
import type { languageData } from "@/scripts/languageConstruct"
import * as auth from "@/scripts/auth/webauthn"

defineProps<{
    language?: languageData
}>()

const login = async () => {
    const { success, error } = await auth.loginWebauthn({})
    console.log(success, error)

    if (!success) console.error(error)
    else window.location.reload()
}

</script>

<style scoped>
</style>