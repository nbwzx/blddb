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
        title: "corner.title",
        path: "/corner",
      },
    ],
  },
  {
    title: "common.Tools",
    submenu: [
      {
        title: "code.title",
        path: "/code",
      },
    ],
  },
  {
    title: "common.code",
    submenu: [
      {
        title: "code.title",
        path: "/code",
      },
    ],
  },
  {
    title: "common.Readme",
    path: "https://docs.blddb.net",
  },
];
export default menuData;
