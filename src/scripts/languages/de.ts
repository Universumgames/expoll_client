import { languageData } from "../languageConstruct"

const de: languageData = {
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

## Jetzt als iOS App (beta)

![Logo](./mac64.png)
Installiere jetzt die App auf deinen Geräten: [Hol dir die App](/#/app)

## Warum expoll

Expoll ist eine super simple Abstimmungsplattform ähnlich wie bekannte Umfrageplatformen. Wir versuchen hier beide Lösungen zu einer kleinen, einfach verwendbaren Webseite zu kombinieren. Anders als andere Plattformen, wo Umfragen nach realtiv kurzer Inaktivität gelöscht werden oder man zum Zeitpunkt der Umfrage angemeldet und online sein muss, versuchen wir jede Umfrage so lange wie möglich am laufen zu lassen.

## Was kann expoll

Die Seite passt sich automatisch der des Geräts voreingestellte Sprache an (unterschieden wird derzeit ziwschen Deutsch und Englisch) an. Mit Expoll hast du die Möglichkeit an so vielen Umfragen wie du möchtest teilzunehmen und bis zu 10 Umfragen gleichzeitig als Eigentümer zu besitzen. Beim Erstellen einer Neuen Umfrage kannst du derzeit wählen aus drei Arten: Wort, Datum und Zeit(+Datum) um die Umfrage bestmöglich an deine Bedürfnisse anzupassen.

## Benutzer erstellen und anmelden

Um an einer Umfrage teilnehmen zu können musst du dich zunächst anmelden. Hierzu einfach auf den Knopf oben rechts in der Ecke klicken. Auf deiser Seite musst du dann auf der Registrierungsmaske (rechts) deinen Namen, einen Benutzername und, ganz wichtig, deine E-Mail addresse angeben. Es ist wichtig,d ass du eine gültige und für dich dauerhaft erreichbare Mail angibst (also keine Wegwerf Mail oder so) da diese im weiteren zur Passwortlosen Anmeldung verwendet wird. Beim anmelden auf einem neuen Gerät fordest du dann auf der linken Seite eine Anmeldemail an und ein passender Link wird dir in kürze zugesendet, so musst du dir keine lästiges Password merken...
`,
        appInstall: {
            title: "Expoll App installieren",
            belowImage: `
## Schritt 1: TestFlight installieren
[![Testflight](https://developer.apple.com/assets/elements/icons/testflight/testflight-64x64.png)
Im AppStore öffnen
](https://apps.apple.com/de/app/testflight/id899247664)

## Schritt 2: Tritt der Expoll Beta bei

Tritt der Beta via TestFlight bei und installiere die App: [https://testflight.apple.com/join/OpUycQnW](https://testflight.apple.com/join/OpUycQnW)
`
        },
        login: {
            loggedInAs: (username: string) => "Angemeldet als " + username,
            notLoggedIn: "Nicht angemeldet",
            loginLink: "Anmelden",
            loginFirst: "Du musst dich zuerst anmelden",
            form: {
                loggingIn: "Anmelden... dies kann einen Moment dauern",
                login: "Anmelden",
                advancedLogin: "Login mit Einmalpasswort",
                requestMail: "Anmeldelink per Email anfragen",
                requestBtn: "Einmalpasswort Anfragen",
                mail: "E-Mail Adresse",
                otp: "Anmeldeschlüssel OTP",
                loginBtn: "Anmelden",
                otpQuestionAlert: "Du musst deine Mail Adresse angeben. Sollte die E-Mail Adresse bekannt sein, wird dir ein Einmalpasswort zugesendet anderfalls kannst du einen neuen account erstellen.",
                loginMailOrOTPMissing:
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
                invalidMail: "Ungültige Mail Adresse",
                oidc: "Anmelden mit Drittannbieter",
                tryOtherMail: "Versuche eine andere E-Mail Adresse",
                emailNotExistSignupRequired: "Die E-Mail Adresse existiert nicht, jetzt registrieren und Benutzer erstellen oder versuche eine andere E-Mail Adresse"
            },
            alreadyLoggedInAs: (username: string) => "Du bist bereits als " + username + " angemeldet",
            logoutBtn: "Abmelden",
            messages: {
                otpNotExist: "Der Anmeldeschlüssel ist nicht valide",
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
                logoutAllPrompt: "Möchtest du dich wirklich überall abmelden?",
                oidcLogins: "Anmeldungen mit Drittanbieter",
                loginAppBtn: "Anmelden in der App",
                editUsernamePrompt: "Benutzernamen ändern",
                editFirstNamePrompt: "Vorname ändern",
                editLastNamePrompt: "Nachname ändern"
            }
        },
        polls: {
            create: {
                createPoll: (name: string) => 'Erstellen der Umfrage "' + name + '"',
                pollNameInputLabel: "Umfragenname",
                description: "Beschreibung (maximal 65535 Zeichen)",
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
                editingDisabled: "Das Bearbeiten ist durch den Admin deaktiviert",
                addUserBtn: "Benutzer hinzufügen"
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

export default de