import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
    faAngleDoubleRight,
    faAngleDown,
    faAngleRight,
    faArrowsAltH,
    faArrowsAltV,
    faAsterisk,
    faBan,
    faBars,
    faBell,
    faBolt,
    faBookOpen,
    faBug,
    faBullseye,
    faCalculator,
    faCalendar,
    faCalendarAlt,
    faCartPlus,
    faChartBar,
    faChartLine,
    faCheck,
    faCheckCircle,
    faCheckDouble,
    faCheckSquare,
    faChevronCircleDown,
    faChevronCircleUp,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faCircle,
    faCircleNotch,
    faCircleNodes,
    faCode,
    faCodeBranch,
    faCoffee,
    faCog,
    faCogs,
    faColumns,
    faCopy,
    faCropAlt,
    faDatabase,
    faDollarSign,
    faDownload,
    faEdit,
    faEllipsisH,
    faEllipsisV,
    faEquals,
    faEraser,
    faExchangeAlt,
    faExclamation,
    faExclamationCircle,
    faExclamationTriangle,
    faExternalLinkAlt,
    faEye,
    faEyeSlash,
    faFileCode,
    faFillDrip,
    faFilter,
    faFlag,
    faFlask,
    faFont,
    faGlasses,
    faGripVertical,
    faHandPaper,
    faHashtag,
    faHistory,
    faHome,
    faImage,
    faInfo,
    faInfoCircle,
    faItalic,
    faLaptopCode,
    faLayerGroup,
    faLemon,
    faLightbulb,
    faLink,
    faList,
    faListAlt,
    faLock,
    faLockOpen,
    faMagic,
    faMedal,
    faMicroscope,
    faMinusCircle,
    faObjectGroup,
    faPalette,
    faPaste,
    faPauseCircle,
    faPen,
    faPenToSquare,
    faPlay,
    faPlus,
    faPowerOff,
    faPrescriptionBottle,
    faProjectDiagram,
    faQuestionCircle,
    faRedo,
    faRobot,
    faRocket,
    faRulerCombined,
    faSave,
    faShapes,
    faSearch,
    faSearchDollar,
    faServer,
    faShareAlt,
    faSort,
    faSortAlphaDown,
    faSortAlphaUp,
    faSortAmountDown,
    faSortAmountUp,
    faSpinner,
    faSquare,
    faStop,
    faStopCircle,
    faSync,
    faTable,
    faTasks,
    faTh,
    faTimes,
    faTimesCircle,
    faToggleOff,
    faToggleOn,
    faTrash,
    faTrophy,
    faUndoAlt,
    faUpload,
    faUser,
    faUserEdit,
    faUserLock,
    faVial,
    faVials,
    faWarehouse,
    faBox,
    faKey,
    faUserGroup,
    faCaretUp,
    faCaretDown,
    faArrowDown,
    faArrowUp,
    faCaretLeft,
    faCaretRight,
    faY,
    faX,
    faXmarkCircle,
    faHatWizard,
    faDroplet,
    faA,
    faMapLocationDot,
    faFileExport,
    faMaximize,
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faA,
    faAngleDoubleRight,
    faAngleDown,
    faAngleRight,
    faArrowDown,
    faArrowUp,
    faArrowsAltH,
    faArrowsAltV,
    faAsterisk,
    faBan,
    faBars,
    faBell,
    faBolt,
    faBookOpen,
    faBox,
    faBug,
    faBullseye,
    faCalculator,
    faCalendarAlt,
    faCalendar,
    faCaretDown,
    faCaretUp,
    faCaretLeft,
    faCaretRight,
    faCartPlus,
    faChartBar,
    faChartLine,
    faCheck,
    faCheckCircle,
    faCheckDouble,
    faCheckSquare,
    faChevronCircleDown,
    faChevronCircleUp,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faCircle,
    faCircleNodes,
    faCircleNotch,
    faCode,
    faCodeBranch,
    faCoffee,
    faCog,
    faCogs,
    faColumns,
    faCopy,
    faCropAlt,
    faDatabase,
    faDollarSign,
    faDownload,
    faDroplet,
    faEdit,
    faEquals,
    faEllipsisH,
    faEllipsisV,
    faEraser,
    faExclamation,
    faExclamationCircle,
    faExclamationTriangle,
    faFileExport,
    faExternalLinkAlt,
    faEye,
    faEyeSlash,
    faExchangeAlt,
    faFileCode,
    faFillDrip,
    faFilter,
    faFlag,
    faFlask,
    faFont,
    faGlasses,
    faGripVertical,
    faHandPaper,
    faHashtag,
    faHatWizard,
    faHistory,
    faHome,
    faImage,
    faInfo,
    faInfoCircle,
    faItalic,
    faKey,
    faLaptopCode,
    faLayerGroup,
    faLemon,
    faLightbulb,
    faLink,
    faList,
    faListAlt,
    faLock,
    faLockOpen,
    faMagic,
    faMapLocationDot,
    faMaximize,
    faMedal,
    faMicroscope,
    faMinusCircle,
    faObjectGroup,
    faPalette,
    faPaste,
    faPauseCircle,
    faPen,
    faPenToSquare,
    faPlay,
    faPlus,
    faPowerOff,
    faPrescriptionBottle,
    faProjectDiagram,
    faQuestionCircle,
    faRedo,
    faRobot,
    faRocket,
    faRulerCombined,
    faSave,
    faSearch,
    faServer,
    faSearchDollar,
    faShapes,
    faShareAlt,
    faSort,
    faSortAmountDown,
    faSortAmountUp,
    faSpinner,
    faSquare,
    faSortAlphaDown,
    faSortAlphaUp,
    faStop,
    faStopCircle,
    faSync,
    faTable,
    faTasks,
    faTh,
    faTimes,
    faTimesCircle,
    faToggleOff,
    faToggleOn,
    faTrash,
    faTrophy,
    faUndoAlt,
    faUpload,
    faUser,
    faUserEdit,
    faUserGroup,
    faUserLock,
    faVial,
    faVials,
    faWarehouse,
    faX,
    faXmarkCircle,
    faY,

);
/**
 * Allows DOM to change <i> tags to SVG for more features like layering
 * https://fontawesome.com/how-to-use/on-the-web/styling/layering
 */
//dom.watch();
