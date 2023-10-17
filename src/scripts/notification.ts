import ExpollStorage from "@/scripts/storage"

/**
 * check if push notification is supported
 */
function isPushNotificationSupported() {
    return "serviceWorker" in navigator && "PushManager" in window
}

/**
 * initialize notifications
 */
export function initializePushNotifications(): void {
    // request user grant to show notification
    console.log("initializePushNotifications")
    if (!isPushNotificationSupported()) {
        console.error("Push notifications are not supported in this browser")
        return
    }
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(function (permission) {
            console.log("permission", permission)
            if (permission === "granted") {
                // Permission granted, you can now subscribe the user
                subscribeUser()
            }
        })
    } else {
        // Permission was already granted, you can subscribe the user
        subscribeUser()
    }

}

/**
 * initialize push notifications
 */
function subscribeUser() {
    //sendNotification()
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.subscribe(
            { userVisibleOnly: true, applicationServerKey: ExpollStorage.applicationServerKey })
            .then(function (subscription) {
                // The subscription object contains endpoint and keys
                // Send the subscription object to your server for future notifications
                sendSubscriptionToServer(subscription)
            })
            .catch(function (error) {
                console.error("Error subscribing:", error)
            })
    })
}

/**
 * send push notification config to server
 * @param subscription push notification config
 */
function sendSubscriptionToServer(subscription: PushSubscription) {
    // Send a POST request to your server with the subscription data
    console.log(subscription.toJSON())
    fetch("/api/notifications/web", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + ExpollStorage.jwt
        }
    })
        .then(function () {
            // Handle the response from the server
        })
        .catch(function (error) {
            console.error("Error sending subscription to server:", error)
        })
}