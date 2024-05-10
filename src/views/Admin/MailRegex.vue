<template>
    <LoadingScreen v-if="loading" />
    <div v-if="!loading">
        <label>Regex count: {{ regex.length }}</label>
    </div>

    <!-- regex entries -->
    <div>
        <RegexTest
            v-for="reg of regex" :key="reg.regex"
            :reg="reg" @remove="removeRegex(reg.regex)"
            @update="update"
        />
    </div>

    <button @click="showNewRegex = !showNewRegex">
        New Regex Rule
    </button>

    <div v-show="showNewRegex">
        <label>New Regex:</label>
        <input v-model="newRegex" type="text">
        <label>Blacklist/Whitelist</label>
        <input v-model="newRegexBlacklist" type="checkbox">
        <button @click="addRegex">
            Add
        </button>
    </div>
</template>

<script setup lang="ts">
import type { languageData } from "@/scripts/languageConstruct"
import LoadingScreen from "@/components/utils/LoadingScreen.vue"
import RegexTest from "./RegexTest.vue"
import { getRegexAdmin, updateRegeAdmin } from "@/scripts/regex"
import { onMounted, ref } from "vue"
import type { MailRegexEntry } from '@/types/other'
import type { IUser } from '@/types/bases'

defineProps<{ userData?: IUser, language: languageData }>()

const regex = ref<MailRegexEntry[]>([])
const newRegex = ref<string>()
const newRegexBlacklist = ref(false)
const showNewRegex = ref(false)

const loading = ref(true)

const getData = async () => {
    regex.value = await getRegexAdmin()
    loading.value = false
}

const addRegex = async () => {
    if (newRegex.value == undefined || newRegex.value == "") {
        newRegex.value = undefined
        return
    }
    regex.value.push({
        regex: newRegex.value,
        blacklist: newRegexBlacklist.value
    })

    update()

    newRegex.value = undefined
}

const removeRegex = async (reg: string) => {
    await updateRegeAdmin(regex.value.filter((r) => r.regex != reg))

    await getData()
}

const update = async () => {
    await updateRegeAdmin(regex.value)
    await getData()
}

onMounted(() => {
    getData()
})
</script>
