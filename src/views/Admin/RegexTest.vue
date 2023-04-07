<template>
    <div class="container">
        {{ reg?.regex }}
        <small style="color: var(--primary-color)">{{ reg?.blacklist ? "Blacklist" : "Required" }}</small>
        <input type="checkbox" v-model="reg!.blacklist" @change="$emit('update')" />
        <button @click="$emit('remove')" class="delete">Remove</button>

        <label>Test regex</label>
        <input type="text" v-model="test" :style="!matches ? 'color:green' : 'color:red'"
            style="background-color: var(--bg-color)"
            @keyup="matches = (test.match(reg!.regex) && reg!.blacklist) || (!test.match(reg!.regex) && !reg!.blacklist)" />
    </div>
</template>

<script lang="ts">
import { MailRegexEntry } from "expoll-lib/extraInterfaces"
import { Options, Vue } from "vue-class-component"

@Options({
    props: {
        reg: String
    },
    components: {}
})
export default class MailRegex extends Vue {
    reg?: MailRegexEntry

    test: string = ""

    matches = false
}
</script>

<style scoped>
.container {
    background-color: var(--secondary-color);
    border-radius: 1ch;
    margin: 0.5ch;
    padding: 0ch;
}
</style>
