import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "Sentra Core",
    path: "/sentra-core",
    newTab: false,
  },
  {
    id: 33,
    title: "Iron Gate",
    path: "/iron-gate",
    newTab: false,
  },
  {
    id: 3,
    title: "Sensor Grid",
    path: "/sensor-grid",
    newTab: false,
  },
  {
    id: 4,
    title: "Pages",
    newTab: false,
    submenu: [
      {
        id: 41,
        title: "Sentra Core",
        path: "/sentra-core",
        newTab: false,
      },
      {
        id: 42,
        title: "Sensor Grid",
        path: "/sensor-grid",
        newTab: false,
      },
      {
        id: 43,
        title: "Iron Gate",
        path: "/iron-gate",
        newTab: false,
      },
      // {
      //   id: 44,
      //   title: "IronGate Sidebar Page",
      //   path: "/IronGate-sidebar",
      //   newTab: false,
      // },
      // {
      //   id: 45,
      //   title: "IronGate Details Page",
      //   path: "/IronGate-details",
      //   newTab: false,
      // },
      {
        id: 46,
        title: "Sign In Page",
        path: "/signin",
        newTab: false,
      },
      {
        id: 47,
        title: "Sign Up Page",
        path: "/signup",
        newTab: false,
      },
      // {
      //   id: 48,
      //   title: "Error Page",
      //   path: "/error",
      //   newTab: false,
      // },
    ],
  },
];
export default menuData;
