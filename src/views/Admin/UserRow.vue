<template>
    <div class="userListContainer">
        <div>
            <label>{{ this.userInfo?.username }}</label>
            <small>ID: {{ this.userInfo?.id }}</small>
        </div>
        <label>Name: {{ this.userInfo?.firstName }} {{ this.userInfo?.lastName }}</label>
        <label>Mail: {{ this.userInfo?.mail }}</label>
        <label>Admin: {{ this.userInfo?.admin ? "yes" : "no" }}</label>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { UserInfo } from "../../scripts/adminInterfaces"
    import { IUser } from "../../scripts/interfaces"
    import { languageData } from "../../scripts/languageConstruct"

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
