import { createRouter, createWebHashHistory } from "vue-router"
import Home from "../views/Home.vue"
import Login from "../views/Login.vue"
import PollListView from "../views/PollListView.vue"
import CreatePollView from "../views/CreatePollView.vue"
import DetailedPollView from "../views/DetailedPollView.vue"
import Admin from "../views/Admin/Admin.vue"
import AdminUserList from "../views/Admin/AdminUserList.vue"
import AdminPollList from "../views/Admin/AdminPollList.vue"

const routes = [
    {
        path: "/polls",
        name: "Polls",
        component: PollListView,
        meta: {
            title: "Polls"
        }
    },
    {
        path: "/polls/:id",
        name: "Poll Details",
        component: DetailedPollView,
        meta: {
            title: "Poll Detail"
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
        path: "/",
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
    },
    {
        path: "/admin",
        name: "Admin",
        component: Admin,
        meta: {
            title: "Administration Home"
        },
        children: [
            {
                path: "users",
                name: "User list",
                component: AdminUserList,
                meta: {
                    title: "Userlist"
                }
            },
            {
                path: "polls",
                name: "Poll Management",
                component: AdminPollList,
                meta: {
                    title: "Pollmanagement"
                }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
