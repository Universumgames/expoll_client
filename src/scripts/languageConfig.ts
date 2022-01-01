import { languageData } from "./languageConstruct"

export const languageList: languageData[] = [
    {
        id: 0,
        name: "english",
        short: "EN",
        uiElements: {
            navigation: {
                polls: "Polls",
                home: "Home"
            },
            login: {
                loggedInAs: (username: string) => "Logged in as " + username,
                notLoggedIn: "Not logged in",
                loginLink: "Login",
                loginFirst: "You first need to login",
                form: {
                    loggingIn: "Loggin in... this may take a few seconds",
                    login: "Login",
                    requestMail: "Request login mail",
                    requestBtn: "Request",
                    mail: "Mail address",
                    loginKey: "loginKey",
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
                        "An email has been sent to your mail address with an login link, " +
                        "receiving may take some minutes",
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
                    createBtn: "Create poll",
                    maxCountExceeded: "You have already created too much polls",
                    emptyField: "This field shouldn't be empty"
                },
                list: {
                    lastUpdate: (timeString: string) => "Last update on " + timeString
                },
                details: {
                    createdBy: (username: string) => "Created by " + username,
                    userCol: "User",
                    pollName: "Name",
                    maxPerUserVoteCount: "Maximum number of votes each user can do (-1 for infinity)",
                    dateStringFormat: (start?: string, end?: string) =>
                        "from " + start + (end != undefined ? " \nto " + end : ""),
                    save: "save",
                    cancel: "cancel",
                    delete: "delete",
                    deleteConfirm: (value: string) => "Are you sure you want to delete " + value,
                    deletePollBtn: "Delete poll",
                    deletePollConfirm: "Are you sure you want to delete this poll, this cannot be undone",
                    deletePollConfirmConfirm: "Are you REALLY sure you want to delete this poll, it cannot be undone",
                    errorMsgs: {
                        tooMuchVotes: "Too much options chosen, deselect one first"
                    }
                }
            },
            serverError: "An error on our side occured",
            dateToString: (d?: Date) =>
                d?.getFullYear() +
                    "-" +
                    (d?.getMonth() ?? 0 + 1).toString().padStart(2, "0") +
                    "-" +
                    d?.getDay().toString().padStart(2, "0") ?? "",
            dateTimeToString: (dt?: Date) =>
                dt?.getFullYear() +
                    "-" +
                    (dt?.getMonth() ?? 0 + 1).toString().padStart(2, "0") +
                    "-" +
                    dt?.getDate().toString().padStart(2, "0") +
                    " " +
                    dt?.getHours().toString().padStart(2, "0") +
                    ":" +
                    dt?.getMinutes().toString().padStart(2, "0") ?? ""
        }
    },
    {
        id: 1,
        name: ["deutsch", "german"],
        short: "DE",
        uiElements: {
            navigation: {
                polls: "Umfragen",
                home: "Startseite"
            },
            login: {
                loggedInAs: (username: string) => "Angemeldet als " + username,
                notLoggedIn: "Nicht angemeldet",
                loginLink: "Anmelden",
                loginFirst: "Du musst dich zuerst anmedlen",
                form: {
                    loggingIn: "Anmelden... dies kann einen Moment dauern",
                    login: "Anmelden",
                    requestMail: "Anmeldelink per Email anfragen",
                    requestBtn: "Anfragen",
                    mail: "E-Mail Adresse",
                    loginKey: "Anmeldeschlüssel (loginKey)",
                    loginBtn: "Anmelden",
                    loginMailOrKeyMissing:
                        "Es muss entweder eine Mail addresse für einen Anmeldelink " +
                        "oder ein Anmeldeschlüssel angegeben werden",
                    signup: "Registrieren",
                    firstName: "Vorname",
                    lastName: "Nachname",
                    username: "Bentutzername",
                    validMailNeeded: "Ein gültige E-Mail adresse wird benötigt",
                    firstNameNeeded: "Dein Vorname muss angegeben werden",
                    lastNameNeeded: "Dein Nachname wird benötigt",
                    usernameNeeded: "Du musst einen Benutzernamen angeben",
                    signupBtn: "Registrieren"
                },
                alreadyLoggedInAs: (username: string) => "Du bist bereits als " + username + " angemeldet",
                logoutBtn: "Abmelden",
                messages: {
                    loginKeyNotExist: "Der Anmeldeschlüssel ist nicht valide",
                    mailSent:
                        "Es wird ein E-Mail mit einem Anmeldeschlüssel versendet, " +
                        "dies kann einen kleinen augenblick in Anspruch nehmen",
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
                    createBtn: "Erstellen",
                    maxCountExceeded: "DU hast bereits zu viele Umfragen erstellt",
                    emptyField: "Dieses Feld darf nicht leer sein"
                },
                list: {
                    lastUpdate: (timeString: string) => "Zuletz aktualisiert am " + timeString
                },
                details: {
                    createdBy: (username: string) => "Erstellt von " + username,
                    userCol: "Benutzer",
                    pollName: "Name",
                    maxPerUserVoteCount: "Maximal Anzahl an ausgewählten Optionen (-1 für unendlich)",
                    dateStringFormat: (start?: string, end?: string) =>
                        "Von " + start + (end != undefined ? " \nbis " + end : ""),
                    save: "Speichern",
                    cancel: "Abbrechen",
                    delete: "Löschen",
                    deleteConfirm: (value: string) => "Willst du wirklich '" + value + "' unwiederruflich löschen?",
                    deletePollBtn: "Umfrage löschen",
                    deletePollConfirm:
                        "Sicher, dass du diese Umfrage löschen willst, dies kann nicht rückgängig gemacht werden",
                    deletePollConfirmConfirm:
                        "Bist du WIRLICH sicher, dass du diese Umfrage löschen willst, " +
                        "das Löschen kann icht rückgängig gemacht werden",
                    errorMsgs: {
                        tooMuchVotes: "Zu viele Optionen gewählt, wähle zuerst Optionen ab"
                    }
                }
            },
            serverError: "Ein Fehler beim Server ist aaufgetreten",
            dateToString: (d?: Date) =>
                d?.getDate().toString().padStart(2, "0") +
                    "." +
                    (d?.getMonth() ?? 0 + 1).toString().padStart(2, "0") +
                    "." +
                    d?.getFullYear() ?? "",
            dateTimeToString: (dt?: Date) =>
                dt?.getDate().toString().padStart(2, "0") +
                    "." +
                    (dt?.getMonth() ?? 0 + 1).toString().padStart(2, "0") +
                    "." +
                    dt?.getFullYear() +
                    " " +
                    dt?.getHours().toString().padStart(2, "0") +
                    ":" +
                    dt?.getMinutes().toString().padStart(2, "0") ?? ""
        }
    }
]
