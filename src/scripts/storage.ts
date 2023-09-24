export default class ExpollStorage {

    static get jwt(): string | null {
        return localStorage.getItem("jwt")
    }

    static set jwt(jwt: string| null) {
        if (jwt == null) {
            localStorage.removeItem("jwt")
            return
        }
        localStorage.setItem("jwt", jwt)
    }

    static get originalJwt(): string | null {
        return localStorage.getItem("originalJwt")
    }

    static set originalJwt(jwt: string| null) {
        if (jwt == null) {
            localStorage.removeItem("originalJwt")
            return
        }
        localStorage.setItem("originalJwt", jwt)
    }

    static get darkMode(): boolean| null {
        const darkMode = localStorage.getItem("darkMode")
        if (darkMode == null) {
            return null
        }
        return localStorage.getItem("darkMode") === "true"
    }

    static set darkMode(darkMode: boolean| null) {
        if (darkMode == null) {
            localStorage.removeItem("darkMode")
            return
        }
        localStorage.setItem("darkMode", darkMode.toString())
    }

    static get language(): string| null {
        return localStorage.getItem("language")
    }

    static set language(language: string| null) {
        if (language == null) {
            localStorage.removeItem("language")
            return
        }
        localStorage.setItem("language", language)
    }

}