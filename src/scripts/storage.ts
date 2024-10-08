/* eslint-disable */

/**
 * storage container
 */
export default class ExpollStorage {

    static backendUrl: string = import.meta.env.VITE_APP_BACKEND_URL//process.env["VITE_APP_BACKEND_URL"]
    static get backendAPIUrl(): string {
        return `${ExpollStorage.backendUrl}/api`
    }
    static platformName: string = import.meta.env.VITE_APP_EXPOLL_PLATFORM_NAME//process.env["VITE_APP_EXPOLL_PLATFORM_NAME"]
    static isWeb: boolean = ExpollStorage.platformName.toLowerCase().includes("web")
    static isPWA: boolean = false
    static applicationServerKey: string = import.meta.env.VITE_APP_APPLICATION_SERVER_KEY//process.env["VITE_APP_APPLICATION_SERVER_KEY"]
    static appVersion: string = import.meta.env.VITE_APP_VERSION//process.env["VITE_APP_VERSION"]

    /**
     * check if app runs as PWA
     */
    static runsAsPWA(): boolean {
        const isPWA = (window.matchMedia("(display-mode: standalone)").matches) ||
            // @ts-ignore - Chrome Mobile (Android)
            (window.navigator.standalone) ||
            document.referrer.includes("android-app://")
        ExpollStorage.isPWA = isPWA
        return isPWA
    }

    /**
     * init storage
     */
    static async init(): Promise<void> {
        //this.runsAsPWA()
    }

    /**
     * save storage
     */
    static async save(): Promise<void> {
    }

    /**
     * get jwt
     */
    static get jwt(): string | null {
        return localStorage.getItem("jwt")
    }

    /**
     * set jwt
     * @param jwt
     */
    static set jwt(jwt: string | null) {
        if (jwt == null) {
            localStorage.removeItem("jwt")
            this.save()
            return
        }
        localStorage.setItem("jwt", jwt)
        this.save()
    }

    /**
     * get original jwt when impersonating
     */
    static get originalJwt(): string | null {
        return localStorage.getItem("originalJwt")
    }

    /**
     * set original jwt when impersonating
     * @param jwt
     */
    static set originalJwt(jwt: string | null) {
        if (jwt == null) {
            localStorage.removeItem("originalJwt")
            this.save()
            return
        }
        localStorage.setItem("originalJwt", jwt)
        this.save()
    }

    /**
     * get dark mode
     */
    static get darkMode(): boolean | null {
        const darkMode = localStorage.getItem("darkMode")
        if (darkMode == null) {
            return null
        }
        return localStorage.getItem("darkMode") === "true"
    }

    /**
     * set dark mode
     * @param darkMode
     */
    static set darkMode(darkMode: boolean | null) {
        if (darkMode == null) {
            localStorage.removeItem("darkMode")
            this.save()
            return
        }
        localStorage.setItem("darkMode", darkMode.toString())
        this.save()
    }

    /**
     * get language key
     */
    static get language(): string | null {
        return localStorage.getItem("language")
    }

    /**
     * set language key
     * @param language
     */
    static set language(language: string | null) {
        if (language == null) {
            localStorage.removeItem("language")
            this.save()
            return
        }
        localStorage.setItem("language", language)
        this.save()
    }

    /**
     * get pollid from before logging in
     */
    static get outstandingJoinPollID(): string | null {
        return localStorage.getItem("outstandingJoinPollID")
    }

    /**
     * set pollid before logging in to return to poll after logging in
     * @param pollID
     */
    static set outstandingJoinPollID(pollID: string | null) {
        if (pollID == null) {
            localStorage.removeItem("outstandingJoinPollID")
            this.save()
            return
        }
        localStorage.setItem("outstandingJoinPollID", pollID)
        this.save()
    }

    static get showIOSAppBanner(): boolean{
        return localStorage.getItem("showIOSAppBanner") == null || localStorage.getItem("showIOSAppBanner") == "true"
    }

    static set showIOSAppBanner(show: boolean){
        localStorage.setItem("showIOSAppBanner", show.toString())
    }

    static get isIOSOrMacos(): boolean {
        return /iPad|iPhone|iPod|Mac/.test(navigator.platform)
    }
}