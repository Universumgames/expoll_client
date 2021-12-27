import { languageList } from "./languageConfig"

export interface languageData {
    id: number
    name: string | string[]
    short: string
    uiElements: {
        login: {
            loggedInAs: (username: string) => string
            notLoggedIn: string
            loginLink: string
            form: {
                loggingIn: string
                login: string
                mail: string
                loginKey: string
                loginBtn: string
                loginMailOrKeyMissing: string
                signup: string
                firstName: string
                lastName: string
                username: string
                validMailNeeded: string
                firstNameNeeded: string
                lastNameNeeded: string
                usernameNeeded: string
                signupBtn: string
            }
            alreadyLoggedInAs: (username: string) => string
            logoutBtn: string
            messages: {
                loginKeyNotExist: string
                mailSent: string
                mailNotExist: string
                userExists: string
            }
        }
        polls: {
            create: {
                createPoll: (name: string) => string
                pollNameInputLabel: string
                description: string
                maxVoteLabel: string
                typeSelect: {
                    label: string
                    stringOption: string
                    dateOption: string
                    dateTimeOption: string
                }
                optionList: string
                optionListAddOption: string
                optionName: (id: number) => string
                optionValue: string
                optionOptEndValue: string
                createBtn: string
            }
            list: {
                lastUpdate: (time: Date) => string
            }
            details: {
                userCol: string
                pollName: string
                maxPerUserVoteCount: string
                dateStringFormat: (start: Date, end?: Date) => string
                save: string
                cancel: string
                delete: string
                deleteConfirm: (value: string) => string
                deletePollBtn: string
                deletePollConfirm: string
                deletePollConfirmConfirm: string
                errorMsgs: {
                    tooMuchVotes: string
                }
            }
        }
        serverError: string
    }
}

/**
 * Get language data by id, name or short
 * @param {Object} data pass either id, language name or the short version
 * @return {languageData} returns language Object
 */
export function getLanguage(data: { id?: number; lang?: string; short?: string }): languageData {
    return (
        languageList.find((ele: languageData) => {
            return (
                (data.id != undefined && data.id == ele.id) ||
                (data.lang != undefined &&
                    (data.lang.toLowerCase() == ele.name || ele.name.includes(data.lang.toLowerCase()))) ||
                (data.short != undefined && data.short.substring(0, 2).toUpperCase() == ele.short)
            )
        }) ?? languageList[0]
    )
}

/**
 * get language set in browser
 * @return {languageData} system language object
 */
export default function getSystemLanguage(): languageData {
    return getLanguage({ short: getBrowserPresetLang() })
}

/**
 * get browser language
 * @return {String} browser language locale
 */
function getBrowserPresetLang(): string {
    if (navigator.languages != undefined) return navigator.languages[0]
    return navigator.language
}

export * from "./languageConfig"
