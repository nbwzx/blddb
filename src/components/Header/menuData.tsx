import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    title: "common.3BLD",
    newTab: false,
    submenu: [
      {
        title: "corner.title",
        path: "/corner",
        newTab: false,
      },
      {
        title: "edge.title",
        path: "/edge",
        newTab: false,
      },
      {
        title: "code.title",
        path: "/code",
        newTab: false,
      },
    ],
  },
  {
    title: "common.BigBLD",
    newTab: false,
    submenu: [
      {
        title: "wing.title",
        path: "/bigbld/wing",
        newTab: false,
      },
      {
        title: "xcenter.title",
        path: "/bigbld/xcenter",
        newTab: false,
      },
      {
        title: "tcenter.title",
        path: "/bigbld/tcenter",
        newTab: false,
      },
      {
        title: "midge.title",
        path: "/bigbld/midge",
        newTab: false,
      },
      {
        title: "code.title",
        path: "/bigbld/code",
        newTab: false,
      },
    ],
  },
  {
    title: "common.Nightmare",
    newTab: false,
    submenu: [
      {
        title: "corner.title",
        path: "/corner",
        newTab: false,
      },
    ],
  },
  {
    title: "common.Tools",
    newTab: false,
    submenu: [
      {
        title: "code.title",
        path: "/code",
        newTab: false,
      },
    ],
  },
  {
    title: "common.code",
    newTab: false,
    submenu: [
      {
        title: "code.title",
        path: "/code",
        newTab: false,
      },
    ],
  },
  {
    title: "common.Readme",
    path: "https://docs.blddb.net",
    newTab: false,
  },
];
export default menuData;
