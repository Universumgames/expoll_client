import { languageData } from "./languageConstruct"

export const languageList: languageData[] = [
    {
        id: 0,
        name: "english",
        short: "EN",
        uiElements: {
            login: {
                loggedInAs: (username: string) => "Logged in as " + username,
                notLoggedIn: "Not logged in",
                loginLink: "Login",
                form: {
                    loggingIn: "Loggin in... this may take a few seconds",
                    login: "Login",
                    mail: "Mail address",
                    loginKey: "or a loginKey",
                    loginBtn: "Login",
                    loginMailOrKeyMissing: "You must either specify your mail address or a loginkey",
                    signup: "Signup",
                    firstName: "First name",
                    lastName: "Last name",
                    username: "Username",
                    validMailNeeded: "A valid mail address is needed",
                    firstNameNeeded: "Your first name must be specified",
                    lastNameNeeded: "Your last name must be specified",
                    usernameNeeded: "A valid username is needed",
                    signupBtn: "Signup"
                },
                alreadyLoggedInAs: (username: string) => "You are already logged in as " + username,
                logoutBtn: "Logout",
                messages: {
                    loginKeyNotExist: "Loginkey is invalid",
                    mailSent:
                        "An email has been sent to your mail address with an login link, receiving may take some minutes",
                    mailNotExist: "Mail address is not registered, please use a valid one or create a new user",
                    userExists: "Username is already taken"
                }
            },
            polls: {
                create: {
                    createPoll: (name: string) => 'Creating poll "' + name + '"',
                    pollNameInputLabel: "Poll name",
                    description: "Description",
                    maxVoteLabel: "Max number of votes per user (-1 for infinity)",
                    typeSelect: {
                        label: "Poll type",
                        stringOption: "Word poll",
                        dateOption: "Date poll",
                        dateTimeOption: "Date and Time poll"
                    },
                    optionList: "Option list",
                    optionListAddOption: "Add option",
                    optionName: (id: number) => "Option nr." + id,
                    optionValue: "Value",
                    optionOptEndValue: "Optional end value",
                    createBtn: "Create poll"
                },
                list: {
                    lastUpdate: (time: Date) => "Last update on " + time.toString()
                },
                details: {
                    userCol: "User",
                    pollName: "Name",
                    save: "save",
                    cancel: "cancel",
                    delete: "delete",
                    deleteConfirm: (value: string) => "Are you sure you want to delete " + value
                }
            },
            serverError: "An error on our side occured"
        }
    },
    {
        id: 1,
        name: ["deutsch", "german"],
        short: "DE",
        uiElements: {
            login: {
                loggedInAs: (username: string) => "Angemeldet als " + username,
                notLoggedIn: "Nicht angemeldet",
                loginLink: "Anmelden",
                form: {
                    loggingIn: "Anmelden... dies kann einen Moment dauern",
                    login: "Anmelden",
                    mail: "E-Mail Adresse",
                    loginKey: "oder ein Anmeldeschlüssel (loginKey)",
                    loginBtn: "Anmelden",
                    loginMailOrKeyMissing:
                        "Es muss entweder eine Mail addresse für einen Anmeldelink oder ein Anmeldeschlüssel angegeben werden",
                    signup: "Registrieren",
                    firstName: "Vorname",
                    lastName: "Nachname",
                    username: "Bentutzername",
                    validMailNeeded: "Ein gültige E-Mail adresse wird benötigt",
                    firstNameNeeded: "Dein Vroname muss angegeben werden",
                    lastNameNeeded: "Dein nachname wird benötigt",
                    usernameNeeded: "Du musst einen Benutzernamen angeben",
                    signupBtn: "Registrieren"
                },
                alreadyLoggedInAs: (username: string) => "Du bist bereits als " + username + " angemeldet",
                logoutBtn: "Abmelden",
                messages: {
                    loginKeyNotExist: "Der Anmeldeschlüssel ist nicht valide",
                    mailSent:
                        "Es wird ein E-Mail mit einem Anmeldeschlüssel versendet, dies kann einen kleinen augenblick in Anspruch nehmen",
                    mailNotExist: "Die E-Mail Adresse existiert nicht, jetzt registrieren und Benutzer erstellen",
                    userExists: "Ein anderer Benutzer mit dieser Email Adresse oder Benutzernamen existiert bereits"
                }
            },
            polls: {
                create: {
                    createPoll: (name: string) => 'Erstellen der Umfrage "' + name + '"',
                    pollNameInputLabel: "Umfragenname",
                    description: "Beschreibung",
                    maxVoteLabel: "Maximale Anzahl an Stimmen pro Benutzer (-1 für unendlich)",
                    typeSelect: {
                        label: "Umfragentype auswählen",
                        stringOption: "Wortumfrage",
                        dateOption: "Datumsumfrage",
                        dateTimeOption: "DAtums- und Zeit Umfrage"
                    },
                    optionList: "Optionen Liste",
                    optionListAddOption: "Option hinzufügen",
                    optionName: (id: number) => "Option Nr. " + id,
                    optionValue: "Wert",
                    optionOptEndValue: "Optionales Ende",
                    createBtn: "Erstellen"
                },
                list: {
                    lastUpdate: (time: Date) => "Zuletz aktualisiert am " + time.toString()
                },
                details: {
                    userCol: "Benutzer",
                    pollName: "Name",
                    save: "Speichern",
                    cancel: "Abbrechen",
                    delete: "Löschen",
                    deleteConfirm: (value: string) => "WIllst du wirklich '" + value + "' unwiederruflich löschen?"
                }
            },
            serverError: "Ein Fehler beim Server ist aaufgetreten"
        }
    }
]
