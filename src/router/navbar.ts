import ListIcon from '@/assetComponents/ListIcon.vue'
import HouseIcon from '@/assetComponents/HouseIcon.vue'
import AdminIcon from '@/assetComponents/AdminIcon.vue'
import ExpollStorage from '@/scripts/storage'
import AppStoreIcon from '@/assetComponents/AppStoreIcon.vue'
import type { languageData } from '@/scripts/languageConstruct'
import type { IUser } from '@/types/bases'
import UserIcon from '@/assetComponents/UserIcon.vue'
import { DisplaySize, isMobile } from '@/scripts/displayHelper'

interface Route {
  name: string
  path?: string
  url?: string
  vif?: boolean
  icon?: unknown
}

export function routes(props: {language: languageData, userData?: IUser, displaySize: DisplaySize}): Route[] {
  return [
    {
      name: props.language.uiElements.navigation.polls,
      path: '/polls',
      vif: props.userData != undefined,
      icon: ListIcon
    },
    {
      name: props.language.uiElements.navigation.home,
      path: '/',
      icon: HouseIcon,
      vif: (isMobile(props.displaySize) && props.userData == undefined) || !isMobile(props.displaySize)
    },
    {
      name: props.language.uiElements.login.loginLink,
      path: '/login',
      icon: UserIcon,
      vif: props.userData == undefined
    },
    {
      name: props.language.uiElements.login.loggedInText,
      path: '/account',
      icon: UserIcon,
      vif: props.userData != undefined
    },
    {
      name: 'Admin',
      path: '/admin',
      vif: props.userData?.admin ?? false,
      icon: AdminIcon
    },
    {
      name: 'iOS App',
      url: 'https://apps.apple.com/app/expoll/id1639799209',
      vif: !ExpollStorage.runsAsPWA() && ExpollStorage.showIOSAppBanner && ExpollStorage.isIOSOrMacoss,
      icon: AppStoreIcon
    }
  ]
}