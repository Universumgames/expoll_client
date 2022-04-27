<template>
    <div id="popupBG"></div>
    <div id="popup">
        <h2>{{ title }}</h2>
        <p>{{ text }}</p>
        <button @click="this.$emit('close')">OK</button>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"

    @Options({
        props: {
            title: Object,
            text: Object
        }
    })
    export default class Popup extends Vue {
        title?: string
        text?: string
    }
</script>

<style scoped>
    #popup {
        position: absolute;
        z-index: 100;
        top: 50vh;
        left: 50vw;
        transform: translate(-50%, -50%);
        background-color: var(--bg-color);
        padding: 5ch;
        border-radius: 1ch;
    }

    #popupBG {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 99;
        background-color: rgba(50, 50, 50, 0.8);
        backdrop-filter: blur(10);
    }
</style>
