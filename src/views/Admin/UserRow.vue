<template>
    <div class="userListContainer">
        <div>
            <label>{{ userInfo?.username }}</label>
            <small>ID: {{ userInfo?.id }}</small>
        </div>
        <label>
            Name: <span style="white-space: nowrap">{{ userInfo?.firstName }} {{ userInfo?.lastName }}</span>
            <button @click="editName">
                <edit-icon class="normalIcon" />
            </button>
        </label>
        <label>
            Mail: <span style="word-break: break-word">{{ userInfo?.mail }}</span>
            <button @click="editEmail">
                <edit-icon class="normalIcon" />
            </button>
        </label>
        <div>
            <div v-show="!userInfo?.superAdmin && admin?.admin">
                <label>Admin: {{ userInfo?.admin ? "yes" : "no" }}</label>
                <br />
                <button
                    v-show="!userInfo?.admin || superAdmin"
                    @click="toggleAdmin()"
                    :style="'background-color: var(' + (userInfo?.admin ? '--alert-color' : '--primary-color') + ')'"
                >
                    {{ userInfo?.admin ? "Demote" : "Promote" }}
                </button>
            </div>
            <label v-show="userInfo?.superAdmin">Superadmin</label>
        </div>

        <div>
            <button
                v-show="!userInfo?.admin && userInfo?.active"
                @click="deleteUser"
                style="background: var(--alert-color)"
            >
                Delete User
            </button>
            <label v-show="!userInfo?.admin && !userInfo?.active">Already deleted</label>
            <button
                v-show="!userInfo?.admin && !userInfo?.active"
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
    import EditIcon from "../../assetComponents/EditIcon.vue"
    import { AdminEditUserRequest } from "expoll-lib/requestInterfaces"

    @Options({
        props: {
            userInfo: Object,
            admin: Object,
            language: Object,
            superAdmin: Object
        },
        components: {
            EditIcon
        }
    })
    export default class UserRow extends Vue {
        userInfo: UserInfo | undefined
        admin: UserInfo | undefined
        language?: languageData
        superAdmin?: boolean

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

        async toggleAdmin() {
            const newState = !this.userInfo?.admin
            if (
                confirm(
                    "Are you sure you want to " +
                        (newState ? "PROMOTE" : "DEMOTE") +
                        " the user " +
                        this.userInfo?.username +
                        "?"
                )
            ) {
                await axios.put("/api/admin/users", {
                    userID: this.userInfo?.id,
                    admin: newState
                } as AdminEditUserRequest)
                this.$emit("update")
            }
        }

        async editEmail() {
            const newMail = prompt(`Provide new email for user ${this.userInfo?.username}`, this.userInfo?.mail)
            if (!newMail) return
            await axios.put("/api/admin/users", {
                userID: this.userInfo?.id,
                mail: newMail
            } as AdminEditUserRequest)
            this.$emit("update")
        }

        async editName() {
            const firstName = prompt(
                `Provide new firstname for user ${this.userInfo?.username}`,
                this.userInfo?.firstName
            )
            if (!firstName) return
            await axios.put("/api/admin/users", {
                userID: this.userInfo?.id,
                firstName: firstName
            } as AdminEditUserRequest)
            this.$emit("update")

            const lastName = prompt(`Provide new lastname for user ${this.userInfo?.username}`, this.userInfo?.lastName)
            if (!lastName) return
            await axios.put("/api/admin/users", {
                userID: this.userInfo?.id,
                lastName: lastName
            } as AdminEditUserRequest)
            this.$emit("update")
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
