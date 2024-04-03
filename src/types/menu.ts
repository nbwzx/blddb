export type Menu = {
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};
