import ExpollStorage from "@/scripts/storage"

export interface APIRequest{
    uri: string
    useAuth?: boolean
    options?: RequestInit
}

export function apiFetch(options: APIRequest): Promise<Response> {
    const headers = options.options?.headers || { "Authorization": "Bearer " + ExpollStorage.jwt }
    options.options = { ...options.options, headers }
    return window.fetch(ExpollStorage.backendAPIUrl + options.uri, options.options)
}