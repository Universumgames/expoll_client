<template>
    <div>{{ poll.name }}</div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { IPoll } from "../scripts/interfaces"

    @Options({
        components: {},
        props: {
            poll: Object
        }
    })
    export default class PollListElement extends Vue {
        poll!: IPoll
    }
</script>
