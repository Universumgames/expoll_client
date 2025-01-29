<script setup lang="ts">
import * as jumpID from '@/scripts/jumpElementIDs'

function tabToLink(id: string) {
    const element = document.getElementById(id)
    if (element != null) {
        element.focus()
    }
}

</script>

<template>
    <div class="skip-link">
        <a @keyup.enter="tabToLink(jumpID.jumpToNavID)" @click="tabToLink(jumpID.jumpToNavID)" tabindex="0">Skip to main navigation</a>
        <a @keyup.enter="tabToLink(jumpID.jumpToContentID)" @click="tabToLink(jumpID.jumpToContentID)" tabindex="0">Skip to main content</a>
        <a @keyup.enter="tabToLink(jumpID.jumpToFooterID)" @click="tabToLink(jumpID.jumpToFooterID)" tabindex="0">Skip to footer</a>
    </div>
</template>

<style scoped>
.skip-link {
    position: absolute;
    left: -999px;
    background: var(--bg-color);
}

.skip-link > * {
    display: block;
}

.skip-link:focus-within {
    left: 0;
}
</style>