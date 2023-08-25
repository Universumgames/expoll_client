<template>
    <div>
        <a>
            <div class="pollListElementContainer">
                <div>
                    <div id="title" class="blank" />
                    <br>
                    <div id="id" class="blank" />
                </div>
                <div>
                    <div
                        id="uCount"
                        style="display: inline-block; margin: 1ch; top: -1ch; position: relative"
                        class="blank"
                    />
                    <div id="uIcon" class="blank" style="display: inline-block" />
                </div>
                <div id="lastUpdate" class="blank" />
                <div id="admin" class="blank" />
            </div>
        </a>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { languageData } from "../../scripts/languageConstruct"

@Options({
    components: {},
    props: {
        language: Object
    }
})
export default class BlankPollListElement extends Vue {
    language?: languageData

    async mounted() {
    }

    lastUpdated(): string {
        return this.language?.uiElements.polls.list.lastUpdate("") ?? ""
    }
}
</script>

<style scoped>
.pollListElementContainer {
    background: var(--secondary-color);
    border-radius: 1ch;
    margin: 1ch;
    padding: 1ch;
    display: flex;
    flex-wrap: wrap;
}

.pollListElementContainer:hover {
    background: var(--bg-color);
}

.pollListElementContainer > * {
    display: inline;
    margin: 1ch;
    text-align: left;
}

.blank {
    background-color: var(--blank-text-color);
    content: "";
    height: 2ch;
    border-radius: 0.5ch;
}

#title {
    width: 20ch;
}

#id {
    width: 25ch;
    height: 1ch;
}

#uCount {
    width: 4ch;
}

#uIcon {
    width: 5ch;
    height: 5ch;
}

#lastUpdate {
    width: 20ch;
    padding: 0.2rem;
}

#admin {
    width: 15ch;
    padding: 0.2rem;
}
</style>
