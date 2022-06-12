import { languageData } from "./languageConstruct"

export const languageList: languageData[] = [
    {
        id: 0,
        name: ["English"],
        short: "EN",
        uiElements: {
            navigation: {
                polls: "Polls",
                home: "Home",
                changeLanguageButton: "Change language",
                privacyPolicy: "Privacy Policy",
                siteNotice: "Site Notice"
            },
            login: {
                loggedInAs: (username: string) => "Logged in as " + username,
                notLoggedIn: "Not logged in",
                loginLink: "Login",
                loginFirst: "You first need to login",
                form: {
                    loggingIn: "Logging in... this may take a few seconds",
                    login: "Login",
                    advancedLogin: "Advanced Login",
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
                    signupBtn: "Signup",
                    quickLoginTitle: "Quick Login",
                    quickLoginBtn: "Quicklogin",
                    leaveQuickLoginBtn: "Normal Login",
                    or: "or"
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
                },
                loggedIn: {
                    personalizedDBContent: "See what data of you is in our database",
                    viewAuth: "View Authenticators",
                    addAuth: "Add Authenticator",
                    authDisclaimer:
                        "Authenticators (like TouchID, Face recognition or security keys) allow an easy, " +
                        "secure and private way to login without requesting an email",
                    authEmpty: "No authenticator registered",
                    deleteAccount: "Delete your account"
                }
            },
            polls: {
                create: {
                    createPoll: (name: string) => 'Creating poll "' + name + '"',
                    pollNameInputLabel: "Poll name",
                    description: "Description (255 characters max)",
                    maxVoteLabel: "Max number of votes per user (-1 for infinity)",
                    allowsMaybeLabel: '"Maybe" as Vote allowed',
                    allowsEditingLabel: "Allow editing votes and options",
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
                    userNotesByAdmin: (note?: string) => (note == undefined ? "" : "(Note: " + note + ")"),
                    pollName: "Name",
                    maxPerUserVoteCount: "Maximum number of votes each user can do",
                    maxPerUserVoteCountDescription: "(-1 for infinity)",
                    dateStringFormat: (start?: string, end?: string) =>
                        start + (end != undefined ? " \nto " + end : ""),
                    save: "save",
                    cancel: "cancel",
                    delete: "delete",
                    deleteConfirm: (value: string) => "Are you sure you want to delete " + value,
                    deletePollBtn: "Delete poll",
                    deletePollConfirm: "Are you sure you want to delete this poll, this cannot be undone",
                    deletePollConfirmConfirm: "Are you REALLY sure you want to delete this poll, it cannot be undone",
                    errorMsgs: {
                        tooMuchVotes: "Too much options chosen, deselect one first"
                    },
                    leavePollBtn: "Delete own votes and leave",
                    leaveConfirm:
                        "Sure you want to delete your votes and leave this poll (your votes will be deleted)?",
                    kickFromPollBtn: "Kick",
                    kickConfirm: (username: string) =>
                        "Sure you want to kick " +
                        username +
                        " from this poll (all votes will be deleted from this user)?",
                    editingDisabled: "Editing is disabled by the admin"
                },
                votes: {
                    yes: "Yes",
                    no: "No",
                    unknown: "Unknown",
                    maybe: "Maybe"
                }
            },
            serverError: "An error on our side occurred",
            dateToString: (d?: Date) =>
                d?.getFullYear() +
                    "-" +
                    ((d?.getMonth() ?? 0) + 1).toString().padStart(2, "0") +
                    "-" +
                    d?.getDate().toString().padStart(2, "0") ?? "",
            dateTimeToString: (dt?: Date) =>
                dt?.getFullYear() +
                    "-" +
                    ((dt?.getMonth() ?? 0) + 1).toString().padStart(2, "0") +
                    "-" +
                    dt?.getDate().toString().padStart(2, "0") +
                    " at " +
                    dt?.getHours().toString().padStart(2, "0") +
                    ":" +
                    dt?.getMinutes().toString().padStart(2, "0") ?? ""
        }
    },
    {
        id: 1,
        name: ["Deutsch", "German"],
        short: "DE",
        uiElements: {
            navigation: {
                polls: "Umfragen",
                home: "Startseite",
                changeLanguageButton: "Sprache ändern",
                privacyPolicy: "Privatsphäre",
                siteNotice: "Impressum"
            },
            login: {
                loggedInAs: (username: string) => "Angemeldet als " + username,
                notLoggedIn: "Nicht angemeldet",
                loginLink: "Anmelden",
                loginFirst: "Du musst dich zuerst anmelden",
                form: {
                    loggingIn: "Anmelden... dies kann einen Moment dauern",
                    login: "Anmelden",
                    advancedLogin: "Erweiterter Login",
                    requestMail: "Anmeldelink per Email anfragen",
                    requestBtn: "Anfragen",
                    mail: "E-Mail Adresse",
                    loginKey: "Anmeldeschlüssel (loginKey)",
                    loginBtn: "Anmelden",
                    loginMailOrKeyMissing:
                        "Es muss entweder eine Mail Adresse für einen Anmeldelink " +
                        "oder ein Anmeldeschlüssel angegeben werden",
                    signup: "Registrieren",
                    firstName: "Vorname",
                    lastName: "Nachname",
                    username: "Benutzername",
                    validMailNeeded: "Ein gültige E-Mail Adresse wird benötigt",
                    firstNameNeeded: "Dein Vorname muss angegeben werden",
                    lastNameNeeded: "Dein Nachname wird benötigt",
                    usernameNeeded: "Du musst einen Benutzernamen angeben",
                    signupBtn: "Registrieren",
                    quickLoginTitle: "Schnell Anmeldung",
                    quickLoginBtn: "Schnell Anmeldung",
                    leaveQuickLoginBtn: "Normale Anmeldung",
                    or: "oder"
                },
                alreadyLoggedInAs: (username: string) => "Du bist bereits als " + username + " angemeldet",
                logoutBtn: "Abmelden",
                messages: {
                    loginKeyNotExist: "Der Anmeldeschlüssel ist nicht valide",
                    mailSent:
                        "Es wird ein E-Mail mit einem Anmeldeschlüssel versendet, " +
                        "dies kann einen kleinen Augenblick in Anspruch nehmen",
                    mailNotExist: "Die E-Mail Adresse existiert nicht, jetzt registrieren und Benutzer erstellen",
                    userExists: "Ein anderer Benutzer mit dieser Email Adresse oder Benutzernamen existiert bereits"
                },
                loggedIn: {
                    personalizedDBContent: "Die persönlichen Daten, die wir über dich haben",
                    viewAuth: "Authentikatoren ansehen",
                    addAuth: "Authentikator hinzufügen",
                    authDisclaimer:
                        "Mittels Authentifikatoren auf einem Gerät (Beispielsweise TouchID oder " +
                        "Gesichtserkennung aber auch Security Keys) kann sich einfach und sicher " +
                        "ohne Email angemeldet werden",
                    authEmpty: "Kein Authentifikator vorhanden",
                    deleteAccount: "Account löschen"
                }
            },
            polls: {
                create: {
                    createPoll: (name: string) => 'Erstellen der Umfrage "' + name + '"',
                    pollNameInputLabel: "Umfragenname",
                    description: "Beschreibung (maximal 255 Zeichen)",
                    maxVoteLabel: "Maximale Anzahl an Stimmen pro Benutzer (-1 für unendlich)",
                    allowsMaybeLabel: '"Vielleicht" als Auswahl erlaubt',
                    allowsEditingLabel: "Umfrage bearbeitbar",
                    typeSelect: {
                        label: "Umfragentyp auswählen",
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
                    lastUpdate: (timeString: string) => "Zuletzt aktualisiert am " + timeString
                },
                details: {
                    createdBy: (username: string) => "Erstellt von " + username,
                    userCol: "Benutzer",
                    userNotesByAdmin: (note?: string) => (note == undefined ? "" : "(Notiz: " + note + ")"),
                    pollName: "Name",
                    maxPerUserVoteCount: "Maximal Anzahl an ausgewählten Optionen",
                    maxPerUserVoteCountDescription: "(-1 für unendlich)",
                    dateStringFormat: (start?: string, end?: string) => {
                        return start + (end != undefined ? " \nbis " + end : "")
                    },
                    save: "Speichern",
                    cancel: "Abbrechen",
                    delete: "Löschen",
                    deleteConfirm: (value: string) => "Willst du wirklich '" + value + "' unwiderruflich löschen?",
                    deletePollBtn: "Umfrage löschen",
                    deletePollConfirm:
                        "Sicher, dass du diese Umfrage löschen willst, dies kann nicht rückgängig gemacht werden",
                    deletePollConfirmConfirm:
                        "Bist du WIRKLICH sicher, dass du diese Umfrage löschen willst, " +
                        "das Löschen kann nicht rückgängig gemacht werden",
                    errorMsgs: {
                        tooMuchVotes: "Zu viele Optionen gewählt, wähle zuerst Optionen ab"
                    },
                    leavePollBtn: "Stimmen löschen und Umfrage verlassen",
                    leaveConfirm:
                        "Sicher, dass du deine Stimmen löschen und diese Umfrage " +
                        "verlassen willst (deine Stimmen werden gelöscht)?",
                    kickFromPollBtn: "Kick",
                    kickConfirm: (username: string) =>
                        "Sicher, dass du " + username + " rauswerfen willst (die Stimmen werden gelöscht)?",
                    editingDisabled: "Das Bearbeiten ist durch den Admin deaktiviert"
                },
                votes: {
                    yes: "Ja",
                    no: "Nein",
                    unknown: "Unbekannt",
                    maybe: "Vielleicht"
                }
            },
            serverError: "Ein Fehler beim Server ist aufgetreten",
            dateToString: (d?: Date) =>
                d?.getDate().toString().padStart(2, "0") +
                    "." +
                    ((d?.getMonth() ?? 0) + 1).toString().padStart(2, "0") +
                    "." +
                    d?.getFullYear() ?? "",
            dateTimeToString: (dt?: Date) =>
                dt?.getDate().toString().padStart(2, "0") +
                    "." +
                    ((dt?.getMonth() ?? 0) + 1).toString().padStart(2, "0") +
                    "." +
                    dt?.getFullYear() +
                    " um " +
                    dt?.getHours().toString().padStart(2, "0") +
                    ":" +
                    dt?.getMinutes().toString().padStart(2, "0") ?? ""
        }
    }
]
