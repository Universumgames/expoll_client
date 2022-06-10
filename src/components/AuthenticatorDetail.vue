<template>
    <div class="auth-container">
        <div>
            <h3 style="display: inline">{{ name }}</h3>
            <button @click="rename"><edit-icon class="normalIcon" /></button>
        </div>
        <div>
            <div>
                <small>CredentialID: {{ authenticator.credentialID }}</small
                ><br />
                <small>Initiator Platform: {{ platform }}</small>
            </div>
            <button @click="deleteAuth" class="delete">Delete</button>
        </div>
    </div>
</template>

<script lang="ts">
    import axios from "axios"
    import { Options, Vue } from "vue-class-component"
    import EditIcon from "../assetComponents/EditIcon.vue"

    @Options({
        props: {
            userData: Object,
            language: Object,
            authenticator: Object
        },
        components: {
            EditIcon
        }
    })
    export default class AuthenticatorDetails extends Vue {
        authenticator: any

        get name() {
            return this.authenticator.name == "" ? "unnamed" : this.authenticator.name
        }

        get platform() {
            return this.authenticator.initiatorPlatform == "" ? "unknown" : this.authenticator.initiatorPlatform
        }

        async rename() {
            const newName = prompt("New name for this authenticator (leave empty for cancel)", "")
            if (!newName || newName == "") return
            await axios.post(
                "/api/webauthn/edit",
                { credentialID: this.authenticator.credentialID, newName: newName },
                { withCredentials: true }
            )
            this.$emit("update")
        }

        async deleteAuth() {
            if (!confirm(`Do you really want to delete the authenticator "${this.name}"?`)) return
            await fetch("/api/webauthn/", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ credentialID: this.authenticator.credentialID })
            })
            this.$emit("update")
        }
    }
</script>

<style scoped>
    .auth-container {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        background: var(--secondary-color);
        border-radius: 1rem;
        margin: 1rem;
        padding: 1ch;
        text-align: left;
    }

    .delete {
        background-color: var(--alert-color);
    }
</style>
