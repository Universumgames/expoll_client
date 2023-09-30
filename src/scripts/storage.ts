import { Preferences } from "@capacitor/preferences"

export default class ExpollStorage {

    static async initAndroid() {
        this.jwt = (await Preferences.get({ key: "jwt" })).value
        this.originalJwt = (await Preferences.get({ key: "originalJwt" })).value
        this.darkMode = (await Preferences.get({ key: "darkMode" })).value === "true"
        this.language = (await Preferences.get({ key: "language" })).value
        console.log("initAndroid", this.jwt, this.originalJwt, this.darkMode, this.language)
    }

    static async saveAndroid() {
        if (this.jwt != null) await Preferences.set({ key: "jwt", value: this.jwt })
        if (this.originalJwt != null) await Preferences.set({ key: "originalJwt", value: this.originalJwt })
        if (this.darkMode != null) await Preferences.set({ key: "darkMode", value: this.darkMode.toString() })
        if (this.language != null) await Preferences.set({ key: "language", value: this.language })
        console.log("saved")
        console.log(await Preferences.get({ key: "jwt" }))
    }

    static backendUrl: string = process.env.VUE_APP_BACKEND_URL
    static isAndroid: boolean = process.env.VUE_APP_IS_ANDROID === "1"

    static async init() {
        if (this.isAndroid)
            await this.initAndroid()

        fetch(this.backendUrl + "/api/compliance", {
            method: "OPTIONS",
            headers: {
                "Content-Type": "application/json"
            },
            body: "{}"
        })
    }

    static async save() {
        if (this.isAndroid)
            await this.saveAndroid()
    }

    static get jwt(): string | null {
        return localStorage.getItem("jwt")
    }

    static set jwt(jwt: string | null) {
        if (jwt == null) {
            localStorage.removeItem("jwt")
            this.save()
            return
        }
        localStorage.setItem("jwt", jwt)
        this.save()
    }

    static get originalJwt(): string | null {
        return localStorage.getItem("originalJwt")
    }

    static set originalJwt(jwt: string | null) {
        if (jwt == null) {
            localStorage.removeItem("originalJwt")
            this.save()
            return
        }
        localStorage.setItem("originalJwt", jwt)
        this.save()
    }

    static get darkMode(): boolean | null {
        const darkMode = localStorage.getItem("darkMode")
        if (darkMode == null) {
            return null
        }
        return localStorage.getItem("darkMode") === "true"
    }

    static set darkMode(darkMode: boolean | null) {
        if (darkMode == null) {
            localStorage.removeItem("darkMode")
            this.save()
            return
        }
        localStorage.setItem("darkMode", darkMode.toString())
        this.save()
    }

    static get language(): string | null {
        return localStorage.getItem("language")
    }

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