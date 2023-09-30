import { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "net.mt32.expoll",
  appName: "expoll-client",
  webDir: "dist",
  server: {
    androidScheme: "http",
    cleartext: true,
    //hostname: "expoll.mt32.net",
    allowNavigation: ["expoll.mt32.net", "localhost", "*.google.com", "*.apple.com", "192.*"]
  },
  overrideUserAgent: "androidApp",
  loggingBehavior: "debug"
}

export default config
