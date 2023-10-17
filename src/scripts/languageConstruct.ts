/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { languageList } from "./languages/languageConfig"

export interface languageData {
    id: number
    name: string[]
    short: string
    uiElements: {
        appBanner: string,
        navigation: {
            polls: string
            home: string
            changeLanguageButton: string
            changeColorSchemeButton: string
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
            loggedInText: string
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
                oidc: string
                tryOtherMail: string
                emailNotExistSignupRequired: string
                defineUsernameAfterOIDC: string
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
                auths: string
                addAuth: string
                authDisclaimer: string
                authEmpty: string
                deleteAccount: string
                activeSessions: string
                deleteSession: string
                deleteSessionPrompt: string
                logoutAllPrompt: string
                oidcLogins: string,
                loginAppBtn: string,
                editUsernamePrompt: string,
                editFirstNamePrompt: string,
                editLastNamePrompt: string,
                oidcConnectionNote: string,
                createdOn: string,
            },
            userAccountDeletion: {
                disclaimer: string,
                deleteBtn: string,
                cancelBtn: string,
                deleteConfirm: string,
                errorNotSameUser: string,
                errorTimeout: string,
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
                optionAdd: string
                optionRemove: string
                createBtn: string
                maxCountExceeded: string
                emptyField: string
                editableAfterCreation: string
                notEditableAfterCreation: string
            }
            list: {
                lastUpdate: (timeString: string) => string,
                createBtn: string
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
                description: string
                join: {
                    button: string
                    note: string
                }
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
    notifications: {
        "notification.server.backend.update": string
        "notification.server.backend.update.title": string
        "notification.poll.delete": string
        "notification.poll.edited": string
        "notification.poll.archived": string
        "notification.user.added": string
        "notification.user.removed": string
        "notification.vote.change": string,
        preferences:{
            title: string
            voteChange: string,
            userAdded: string,
            userRemoved: string,
            pollDeleted: string,
            pollEdited: string,
            pollArchived: string,
        }
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
export function getSystemLanguage(): languageData {
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

