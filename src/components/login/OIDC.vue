<template>
    <div class="container">
        <h2>{{ language?.uiElements.login.form.oidc }}</h2>
        <div class="providers">
            <a v-for="provider in providers" :key="provider.key" class="providerLink"
                :href="'/api/auth/oidc/' + provider.key">
                <img :src="provider.imageURI" style="width: 100%; color: var(--primary-color)" :alt="provider.altName" />
            </a>
        </div>
    </div>
</template>

<script lang="ts">

import { Options, Vue } from "vue-class-component"
import { languageData } from "../../scripts/languageConstruct"
import LoadingScreen from "../LoadingScreen.vue"
import Popup from "../Popup.vue"
import axios from "axios"

@Options({
    props: {
        language: Object
    },
    components: {
        LoadingScreen,
        Popup
    }
})
export default class OIDC extends Vue {
    language?: languageData
    providers: { key: string, imageURI: string, imageSmallURI: string, altName: string }[] = []

    async mounted() {
        this.providers = await axios.get("/api/auth/oidc/providers").then(res => res.data)
        this.$forceUpdate()
    }
}


</script>

<style scoped>
.container {}

.providers {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.providerLink {
    display: block;
    width: 100%;
    margin-bottom: 1ch;
    max-width: 70vw;
    width: 50ch;
}
</style>