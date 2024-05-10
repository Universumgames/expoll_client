<template>
    <div>
        <div style="text-align: left">
            <!-- name -->
            <div id="name" class="blank" />

            <div id="id" class="blank" />
            <div id="created" class="blank" />
            <!-- description -->
            <div style="margin-top: 1ch">
                <div id="descTitle" class="blank" />
                <div id="descText" class="blank" />
            </div>

            <!-- max vote count -->
            <div id="voteCount" class="blank" />
        </div>
        <!-- share -->
        <div style="text-align: left; margin-top: 1rem">
            <div id="share" class="blank" />
        </div>
        <br>

        <!-- Poll options and results -->
        <div class="x-scroller">
            <table style="border-spacing: 0.5rem">
                <tr>
                    <th class="tableBox" />
                    <th v-for="n in 4" :key="n" style="white-space: pre-wrap" class="tableBox" />
                    <th style="padding: 1rem" class="tableBox" />
                </tr>

                <tr v-for="m in 6" :key="m">
                    <td v-for="n in 6" :key="n" class="tableBox" />
                </tr>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { languageData } from "@/scripts/languageConstruct"

/*
     votes: { user: User; votes: { optionID: tOptionId; votedFor: boolean }
 */

defineProps<{ language: languageData }>()
</script>

<style scoped>
* {
    color: var(--text-color);
}

input {
    background: var(--secondary-color);
}

.addOption,
.addOption > div {
    display: inline;
}

p {
    margin-top: 0;
}

td > input,
th > input,
.addOption > div > input {
    background: var(--bg-color);
}

a {
    cursor: pointer;
}

.x-scroller {
    width: 98vw;
    overflow-x: auto;
}

.currentUserVotes {
    outline: thin solid var(--primary-color);
}

.deleteOpt {
    text-decoration: underline;
}

.blank {
    background-color: var(--secondary-color);
    content: "";
    height: 2ch;
    border-radius: 0.5ch;
    display: block;
    margin-top: 0.5ch;
}

#name {
    width: 15ch;
    height: 3ch;
}

#id {
    width: 25ch;
    height: 1ch;
}

#created {
    width: 20ch;
    height: 1.5ch;
}

#descTitle {
    width: 15ch;
    margin-top: 2ch;
}

#descText {
    width: 40ch;
    height: 15ch;
}

#voteCount {
    width: 60ch;
    margin-top: 1ch;
}

#share {
    width: 10ch;
    height: 4ch;
}

.tableBox {
    width: 10ch;
    height: 3ch;
    content: "";
}
</style>
