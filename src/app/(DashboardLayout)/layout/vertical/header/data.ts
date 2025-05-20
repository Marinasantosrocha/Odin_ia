import {
  IconMessage,
  IconUser,
  IconNotes,
  IconCalendarBolt,
  IconAddressBook,
  IconShoppingCart,
  IconMail,
  IconTicket,
  IconLayoutDashboard,
  IconSettings2,
  IconCirclesRelation,
  IconCalendar,
  IconSettings,
} from "@tabler/icons-react";

// Notifications dropdown

interface notificationType {
  title: string;
  subtitle: string;
  icon: string;
  bgcolor: string;
  color: string;
  time: string;
}

const notifications: notificationType[] = [
  {
    icon: "solar:widget-3-line-duotone",
    bgcolor: `primary.light`,
    color: "primary.main",
    title: "Launch Admin",
    subtitle: "Just see the my new admin!",
    time: "9:30 AM",
  },
  {
    icon: "solar:calendar-mark-line-duotone",
    bgcolor: `secondary.light`,
    color: "secondary.main",
    title: "Event Today",
    subtitle: "Just a reminder that you have event",
    time: "9:10 AM",
  },
  {
    icon: "solar:settings-minimalistic-line-duotone",
    bgcolor: `error.light`,
    color: "error.main",
    title: "Event Today",
    subtitle: "Just a reminder that you have event",
    time: "9:08 AM",
  },
  {
    icon: "solar:link-circle-line-duotone",
    bgcolor: `warning.light`,
    color: "warning.main",
    title: "Launch Today",
    subtitle: "Just see the my new admin!",
    time: "9:20 AM",
  },
  {
    icon: "solar:calendar-mark-line-duotone",
    bgcolor: `success.light`,
    color: "success.main",
    title: "Event Today",
    subtitle: "Just a reminder that you have event",
    time: "9:30 AM",
  },
  {
    icon: "solar:settings-minimalistic-line-duotone",
    bgcolor: `primary.light`,
    color: "primary.main",
    title: "Settings",
    subtitle: "You can customize this template.",
    time: "9:10 AM",
  },
];

// Messages dropdown

interface messageType {
  title: string;
  subtitle: string;
  avatar: string;
  time: string;
}

const messages: messageType[] = [
  {
    avatar: "/images/profile/user-1.jpg",
    title: "Mathew Anderson",
    subtitle: "Just see the my new admin!",
    time: "9:30 AM",
  },
  {
    avatar: "/images/profile/user-2.jpg",
    title: "Bianca Anderson",
    subtitle: "Just a reminder that you have event",
    time: "9:10 AM",
  },
  {
    avatar: "/images/profile/user-3.jpg",
    title: "Andrew Johnson",
    subtitle: "You can customize this template as you ...",
    time: "9:08 AM",
  },
  {
    avatar: "/images/profile/user-5.jpg",
    title: "Miyra Strokes",
    subtitle: "Just see the my new admin!",
    time: "9:30 AM",
  },
  {
    avatar: "/images/profile/user-6.jpg",
    title: "Mark, Stoinus & Rishvi..",
    subtitle: "Just a reminder that you have event",
    time: "9:10 AM",
  },
  {
    avatar: "/images/profile/user-7.jpg",
    title: "Eliga Rush",
    subtitle: "You can customize this template as you ...",
    time: "9:20 AM",
  },
];

//
// Profile dropdown
//
interface ProfileType {
  href: string;
  title: string;
}
const profile: ProfileType[] = [
  {
    href: "/apps/user-profile/profile",
    title: "My Profile",
  },
  {
    href: "/apps/notes",
    title: "My Notes",
  },
  {
    href: "/apps/email",
    title: "Inbox",
  },
];

// apps dropdown

interface appsLinkType {
  href: string;
  title: string;
  subtext: string;
  icon: string;
  bgcolor: string;
  color: string;
}

const appsLink: appsLinkType[] = [
  {
    href: "/apps/chats",
    title: "Chat Application",
    subtext: "New messages arrived",
    icon: "solar:chat-line-linear",
    bgcolor: `primary.light`,
    color: "primary.main",
  },
  {
    href: "/apps/user-profile/profile",
    title: "User Profile",
    subtext: "Learn more information",
    icon: "solar:shield-user-line-duotone",
    bgcolor: `error.light`,
    color: "error.main",
  },
  {
    href: "/apps/notes",
    title: "Notes App",
    subtext: "Get regular notes",
    icon: "solar:palette-linear",
    bgcolor: `secondary.light`,
    color: "secondary.main",
  },
  {
    href: "/apps/calendar",
    title: "Calendar App",
    subtext: "Get dates",
    icon: "solar:calendar-linear",
    bgcolor: `primary.light`,
    color: "primary.main",
  },
  {
    href: "/apps/contacts",
    title: "Contact Application",
    subtext: "2 Unsaved contact",
    icon: "solar:iphone-line-duotone",
    bgcolor: `success.light`,
    color: "success.main",
  },
  {
    href: "/apps/ecommerce/shop",
    title: "eCommerce App",
    subtext: "New stock available",
    icon: "solar:cart-2-line-duotone",
    bgcolor: `secondary.light`,
    color: "secondary.main",
  },
  {
    href: "/apps/email",
    title: "Email App",
    subtext: "Get new emails",
    icon: "solar:letter-unread-linear",
    bgcolor: `warning.light`,
    color: "warning.main",
  },
  {
    href: "/apps/tickets",
    title: "Ticket Application",
    subtext: "Get structured tickets",
    icon: "solar:ticket-sale-line-duotone",
    bgcolor: `success.light`,
    color: "success.main",
  },
];

interface LinkType {
  href: string;
  title: string;
}

const pageLinks: LinkType[] = [
  {
    href: "/theme-pages/pricing",
    title: "Pricing Page",
  },
  {
    href: "/auth/auth1/login",
    title: "Authentication Design",
  },
  {
    href: "/auth/auth1/register",
    title: "Register Now",
  },
  {
    href: "/404",
    title: "404 Error Page",
  },
  {
    href: "/apps/note",
    title: "Notes App",
  },
  {
    href: "/apps/user-profile/profile",
    title: "User Application",
  },
  {
    href: "/theme-pages/account-settings",
    title: "Account Setting",
  },
];

export { notifications, profile, pageLinks, appsLink, messages };
