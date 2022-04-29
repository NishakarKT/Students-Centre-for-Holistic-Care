import * as LINKS from "../../../constants/urls";
import * as IMAGES from "../../../constants/images";

const links = [
    {
        label: "Services",
        isDropdown: true,
        links: [
            {
                label: "Tele-Consultation",
                link: LINKS.TELE_CONSULTATION_URL,
            },
            {
                label: "Individual Consultation",
                link: LINKS.INDIVIDUAL_CONSULTATION_URL,
            },
            {
                label: "Crisis Intervention",
                link: LINKS.CRISIS_INTERVENTION_URL,
            },
            {
                label: "Group Counselling",
                link: LINKS.GROUP_COUNSELLING_URL,
            },
            {
                label: "Psychiatric Services",
                link: LINKS.PSYCHIATRIC_SERVICES_URL,
            },
            {
                label: "Gatekeeper's Training",
                link: LINKS.GATE_KEEPERS_TRAINING_URL,
            },
            {
                label: "Help A Friend",
                link: LINKS.HELP_A_FRIEND_URL,
            },
            {
                label: "After Hour Services",
                link: LINKS.AFTER_HOUR_SERVICES_URL,
            },
        ]
    },
    {
        label: "Reach Us",
        isDropdown: false,
        link: LINKS.REACH_US_URL,
    },
    {
        label: "FAQ",
        isDropdown: false,
        link: LINKS.FAQ_URL,
    },
    {
        label: "Events",
        isDropdown: true,
        links: [
            {
                label: "Happenings",
                link: LINKS.HAPPENINGS_URL,
            },
        ]
    },
    {
        label: "Insta-Links",
        isDropdown: true,
        links: [
            {
                label: "",
                link: LINKS.IWG_URL,
                logo: IMAGES.IWG_LOGO_PNG
            },
            {
                label: "",
                link: LINKS.SWG_URL,
                logo: IMAGES.SWG_LOGO_PNG
            },
            {
                label: "",
                link: LINKS.YOUR_DOST_URL,
                logo: IMAGES.YOURDOST_LOGO_PNG
            },
            {
                label: "",
                link: LINKS.MEDALL_URL,
                logo: IMAGES.MEDALL_LOGO_PNG
            },
            {
                label: "",
                link: LINKS.RCPSYCH_URL,
                logo: IMAGES.RCPSYCH_LOGO_PNG
            },
            {
                label: "",
                link: LINKS.PSA_URL,
                logo: IMAGES.PSA_LOGO_PNG
            },
            {
                label: "",
                link: LINKS.JED_URL,
                logo: IMAGES.JED_LOGO_PNG
            },
            {
                label: "",
                link: LINKS.MIGHTY_URL,
                logo: IMAGES.MIGHTY_LOGO_PNG
            },
        ]
    },
    {
        label: "Anecdotes",
        isDropdown: true,
        links: [
            {
                label: "Contemporary",
                link: LINKS.CONTEMPORARY_URL,
            },
            {
                label: "Theme Of The Month",
                link: LINKS.TOM_URL,
            },
            {
                label: "Rejoice",
                link: LINKS.REJOICE_URL,
            },
            {
                label: "Get Involved",
                link: LINKS.GET_INVOLVED_URL,
            },
            {
                label: "Think Globally",
                link: LINKS.THINK_GLOBALLY_URL,
            },
        ]
    },
    {
        label: "People",
        isDropdown: false,
        link: LINKS.PEOPLE_URL,
    },
]

export default links;