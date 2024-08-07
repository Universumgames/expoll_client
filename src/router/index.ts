import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    {
        path: "/polls",
        name: "Polls",
        component: () => import("../views/poll/PollListView.vue"),
        meta: {
            title: "Polls",
            appPath: "polls"
        }
    },
    {
        path: "/polls/:id",
        name: "Poll Details",
        component: () => import("../views/poll/DetailedPollView.vue"),
        meta: {
            title: "Poll Detail",
            appPath: "poll/:id"
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
        path: "/siteNotice",
        name: "Site Notice",
        component: () => import("../views/SiteNotice.vue"),
        meta: {
            title: "Site Notice"
        }
    },
    {
        path: "/support",
        name: "Support",
        component: () => import("../views/SupportView.vue"),
        meta: {
            title: "Support"
        }
    },
    {
        path: "/create",
        name: "Create Poll",
        component: () => import("../views/poll/CreatePollView.vue"),
        meta: {
            title: "Create Poll"
        }
    },
    {
        path: "/",
        name: "Home",
        component: () => import("../views/HomeView.vue"),
        meta: {
            title: "Home"
        }
    },
    {
        path: "/app",
        name: "App",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ "../views/AppInstall.vue"),
        meta: {
            title: "App"
        }
    },
    {
        path: "/login/:key?",
        name: "Login Page",
        component: () => import("../views/LoginView.vue"),
        meta: {
            title: "Login",
            appPath: "userinfo"
        }
    },
    {
        path: "/account",
        name: "Account",
        component: () => import("../views/AccountView.vue"),
        meta: {
            title: "Account",
            appPath: "userinfo"
        }
    },
    {
        path: "/admin",
        name: "Admin",
        component: () => import("../views/Admin/AdminView.vue"),
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
                component: () => import("../views/Admin/InfoView.vue"),
                meta: {
                    title: "Server Debug Info"
                }
            },
            {
                path: "mailregex",
                name: "Mail Regex Settings",
                component: () => import("../views/Admin/MailRegex.vue"),
                meta: {
                    title: "Mail Regex Settings"
                }
            }
        ]
    },
    {
        path: "/delete/:key",
        component: () => import("../views/DeleteConfirmation.vue"),
        meta: {
            title: "Delete Account"
        }
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import("../views/NotFound.vue")
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
