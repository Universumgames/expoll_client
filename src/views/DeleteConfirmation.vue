<template>
    <div>
        <h2>{{ language.uiElements.login.userAccountDeletion.disclaimer }}</h2>
        <button class="delete" style="font-size: 0.5rem;" @click="deleteAccount">
            {{ language.uiElements.login.userAccountDeletion.deleteBtn }}
        </button>
        <button
            style="font-size: 2rem; margin: 5ch" @click="deleteAccountCancel"
        >
            {{ language.uiElements.login.userAccountDeletion.cancelBtn }}
        </button>
    </div>
</template>

<script lang="ts" setup>

import { useRoute } from "vue-router"
import { languageData } from "@/scripts/languageConstruct"

const route = useRoute()

const props = defineProps<{ language: languageData }>()

const confirmationKey = route.params.key

const deleteAccount = async () => {
    if (confirm(props.language.uiElements.login.userAccountDeletion.deleteConfirm)) {
        // Delete account
        const response = await fetch("/api/user/deleteConfirm", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                deleteConfirmationKey: confirmationKey
            })
        })
        if (response.ok) {
            // Redirect to login
            window.location.href = "/login"
        } else if (response.status === 400) {
            alert(props.language.uiElements.login.userAccountDeletion.errorNotSameUser)
        } else if (response.status == 422) {
            alert(props.language.uiElements.login.userAccountDeletion.errorTimeout)
        } else {
            alert("Error: " + response.status + " " + response.statusText)
        }
    }
}

const deleteAccountCancel = async () => {
    await fetch("/api/user/deleteCancel", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            deleteConfirmationKey: confirmationKey
        })
    })
    window.location.href = "/#/account"
}

</script>

<style scoped>

</style>