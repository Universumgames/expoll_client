/* eslint-disable @typescript-eslint/ban-ts-comment */

import { precacheAndRoute } from "workbox-precaching"
import { getLanguage, type languageData } from '@/scripts/languageConstruct'
import Database from "@/scripts/db"
import { clientsClaim } from 'workbox-core'

self.skipWaiting()
clientsClaim()

// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener("message", event => {
    if (!event.data) {
        return
    }

    console.log("SW Received Message: " + event.data)

    switch (event.data) {
        case "skipWaiting":
            // @ts-ignore
            self.skipWaiting()
            break
        default:
            // NOOP
            break
    }
})

self.addEventListener("install", () => {
    // forces a service worker to activate immediately
    // @ts-ignore
    self.skipWaiting()
})

self.addEventListener("activate", function (event) {
    // when this SW becomes activated, we claim all the opened clients
    // they can be standalone PWA windows or browser tabs
    // @ts-ignore
    event.waitUntil(clients.claim())
})

self.addEventListener("message", event => {
    if (!event.data) {
        return
    }

    console.log("SW Received Message: " + event.data)

    switch (event.data) {
        case "skipWaiting":
            // @ts-ignore
            self.skipWaiting()
            break
        default:
            // NOOP
            break
    }
})

interface PushPayload {
    title: string
    body: string
    titleArgs: Array<string> | undefined
    bodyArgs: Array<string> | undefined
    timestamp: number
    expiration: number
    additionalData: Map<string, unknown> | undefined
}

/**
 * get notification translation
 * @param language
 * @param key
 */
function getNotificationTranslation(language: languageData, key: string): string| undefined {
    // @ts-ignore
    return language.notifications[key]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener("push", function (event: any) {
    const payload = event.data.json() as PushPayload
    let title = payload.title
    let body = payload.body

    const notificationDisplay = async () => {
        try {
            await Database.openDB()
            const lang = await Database.getKeyValue("language") ?? "en"
            const localeLanguage = getLanguage({ short: lang })

            if (payload.titleArgs === undefined) payload.titleArgs = []
            const titleSplit = title.split(" ")
            title = getNotificationTranslation(localeLanguage, titleSplit[0]) ?? title
            for (const arg of payload.titleArgs) {
                if (!title.includes("%@")) continue
                title = title.replace("%@", arg) ?? title
            }
            if (payload.bodyArgs === undefined) payload.bodyArgs = []
            const bodySplit = body.split(" ")
            body = getNotificationTranslation(localeLanguage, bodySplit[0]) ?? body
            for (const arg of payload.bodyArgs) {
                if (!body.includes("%@")) continue
                body = body.replace("%@", arg) ?? body
            }
            const notificationOptions: NotificationOptions = {
                body: body,
                icon: "/app_icons/ipad152.png",
                // @ts-ignore
                timestamp: payload.timestamp
            }
            // @ts-ignore
            await self.registration.showNotification(title, notificationOptions)
        } catch (e) {
            console.error(e)
        }
    }
    const t = notificationDisplay()
    event.waitUntil(t)
})