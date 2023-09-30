import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import { IonicVue } from "@ionic/vue"

createApp(App).use(IonicVue).use(store).use(store).use(router).mount("#app")
