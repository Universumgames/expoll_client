<script setup lang="ts">

defineProps<{
    style: string
    color: string,
    height: string,
}>()

</script>

<template>
    <hr class="divider" :class="style">
</template>

<style scoped>
.divider{

}

.solid {
    border-top: v-bind(height) solid v-bind(color);
}

.dotted {
    border-top: v-bind(height) dotted v-bind(color);
}

.rounded {
    border-top: v-bind(height) solid v-bind(color);
    border-radius: 5px;
}

</style>