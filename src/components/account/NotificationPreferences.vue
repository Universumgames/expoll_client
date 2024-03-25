<template>
    <div id="notificationPreferencesContainer">
        <b>{{ language.notifications.preferences.title }}</b>
        <div v-if="notificationPreferences != undefined" id="notificationPreferencesList">
            <template v-for="preference in notifications" :key="preference.key">
                <div class="notificationPreference">
                    <label>{{ preference.name }}</label>
                    <toggle-switch
                        v-model="notificationPreferences[preference.key]"
                        @change="saveNotifications"
                    />
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { languageData } from "@/scripts/languageConstruct"
import { computed, onMounted, ref } from "vue"
import * as user from "@/scripts/user"
import ToggleSwitch from "@/components/utils/ToggleSwitch.vue"
import { NotificationPreferences, NotificationType } from "@/types/notification"
import { IUser } from "@/types/bases"

const props = defineProps<{ userData: IUser, language: languageData }>()

const notificationPreferences = ref<NotificationPreferences>()

const notifications = computed(()=>[
    {
        name: props.language.notifications.preferences.voteChange,
        key: NotificationType.voteChange
    },
    {
        name: props.language.notifications.preferences.userAdded,
        key: NotificationType.userAdded
    },
    {
        name: props.language.notifications.preferences.userRemoved,
        key: NotificationType.userRemoved
    },
    {
        name: props.language.notifications.preferences.pollDeleted,
        key: NotificationType.pollDeleted
    },
    {
        name: props.language.notifications.preferences.pollEdited,
        key: NotificationType.pollEdited
    },
    {
        name: props.language.notifications.preferences.pollArchived,
        key: NotificationType.pollArchived
    }
])

onMounted(async () => {
    await loadNotifications()
})

const loadNotifications = async () => {
    notificationPreferences.value = await user.getNotificationPreferences()
}

const saveNotifications = async () => {
    if(notificationPreferences.value == undefined) return
    await user.setNotificationPreferences(notificationPreferences.value)
    loadNotifications()
}
</script>


<style >
#notificationPreferencesContainer{
  background-color: var(--secondary-color);
  padding: var(--default-padding);
  border-radius: var(--default-border-radius);
}

.notificationPreference{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 1rem;
}
</style>