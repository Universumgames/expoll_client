import { Preferences } from "@capacitor/preferences"
import Database from "@/scripts/db"

/**
 * storage container
 */
export default class ExpollStorage {

    /**
     * init storage for android
     */
    static async initAndroid(): Promise<void> {
        this.jwt = (await Preferences.get({ key: "jwt" })).value
        this.originalJwt = (await Preferences.get({ key: "originalJwt" })).value
        this.darkMode = (await Preferences.get({ key: "darkMode" })).value === "true"
        this.language = (await Preferences.get({ key: "language" })).value
        console.log("initAndroid", this.jwt, this.originalJwt, this.darkMode, this.language)
    }

    /**
     * save storage for android
     */
    static async saveAndroid(): Promise<void> {
        if (this.jwt != null) await Preferences.set({ key: "jwt", value: this.jwt })
        if (this.originalJwt != null) await Preferences.set({ key: "originalJwt", value: this.originalJwt })
        if (this.darkMode != null) await Preferences.set({ key: "darkMode", value: this.darkMode.toString() })
        if (this.language != null) await Preferences.set({ key: "language", value: this.language })
        console.log("saved")
        console.log(await Preferences.get({ key: "jwt" }))
    }

    static backendUrl: string = process.env.VUE_APP_BACKEND_URL
    static platformName: string = process.env.VUE_APP_EXPOLL_PLATFORM_NAME
    static isAndroid: boolean = ExpollStorage.platformName === "android"
    static isWeb: boolean = ExpollStorage.platformName === "web"
    static applicationServerKey: string = process.env.VUE_APP_APPLICATION_SERVER_KEY
    static appVersion: string = process.env.VUE_APP_VERSION

    /**
     * init storage
     */
    static async init(): Promise<void> {
        if (this.isAndroid)
            await this.initAndroid()
    }

    /**
     * save storage
     */
    static async save(): Promise<void> {
        if (this.isAndroid)
            await this.saveAndroid()
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

}