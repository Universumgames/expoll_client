import { languageData } from "../languageConstruct"

const en: languageData = {
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

## Now as iOS App (beta)

![Logo](./app_icons/mac128.png)
Download and install the iOS App via TestFlight: [Get the App](/#/app)

## Why expoll

Expoll is a voting website similar to other well-known voting/polling websites. We tried to combine both in a neat small and easy-to-use website. Unlike the well-known platforms, who delete polls after a quite short time, or where you have to be logged in with an active session to even get the chance to vote for something withing a few minutes, we are trying to keep every vote possible (though probably have to restrict the creation of polls to about 5-10 per user at a time in the future).

## Features

The pages language changes automatically between german and english to best suit the browsers preferences. With expoll you are able to participate in as much polls as you like and create and maintain up to 10 polls at a time. When creating a new poll you can choose between a word poll and a date or date-time poll to suit best your usecase. Date (and date-time) polls have even the possibility to define a start and an end time.

## How to create a user and login

To participate in any poll you first have to sign up. To get to the signup page you can use the button in the top right corner of your screen. Over there you have to provide your "real" (as real as you like) a username and your mail address (unlike the name this should be correspond to a real address you have access to). It's important that you type the correct mail address because after creating a user you are automatically logged in, but to login on another browser you will have to provide your mail address and you will receive a login link to allow easy and password-less access to your polls.
`,
        appInstall: {
            title: "Install the iOS App",
            belowImage: `
## Step 1: Install TestFlight
[![Testflight](https://developer.apple.com/assets/elements/icons/testflight/testflight-64x64.png)
Open in the AppStore
](https://apps.apple.com/de/app/testflight/id899247664)

## Step 2: Join the Expoll Beta
Join the Beta via TestFlight and install the app: [https://testflight.apple.com/join/OpUycQnW](https://testflight.apple.com/join/OpUycQnW)
`
        },
        login: {
            loggedInAs: (username: string) => "Logged in as " + username,
            loggedInText: "Account",
            notLoggedIn: "Not logged in",
            loginLink: "Login",
            loginFirst: "You first need to login",
            form: {
                loggingIn: "Logging in... this may take a few seconds",
                login: "Login",
                advancedLogin: "Login with OTP",
                requestMail: "Request OTP mail",
                requestBtn: "Request OTP mail",
                mail: "Mail address",
                otp: "OTP",
                loginBtn: "Login",
                otpQuestionAlert: "To login you need to provide your mail address. When the mail address exists you will receive a mail with a one time password otherwise you can create a new account.",
                loginMailOrOTPMissing: "You must either specify your mail address or a one time password",
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
                quickLoginNote: "Only usable when setup with a security key or biometric authentication on this device",
                leaveQuickLoginBtn: "Back to Normal Login",
                or: "or",
                invalidMail: "Invalid mail address",
                oidc: "Third party login",
                tryOtherMail: "Try another mail address",
                emailNotExistSignupRequired: "The mail address is not registered, please use a valid one or create a new user"
            },
            alreadyLoggedInAs: (username: string) => "You are already logged in as " + username,
            logoutBtn: "Logout",
            messages: {
                otpNotExist: "OTP is invalid",
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
                logoutAllPrompt: "Do you want to logout everywhere (Authenticators will not be deleted)?",
                oidcLogins: "Third party logins",
                loginAppBtn: "Login in App",
                editUsernamePrompt: "Edit your username",
                editFirstNamePrompt: "Edit your first name",
                editLastNamePrompt: "Edit your last name",
                oidcConnectionNote: "Add alternative login methods to sign in quicker",
                createdOn: "Account created on"
            },
            userAccountDeletion: {
                disclaimer: "This will delete your account and all data associated with it. This cannot be undone.",
                deleteBtn: "Delete account",
                cancelBtn: "Cancel",
                deleteConfirm: "Are you sure you want to delete your account?",
                errorNotSameUser: "You can only delete your own account. Login as the user you want to delete first.",
                errorTimeout: "You took too long to confirm the deletion. Please try again."
            }
        },
        polls: {
            create: {
                createPoll: (name: string) => "Creating poll \"" + name + "\"",
                pollNameInputLabel: "Poll name",
                description: "Description (65535 characters max)",
                maxVoteLabel: "Max number of votes per user (-1 for infinity)",
                allowsMaybeLabel: "\"Maybe\" as Vote allowed",
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
                optionAdd: "Add option +",
                optionRemove: "Remove",
                createBtn: "Create poll",
                maxCountExceeded: "You have already created too much polls",
                emptyField: "This field shouldn't be empty",
                editableAfterCreation: "You can edit this option after creation",
                notEditableAfterCreation: "You can't edit this option after saving"
            },
            list: {
                lastUpdate: (timeString: string) => "Last update on " + timeString,
                createBtn: "Create poll"
            },
            details: {
                createdBy: (username: string) => "Created by " + username,
                userCol: "User",
                userNotesByAdmin: (note?: string) => (note == undefined ? "" : "(Note: " + note + ")"),
                pollName: "Name",
                maxPerUserVoteCount: "Maximum number of votes each user can do",
                maxPerUserVoteCountDescription: "(-1 for infinity)",
                dateStringFormat: (start?: string, end?: string) => {
                    if (end != undefined) return "From " + start + " to " + end
                    return "On " + start
                },
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
                leaveConfirm: "Sure you want to leave this poll?",
                kickFromPollBtn: "Kick User",
                kickConfirm: (username: string) =>
                    "Sure you want to kick " + username + " from this poll ( votes will remain and stay saved for when the user rejoins)?",
                editingDisabled: "Editing is disabled by the admin",
                addUserBtn: "Add user",
                description: "Description"
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
            d?.toLocaleString(undefined, { dateStyle: "long" }) ?? "",
        dateTimeToString: (dt?: Date) =>
            dt?.toLocaleString(undefined, { timeStyle: "short", dateStyle: "long" }) ?? ""
    }
}

export default en