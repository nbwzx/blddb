import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    title: "common.3BLD",
    submenu: [
      {
        title: "corner.title",
        path: "/corner",
      },
      {
        title: "edge.title",
        path: "/edge",
      },
      {
        title: "parity.title",
        path: "/parity",
      },
      {
        title: "ltct.title",
        path: "/ltct",
      },
      {
        title: "code.title",
        path: "/code",
      },
    ],
  },
  {
    title: "common.BigBLD",
    submenu: [
      {
        title: "wing.title",
        path: "/bigbld/wing",
      },
      {
        title: "xcenter.title",
        path: "/bigbld/xcenter",
      },
      {
        title: "tcenter.title",
        path: "/bigbld/tcenter",
      },
      {
        title: "midge.title",
        path: "/bigbld/midge",
      },
      {
        title: "code.title",
        path: "/bigbld/code",
      },
    ],
  },
  {
    title: "common.Nightmare",
    submenu: [
      {
        title: "nightmare.corner",
        path: "/nightmare/corner",
      },
      {
        title: "nightmare.edge",
        path: "/nightmare/edge",
      },
      {
        title: "nightmare.2twists",
        path: "/nightmare/2twists",
      },
      {
        title: "nightmare.2flips",
        path: "/nightmare/2flips",
      },
      {
        title: "nightmare.parity",
        path: "/nightmare/parity",
      },
      {
        title: "nightmare.ltct",
        path: "/nightmare/ltct",
      },
      {
        title: "nightmare.2e2e",
        path: "/nightmare/2e2e",
      },
      {
        title: "nightmare.2c2c",
        path: "/nightmare/2c2c",
      },
      {
        title: "nightmare.3twists",
        path: "/nightmare/3twists",
      },
      {
        title: "nightmare.4flips",
        path: "/nightmare/4flips",
      },
      {
        title: "nightmare.5style",
        path: "/nightmare/5style",
      },
    ],
  },
  {
    title: "common.Tools",
    submenu: [
      {
        title: "sheets.title",
        path: "/sheets",
      },
    ],
  },
  {
    title: "common.Settings",
    submenu: [
      {
        title: "settings.title",
        path: "/settings",
      },
      {
        title: "code.3BLD",
        path: "/code",
      },
      {
        title: "code.BigBLD",
        path: "/bigbld/code",
      },
    ],
  },
  {
    title: "common.Readme",
    path: "https://docs.blddb.net",
  },
];
export default menuData;
