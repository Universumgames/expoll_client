let db: IDBDatabase | null = null
const dbVersion = 1

const keyValuesObjectStoreName = "keyValuePairs"

export default class Database {

    public static openDB(): Promise<IDBDatabase> {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const dbOpenRequest = indexedDB.open("expollDB", dbVersion)
            dbOpenRequest.onsuccess = function (event) {
                db = dbOpenRequest.result
                resolve(dbOpenRequest.result)
            }
            dbOpenRequest.onerror = function (event) {
                console.error("Error opening database.", event)
                reject(event)
            }
            dbOpenRequest.onupgradeneeded = function (event) {
                const db = dbOpenRequest.result

                const keyValues = db.createObjectStore(keyValuesObjectStoreName, { keyPath: "expoll_key" })
            }
        })
    }

    public static getKeyValue(key: string): Promise<any> {
        return new Promise<string | null>((resolve, reject) => {
            if (db == null) {
                reject("db is null")
                return
            }
            const transaction = db.transaction(keyValuesObjectStoreName, "readonly")
            const keyValuesObjectStore = transaction.objectStore(keyValuesObjectStoreName)
            const request = keyValuesObjectStore.get(key)
            request.onsuccess = function (event) {
                const result = request.result
                if (result == null) {
                    resolve(null)
                    return
                }
                resolve(result.expoll_value)
            }
            request.onerror = function (event) {
                reject(event)
            }
        })
    }

    public static setKeyValue(key: string, value: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (db == null) {
                reject("db is null")
                return
            }
            const transaction = db.transaction(keyValuesObjectStoreName, "readwrite")
            const keyValuesObjectStore = transaction.objectStore(keyValuesObjectStoreName)
            const request = keyValuesObjectStore.put({ expoll_key: key, expoll_value: value })
            request.onsuccess = function (event) {
                resolve()
            }
            request.onerror = function (event) {
                reject(event)
            }
        })
    }
}