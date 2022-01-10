<template>
    <div>
        <div style="text-align: left">
            <!-- name -->
            <div class="blank" id="name"></div>

            <div class="blank" id="id"></div>
            <div class="blank" id="created"></div>
            <!-- description -->
            <div style="margin-top: 1ch">
                <div class="blank" id="descTitle"></div>
                <div class="blank" id="descText"></div>
            </div>

            <!-- max vote count -->
            <div class="blank" id="voteCount"></div>
        </div>
        <!-- share -->
        <div style="text-align: left; margin-top: 1rem">
            <div class="blank" id="share"></div>
        </div>
        <br />

        <!-- Poll options and results -->
        <div class="x-scroller">
            <table>
                <tr>
                    <th class="tableBox"></th>
                    <th style="white-space: pre-wrap" class="tableBox" v-for="n in 4" v-bind:key="n"></th>
                    <th style="padding: 1rem" class="tableBox"></th>
                </tr>

                <tr v-for="m in 6" v-bind:key="m">
                    <td class="tableBox" v-for="n in 6" v-bind:key="n"></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
    import axios from "axios"
    import { Options, Vue } from "vue-class-component"
    import { ComplexOption, DetailedPoll, SimpleUserVotes } from "expoll-lib/extraInterfaces"
    import { IUser, PollType, tOptionId, tUserID } from "expoll-lib/interfaces"
    import { languageData } from "../scripts/languageConstruct"
    import SaveIcon from "../assetComponents/SaveIcon.vue"
    import EditIcon from "../assetComponents/EditIcon.vue"
    import ShareIcon from "../assetComponents/ShareIcon.vue"
    import PollUserVoteRow from "../components/PollUserVotes.vue"
    import LoadingScreen from "../components/LoadingScreen.vue"
    import SwitchIcon from "../assetComponents/SwitchIcon.vue"
    import { EditPollRequest } from "expoll-lib/requestInterfaces"
    import LoginSignupView from "../components/LoginSignupView.vue"

    /*
         votes: { user: User; votes: { optionID: tOptionId; votedFor: boolean }
     */

    @Options({
        props: {},
        components: {
            SaveIcon,
            EditIcon,
            ShareIcon,
            SwitchIcon,
            PollUserVoteRow,
            LoadingScreen,
            LoginSignupView
        }
    })
    export default class BlankDetailedPollView extends Vue {
        language?: languageData

        async mounted() {
            await this.setup()
        }

        async setup() {}
    }
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
