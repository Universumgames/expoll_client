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
            home: `
# Expoll - Polling made easy

## Why expoll

Expoll is a voting website similar to other woll-known voting/polling websites. We tried to combine both in a neat small and easy-to-use website. Unlike the well-known platforms, who delete polls after a quite short time, or where you have to be logged in with an active session to even get the chance to vote for something withing a few minutes, we are trying to keep every vote possible (though probably have to restrict the creation of polls to about 5-10 per user at a time in the future).

## Features

The pages language changes automatically between german and english to best suit the browsers preferences. With expoll you are able to participate in as much polls as you like and create and maintain up to 10 polls at a time. When creating a new poll you can choose between a word poll and a date or date-time poll to suit best your usecase. Date (and date-time) polls have even the possibility to define a start and an end time.

## How to create a user and login

To participate in any poll you first have to sign up. To get to the signup page you can use the button in the top right corner of your screen. Over there you have to provide your "real" (as real as you like) a username and your mail address (unlike the name this should be correspond to a real address you have access to). It's important that you type the correct mail address because after creating a user you are automatically logged in, but to login on another browser you will have to provide your mail address and you will receive a login link to allow easy and password-less access to your polls.
`,
            login: {
                loggedInAs: (username: string) => "Logged in as " + username,
                notLoggedIn: "Not logged in",
                loginLink: "Login",
                loginFirst: "You first need to login",
                form: {
                    loggingIn: "Logging in... this may take a few seconds",
                    login: "Login",
                    advancedLogin: "Login with loginkey",
                    requestMail: "Request login mail",
                    requestBtn: "Request login mail",
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
                    quickLoginTitle: "Quick Login with security key",
                    quickLoginBtn: "Login with security key",
                    quickLoginNote:
                        "Only usable when setup with a security key or biometric authentication on this device",
                    leaveQuickLoginBtn: "Back to Nonmal Login",
                    or: "or",
                    invalidMail: "Invalid mail address"
                },
                alreadyLoggedInAs: (username: string) => "You are already logged in as " + username,
                logoutBtn: "Logout",
                messages: {
                    loginKeyNotExist: "Loginkey is invalid",
                    mailSent:
                        "An email has been sent to your mail address with an login link, " +
                        "receiving may take some minutes",
                    mailNotExist: "Mail address is not registered, please use a valid one or create a new user",
                    userExists: "Username or mail is already taken"
                },
                loggedIn: {
                    personalizedDBContent: "See what data of you is in our database",
                    viewAuth: "View Authenticators",
                    addAuth: "Add Authenticator",
                    authDisclaimer:
                        "Authenticators (like TouchID, Face recognition or security keys) allow an easy, " +
                        "secure and private way to login without requesting an email",
                    authEmpty: "No authenticator registered",
                    deleteAccount: "Delete your account",
                    activeSessions: "Active sessions",
                    deleteSessionPrompt: "Do you want to delete this session?",
                    logoutAllPrompt: "Do you want to logout everywhere (Authenticators will not be deleted)?"
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
                    emptyField: "This field shouldn't be empty",
                    editableAfterCreation: "You can edit this option after creation",
                    notEditableAfterCreation: "You can't edit this option after saving"
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
            home: `
# Expoll - Umfragen einfach gemacht

## Warum expoll

Expoll ist eine super simple Abstimmungsplattform ähnlich wie bekannte Umfrageplatformen. Wir versuchen hier beide Lösungen zu einer kleinen, einfach verwendbaren Webseite zu kombinieren. Anders als andere Plattformen, wo Umfragen nach realtiv kurzer Inaktivität gelöscht werden oder man zum Zeitpunkt der Umfrage angemeldet und online sein muss, versuchen wir jede Umfrage so lange wie möglich am laufen zu lassen.

## Was kann expoll

Die Seite passt sich automatisch der des Geräts voreingestellte Sprache an (unterschieden wird derzeit ziwschen Deutsch und Englisch) an. Mit Expoll hast du die Möglichkeit an so vielen Umfragen wie du möchtest teilzunehmen und bis zu 10 Umfragen gleichzeitig als Eigentümer zu besitzen. Beim Erstellen einer Neuen Umfrage kannst du derzeit wählen aus drei Arten: Wort, Datum und Zeit(+Datum) um die Umfrage bestmöglich an deine Bedürfnisse anzupassen.

## Benutzer erstellen und anmelden

Um an einer Umfrage teilnehmen zu können musst du dich zunächst anmelden. Hierzu einfach auf den Knopf oben rechts in der Ecke klicken. Auf deiser Seite musst du dann auf der Registrierungsmaske (rechts) deinen Namen, einen Benutzername und, ganz wichtig, deine E-Mail addresse angeben. Es ist wichtig,d ass du eine gültige und für dich dauerhaft erreichbare Mail angibst (also keine Wegwerf Mail oder so) da diese im weiteren zur Passwortlosen Anmeldung verwendet wird. Beim anmelden auf einem neuen Gerät fordest du dann auf der linken Seite eine Anmeldemail an und ein passender Link wird dir in kürze zugesendet, so musst du dir keine lästiges Password merken...
`,
            login: {
                loggedInAs: (username: string) => "Angemeldet als " + username,
                notLoggedIn: "Nicht angemeldet",
                loginLink: "Anmelden",
                loginFirst: "Du musst dich zuerst anmelden",
                form: {
                    loggingIn: "Anmelden... dies kann einen Moment dauern",
                    login: "Anmelden",
                    advancedLogin: "Login mit loginkey",
                    requestMail: "Anmeldelink per Email anfragen",
                    requestBtn: "Login-Mail Anfragen",
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
                    quickLoginBtn: "Anmeldung mit Security key",
                    quickLoginNote:
                        "Nur verwendbar wenn Anmeldung mit Security Key oder biometrischer Authentifizierung aufgesetzt ist",
                    leaveQuickLoginBtn: "Zurück zur normalen Anmeldung",
                    or: "oder",
                    invalidMail: "Ungültige Mail Adresse"
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
                    deleteAccount: "Account löschen",
                    activeSessions: "Aktive Sitzungen",
                    deleteSessionPrompt: "Möchtest du diese Sitzung wirklich löschen?",
                    logoutAllPrompt: "Möchtest du dich wirklich überall abmelden?"
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
                        dateTimeOption: "Datums- und Zeit Umfrage"
                    },
                    optionList: "Optionen Liste",
                    optionListAddOption: "Option hinzufügen",
                    optionName: (id: number) => "Option Nr. " + id,
                    optionValue: "Wert",
                    optionOptEndValue: "Optionales Ende",
                    createBtn: "Erstellen",
                    maxCountExceeded: "Du hast bereits zu viele Umfragen erstellt",
                    emptyField: "Dieses Feld darf nicht leer sein",
                    editableAfterCreation: "Die Option kann nach dem Erstellen noch bearbeitet werden",
                    notEditableAfterCreation: "Die Option kann nach dem Erstellen nicht mehr bearbeitet werden"
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
