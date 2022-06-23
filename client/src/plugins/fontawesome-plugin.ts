import _Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// TODO: update icons

//
// Import brands ~ https://fontawesome.com/icons?d=gallery&s=brands
//
import {
  faTwitter,
  faFacebookF,
  faInstagram,

  // AddToCalendarDialog
  faGoogle,
} from '@fortawesome/free-brands-svg-icons'

//
// Import solids ~ https://fontawesome.com/icons?d=gallery&s=solid
//
import {
  // BackButton + JoinSession + MiniSession
  faArrowLeft,
  faArrowRight,

  // PrimaryEmbed + SecondaryEmbed
  faVideo,

  // NavigationBar + AttendanceSection + InterestSection
  faUser,

  // faUsers,

  // SessionAttributes + SessionHeader
  faCodeBranch,

  // SessionAttributes + SessionHeader
  faTags,

  // SessionAttributes + LanguageWarning
  faGlobe,

  // SessionAttributes
  faSave,

  // SessionAttributes
  faIdBadge,

  // AddToCalendar + AddToCalendarDialog
  faCalendarPlus,

  // NoResults
  faSearch,

  // ColorWidget
  faChevronLeft,
  faChevronRight,

  // AttendanceSection + InterestSection
  faTimes,

  // InterestSection + AttendanceSection
  faUserPlus,

  // SessionState
  faCircle,

  // SessionState
  faExclamationTriangle,

  // SessionState
  faFire,

  // TimeSlot
  faLongArrowAltRight,
  faLongArrowAltLeft,

  // DevControl
  faTerminal,
  faClock,
  faForward,
  faFastForward,
  faBackward,
  faFastBackward,
  faPlay,
  faStop,

  // AtriumView
  faEnvelope,
  faTicketAlt,

  // <types>
  faComments,
  faObjectGroup,
  // faPeopleArrows,
  faShareAlt,
  faPalette,
  faMicrophone,
  faUsers,
  faCopy,

  // AppLoading
  faSync,
} from '@fortawesome/free-solid-svg-icons'

//
// Import regulars ~ https://fontawesome.com/icons?d=gallery&s=regular
//
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons'

//
// Apply icons
// prettier-ignore
//
library.add(
  farCircle, faTwitter, faArrowLeft, faArrowRight, faVideo, faUser, faCodeBranch, faTags, faGlobe, faSave, faIdBadge, faCalendarPlus, faSearch, faChevronLeft, faChevronRight, faTimes, faUserPlus, faCircle, faExclamationTriangle, faFire, faLongArrowAltRight, faLongArrowAltLeft, faTerminal, faClock, faForward, faFastForward, faBackward, faFastBackward, faPlay, faStop, faEnvelope, faTicketAlt, faComments, faObjectGroup, faShareAlt, faPalette, faSync,  faGoogle, faMicrophone, faUsers, faFacebookF, faInstagram, faCopy
)

//
// A plugin to register the fontawesome icon component
//
export class FontawesomePlugin {
  static install(Vue: typeof _Vue): void {
    Vue.component('fa-icon', FontAwesomeIcon)
  }
}
