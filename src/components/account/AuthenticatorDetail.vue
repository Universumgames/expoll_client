<template>
    <div class="auth-container">
        <div>
            <h3 style="display: inline">
                {{ name }}
            </h3>
            <button @click="rename">
                <edit-icon class="normalIcon" />
            </button>
        </div>

        <div>
            <small>CredentialID: {{ authenticator.credentialID }}</small><br>
            <small>Initiator Platform: {{ limitLength(platform, 50) }}</small>
            <br>
            <small>Creation: {{ new Date(createdAuth) }}</small>
        </div>
        <button class="delete" @click="deleteAuth">
            Delete
        </button>
    </div>
</template>

<script setup lang="ts">
import * as auth from "@/scripts/authentication"
import EditIcon from "../../assetComponents/EditIcon.vue"
import { languageData } from "@/scripts/languageConstruct"
import { computed } from "vue"
import { limitLength } from "@/scripts/helper"
import { IUser } from "@/types/bases"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const props = defineProps<{ userData: IUser, language?: languageData, authenticator: any }>()
const emit = defineEmits(["update"])

const name = computed(() => props.authenticator.name == "" ? "unnamed" : props.authenticator.name)
const platform = computed(() =>
    props.authenticator.initiatorPlatform == "" ? "unknown" : props.authenticator.initiatorPlatform)
const createdAuth = computed(() => props.authenticator.created == undefined ? "unknown" : props.authenticator.created)

const rename = async () => {
    const newName = prompt("New name for this authenticator (leave empty for cancel)", "")
    if (!newName || newName == "") return
    await auth.rename(props.authenticator.credentialID, newName)
    emit("update")
}

const deleteAuth = async () => {
    if (!confirm(`Do you really want to delete the authenticator "${name.value}"?`)) return
    await auth.deleteWebauthn(props.authenticator.credentialID)
    emit("update")
}
</script>

<style>
.auth-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    background: var(--bg-color);
    border-radius: var(--default-border-radius);
    margin: 1rem;
    padding: 1ch;
  justify-content: space-between;
}
</style>
