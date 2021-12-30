export interface ReCaptchaInstance {
    ready: (cb: () => any) => void
    execute: (key: string, options: ReCaptchaExecuteOptions) => Promise<string>
    render: (id: string, options: ReCaptchaRenderOptions) => any
}

export interface ReCaptchaExecuteOptions {
    action: string
}

export interface ReCaptchaRenderOptions {
    sitekey: string
    size: "invisible"
}
