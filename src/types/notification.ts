export interface NotificationPreferences {
    voteChange: boolean
    userAdded: boolean
    userRemoved: boolean
    pollDeleted: boolean
    pollEdited: boolean
    pollArchived: boolean
}

/* eslint-disable no-unused-vars */
export enum NotificationType {
    voteChange = "voteChange",
    userAdded = "userAdded",
    userRemoved = "userRemoved",
    pollDeleted = "pollDeleted",
    pollEdited = "pollEdited",
    pollArchived = "pollArchived"
}