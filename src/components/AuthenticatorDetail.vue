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
                <br />
                <small>Creation: {{ createdAuth }}</small>
            </div>
            <button @click="deleteAuth" class="delete">Delete</button>
        </div>
    </div>
</template>

<script lang="ts">
    import { rename, deleteWebauthn } from "@/scripts/webauthn"
    import { IUser } from "expoll-lib/interfaces"
    import { Options, Vue } from "vue-class-component"
    import EditIcon from "../assetComponents/EditIcon.vue"
    import { languageData } from "../scripts/languageConstruct"

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
        language?: languageData

        userData: IUser | undefined

        get name() {
            return this.authenticator.name == "" ? "unnamed" : this.authenticator.name
        }

        get platform() {
            return this.authenticator.initiatorPlatform == "" ? "unknown" : this.authenticator.initiatorPlatform
        }

        get createdAuth(): Date | string {
            return this.authenticator.created == undefined ? "unknown" : this.authenticator.created
        }

        async rename() {
            const newName = prompt("New name for this authenticator (leave empty for cancel)", "")
            if (!newName || newName == "") return
            await rename(this.authenticator.credentialID, newName)
            this.$emit("update")
        }

        async deleteAuth() {
            if (!confirm(`Do you really want to delete the authenticator "${this.name}"?`)) return
            deleteWebauthn(this.authenticator.credentialID)
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
