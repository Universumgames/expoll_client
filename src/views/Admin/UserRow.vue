<template>
    <div class="userListContainer">
        <div>
            <label>{{ this.userInfo?.username }}</label>
            <small>ID: {{ this.userInfo?.id }}</small>
        </div>
        <label
            >Name:
            <span style="white-space: nowrap">{{ this.userInfo?.firstName }} {{ this.userInfo?.lastName }}</span></label
        >
        <label
            >Mail: <span style="word-break: break-word">{{ this.userInfo?.mail }}</span></label
        >
        <label>Admin: {{ this.userInfo?.admin ? "yes" : "no" }}</label>
        <label v-show="this.userInfo?.superAdmin">Superadmin</label>

        <div>
            <button
                v-show="!this.userInfo?.admin && this.userInfo?.active"
                @click="deleteUser"
                style="background: var(--alert-color)"
            >
                Delete User
            </button>
            <label v-show="!this.userInfo?.admin && !this.userInfo?.active">Already deleted</label>
            <button
                v-show="!this.userInfo?.admin && !this.userInfo?.active"
                @click="deleteUser"
                style="background: var(--alert-color)"
            >
                Delete User and Votes
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { UserInfo } from "expoll-lib/adminInterfaces"
    import { languageData } from "../../scripts/languageConstruct"
    import axios from "axios"

    @Options({
        props: {
            userInfo: Object,
            language: Object
        },
        components: {}
    })
    export default class UserRow extends Vue {
        userInfo: UserInfo | undefined
        language?: languageData

        async deleteUser() {
            if (
                confirm("Do you really want to delete the user " + this.userInfo?.username + "? This cannot be undone")
            ) {
                if (
                    confirm(
                        "Do you really want to delete the user " + this.userInfo?.username + "? This cannot be undone"
                    )
                ) {
                    await axios.delete("/api/admin/user", {
                        data: { userID: this.userInfo?.id },
                        withCredentials: true
                    })
                    this.$emit("update")
                }
            }
        }
    }
</script>

<style scoped>
    .userListContainer {
        display: flex;
        flex-wrap: wrap;
        flex-direction: columns;
        background: var(--secondary-color);
        border-radius: 1rem;
        margin: 1rem;
        padding: 1ch;
        text-align: left;
    }

    .userListContainer > * {
        display: flex;
        flex-direction: column;
        flex: 1 0 auto;
        padding: 1rem;
        width: fit-content;
    }
</style>
