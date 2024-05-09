/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BACKEND_URL: string
  readonly VITE_APP_EXPOLL_PLATFORM_NAME: string
  readonly VITE_APP_APPLICATION_SERVER_KEY: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  env: ImportMetaEnv
}