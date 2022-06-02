import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    {
        path: "/polls",
        name: "Polls",
        component: () => import("../views/PollListView.vue"),
        meta: {
            title: "Polls"
        }
    },
    {
        path: "/polls/:id",
        name: "Poll Details",
        component: () => import("../views/DetailedPollView.vue"),
        meta: {
            title: "Poll Detail"
        }
    },
    {
        path: "/privacy",
        name: "Privacy Policy",
        component: () => import("../views/PrivacyPolicy.vue"),
        meta: {
            title: "Privacy Policy"
        }
    },
    {
        path: "/create",
        name: "Create Poll",
        component: () => import("../views/CreatePollView.vue"),
        meta: {
            title: "Create Poll"
        }
    },
    {
        path: "/",
        name: "Home",
        component: () => import("../views/Home.vue"),
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
        component: () => import("../views/Login.vue"),
        meta: {
            title: "Login - expoll"
        }
    },
    {
        path: "/admin",
        name: "Admin",
        component: () => import("../views/Admin/Admin.vue"),
        meta: {
            title: "Administration Home"
        },
        children: [
            {
                path: "users",
                name: "User list",
                component: () => import("../views/Admin/AdminUserList.vue"),
                meta: {
                    title: "Userlist"
                }
            },
            {
                path: "polls",
                name: "Poll Management",
                component: () => import("../views/Admin/AdminPollList.vue"),
                meta: {
                    title: "Pollmanagement"
                }
            },
            {
                path: "info",
                name: "Server Debug Info",
                component: () => import("../views/Admin/Info.vue"),
                meta: {
                    title: "Server Debug Info"
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
