import { createRouter, createWebHashHistory } from "vue-router"
import Home from "../views/Home.vue"
import Login from "../views/Login.vue"
import PollListView from "../views/PollListView.vue"
import CreatePollView from "../views/CreatePollView.vue"

const routes = [
    {
        path: "/",
        name: "Polls",
        component: PollListView,
        meta: {
            title: "Polls"
        }
    },
    {
        path: "/create",
        name: "Create Poll",
        component: CreatePollView,
        meta: {
            title: "Create Poll"
        }
    },
    {
        path: "/home",
        name: "Home",
        component: Home,
        meta: {
            title: "Home - expoll"
        }
    },
    {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
        meta: {
            title: "About - expoll"
        }
    },
    {
        path: "/login/:key?",
        name: "Login Page",
        component: Login,
        meta: {
            title: "Login - expoll"
        }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
