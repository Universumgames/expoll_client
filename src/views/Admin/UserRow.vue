<template>
    <div class="userListContainer">
        <div>
            <label style="word-wrap: anywhere">{{ userInfo.username }}</label>
            <small>ID: {{ userInfo.id }}</small>
            <small>Created at {{ new Date(userInfo.createdTimestamp).toLocaleString() }}</small>
            <small 
                v-if="userInfo.deletedTimestamp != null"
            >
                Deleted at {{ new Date(userInfo.deletedTimestamp).toLocaleString() }}
            </small>
            <img
                v-for="connection in userInfo.oidcConnections" :key="connection"
                :src="'/oidc/' + connection + '_preview.svg'" :alt="connection"
                class="oidcConnection"
            >
        </div>
        <label>
            Name: <span style="white-space: nowrap">{{ userInfo.firstName }} {{ userInfo.lastName }}</span>
            <button @click="editName">
                <edit-icon class="normalIcon" />
            </button>
        </label>
        <label>
            Mail: <span style="word-break: break-word">{{ userInfo.mail }}</span>
            <button @click="editEmail">
                <edit-icon class="normalIcon" />
            </button>
        </label>
        <div>
            <div v-show="!userInfo.superAdmin && admin?.admin">
                <label>Admin: {{ userInfo.admin ? "yes" : "no" }}</label>
                <br>
                <button
                    v-show="!userInfo.admin || superAdmin"
                    :style="'background-color: var(' + (userInfo.admin ? '--alert-color' : '--primary-color') + ')'"
                    @click="toggleAdmin()"
                >
                    {{ userInfo.admin ? "Demote" : "Promote" }}
                </button>
            </div>
            <label v-show="userInfo.superAdmin">Superadmin</label>
        </div>

        <div>
            <button
                v-show="!userInfo.admin && userInfo.active" style="background: var(--alert-color)"
                @click="deleteUser"
            >
                Delete User
            </button>
            <label v-show="!userInfo.admin && !userInfo.active">Already deleted</label>
            <button
                v-show="!userInfo.admin && !userInfo.active" style="background: var(--alert-color)"
                @click="deleteUser"
            >
                Delete User and Votes
            </button>
            <button v-show="!userInfo.superAdmin && admin!.id != userInfo.id" @click="impersonate">
                Impersonate
            </button>
        </div>

        <!--<div class="oidcConnectionContainer">
            <label>OIDC Connections: </label>
            <img
                v-for="connection in userInfo.oidcConnections" :key="connection"
                :src="'/oidc/' + connection + '_preview.svg'" :alt="connection"
                class="oidcConnection"
            >
            <label v-show="userInfo.oidcConnections.length == 0">None</label>
        </div>-->
    </div>
</template>

<script setup lang="ts">
import EditIcon from "@/assetComponents/EditIcon.vue"
import { deleteUserAdmin, editUserAdmin } from "@/scripts/admin"
import ExpollStorage from "@/scripts/storage"
import { apiFetch } from "@/scripts/apiRequests"
import type { UserInfo } from '@/types/admin/userInfo'
import type { languageData } from '@/scripts/languageConstruct'

const props = defineProps<{ userInfo: UserInfo; admin: UserInfo; language: languageData; superAdmin: boolean }>()
const emit = defineEmits(["update"])

const deleteUser = async () => {
    if (
        confirm("Do you really want to delete the user " + props.userInfo.username + "? This cannot be undone")
    ) {
        if (
            confirm(
                "Do you really want to delete the user " + props.userInfo.username + "? This cannot be undone"
            )
        ) {
            await deleteUserAdmin(props.userInfo.id)
            emit("update")
        }
    }
}

const toggleAdmin = async () => {
    const newState = !props.userInfo.admin
    if (
        confirm(
            "Are you sure you want to " +
                (newState ? "PROMOTE" : "DEMOTE") +
                " the user " +
                props.userInfo.username +
                "?"
        )
    ) {
        await editUserAdmin({
            userID: props.userInfo.id,
            admin: newState
        })
        emit("update")
    }
}

const editEmail = async () => {
    const newMail = prompt(`Provide new email for user ${props.userInfo.username}`, props.userInfo.mail)
    if (!newMail) return
    await editUserAdmin({
        userID: props.userInfo.id,
        mail: newMail
    })
    emit("update")
}

const editName = async () => {
    const firstName = prompt(
        `Provide new firstname for user ${props.userInfo.username}`,
        props.userInfo.firstName
    )
    if (!firstName) return
    await editUserAdmin({
        userID: props.userInfo.id,
        firstName: firstName
    })
    emit("update")

    const lastName = prompt(`Provide new lastname for user ${props.userInfo.username}`, props.userInfo.lastName)
    if (!lastName) return
    await editUserAdmin({
        userID: props.userInfo.id,
        lastName: lastName
    })
    emit("update")
}

const impersonate = async () => {
    if (!confirm("Are you sure you want to impersonate this user?")) return
    const jwt = ExpollStorage.jwt
    if(!jwt) return
    const result = await apiFetch({
        uri: "/admin/impersonate",
        useAuth: true,
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                impersonateID: props.userInfo.id
            })
        }
    })

    if(result.ok){
        const jwt = await result.text()
        ExpollStorage.originalJwt = ExpollStorage.jwt
        ExpollStorage.jwt = jwt
    }
    window.location.reload()
}

</script>

<style>
.userListContainer {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    background: var(--secondary-color);
    border-radius: var(--aggressive-border-radius);
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

.oidcConnection {
    width: 4ch;
    display: inline-block;
}

.oidcConnectionContainer {
    flex-direction: unset;
    align-items: center;
}

.oidcConnectionContainer > * {
    margin: 1ch;
}
</style>
