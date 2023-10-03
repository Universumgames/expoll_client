import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import { IonicVue } from "@ionic/vue"
import "./registerServiceWorker"

createApp(App).use(IonicVue).use(store).use(router).mount("#app")
