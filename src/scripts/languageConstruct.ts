import { languageList } from "./languages/languageConfig"

export interface languageData {
    id: number
    name: string[]
    short: string
    uiElements: {
        navigation: {
            polls: string
            home: string
            changeLanguageButton: string
            privacyPolicy: string
            siteNotice: string
        }
        home: string
        appInstall: {
            title: string
            belowImage: string
        }
        login: {
            loggedInAs: (username: string) => string
            notLoggedIn: string
            loginLink: string
            loginFirst: string
            form: {
                loggingIn: string
                login: string
                advancedLogin: string
                requestMail: string
                requestBtn: string
                mail: string
                otp: string
                loginBtn: string
                otpQuestionAlert: string
                loginMailOrOTPMissing: string
                signup: string
                firstName: string
                lastName: string
                username: string
                validMailNeeded: string
                firstNameNeeded: string
                lastNameNeeded: string
                usernameNeeded: string
                signupBtn: string
                quickLoginTitle: string
                quickLoginBtn: string
                quickLoginNote: string
                leaveQuickLoginBtn: string
                or: string
                invalidMail: string
                oidc: String
            }
            alreadyLoggedInAs: (username: string) => string
            logoutBtn: string
            messages: {
                otpNotExist: string
                mailSent: string
                mailNotExist: string
                userExists: string
            }
            loggedIn: {
                personalizedDBContent: string
                viewAuth: string
                addAuth: string
                authDisclaimer: string
                authEmpty: string
                deleteAccount: string
                activeSessions: string
                deleteSessionPrompt: string
                logoutAllPrompt: string
            }
        }
        polls: {
            create: {
                createPoll: (name: string) => string
                pollNameInputLabel: string
                description: string
                maxVoteLabel: string
                allowsMaybeLabel: string
                allowsEditingLabel: string
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
                maxCountExceeded: string
                emptyField: string
                editableAfterCreation: string
                notEditableAfterCreation: string
            }
            list: {
                lastUpdate: (timeString: string) => string
            }
            details: {
                createdBy: (username: string) => string
                userCol: string
                userNotesByAdmin: (note?: string) => string
                pollName: string
                maxPerUserVoteCount: string
                maxPerUserVoteCountDescription: string
                dateStringFormat: (start?: string, end?: string) => string
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
                leavePollBtn: string
                leaveConfirm: string
                kickFromPollBtn: string
                kickConfirm: (username: string) => string
                editingDisabled: string
                addUserBtn: string
            }
            votes: {
                yes: string
                no: string
                unknown: string
                maybe: string
            }
        }
        serverError: string
        dateToString: (d?: Date) => string
        dateTimeToString: (dt?: Date) => string
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
                (data.lang != undefined && ele.name.includes(data.lang.toLowerCase())) ||
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

export * from "./languages/languageConfig"