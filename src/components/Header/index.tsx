"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import LanguageToggler from "./LanguageToggler";
import { useTranslation } from "@/i18n/client";
import { updateMetadata } from "./updateMetadata";

const Header = () => {
  const { t } = useTranslation();

  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 25) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    updateMetadata(document, t);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!divRef.current?.contains(e.target as Node)) {
        setNavbarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const usePathName = usePathname();

  return (
    <>
      <header
        className={`header top-0 left-0 z-40 flex w-[100vw] items-center ${
          sticky
            ? "shadow-sticky dark:bg-gray-dark dark:shadow-sticky-dark fixed z-[41] bg-white bg-white/80 backdrop-blur-sm transition"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-52 max-w-full px-2 xl:mr-12">
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? "py-4 lg:py-4" : "py-6"
                } `}
              >
                <Image
                  src="/images/logo/logo-2.svg"
                  alt="logo"
                  width={183}
                  height={48}
                  loading="eager"
                  className="w-full dark:hidden"
                />
                <Image
                  src="/images/logo/logo.svg"
                  alt="logo"
                  width={183}
                  height={48}
                  loading="eager"
                  className="hidden w-full dark:block"
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-0 lg:px-4">
              <div ref={divRef}>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="ring-primary absolute top-1/2 right-4 block translate-y-[-50%] rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "top-[7px] rotate-45" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "opacity-0" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "top-[-8px] -rotate-45" : " "
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar border-body-color/50 dark:border-body-color/20 dark:bg-dark absolute right-0 z-30 w-[210px] rounded border-[.5px] bg-white px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-2">
                    {menuData.map((menuItem, menuIndex) => (
                      <li key={menuIndex} className="group relative">
                        {menuItem.path ? (
                          <Link
                            href={menuItem.path}
                            target={
                              menuItem.path.startsWith("http")
                                ? "_blank"
                                : "_self"
                            }
                            onClick={() => setNavbarOpen(false)}
                            className={`flex py-2 text-base font-bold whitespace-nowrap lg:mr-0 lg:inline-flex lg:px-1 lg:font-medium ${
                              usePathName === menuItem.path
                                ? "text-primary dark:text-white"
                                : "text-dark hover:text-primary dark:hover:text-primary dark:text-white"
                            }`}
                          >
                            {t(menuItem.title)}
                          </Link>
                        ) : (
                          <>
                            <p
                              onClick={() => handleSubmenu(menuIndex)}
                              onMouseOver={() => {
                                if (window.innerWidth >= 992) {
                                  setOpenIndex(menuIndex);
                                  setNavbarOpen(true);
                                }
                              }}
                              className={
                                "text-dark group-hover:text-primary dark:group-hover:text-primary flex cursor-pointer items-center justify-between py-2 text-base font-bold whitespace-nowrap lg:mr-0 lg:inline-flex lg:px-1 lg:font-medium dark:text-white"
                              }
                            >
                              {t(menuItem.title)}
                              <span>
                                <svg width="25" height="24" viewBox="0 0 25 24">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </p>
                            <div
                              className={`submenu dark:bg-dark relative top-full left-0 rounded-sm bg-white transition-[top] duration-300 lg:invisible lg:absolute lg:top-[110%] lg:block lg:bg-gray-100 lg:p-2 lg:opacity-0 lg:shadow-[1px_1px_3px_1px_rgba(0,0,0,0.2)] lg:dark:bg-gray-700 ${
                                openIndex === menuIndex && navbarOpen
                                  ? "block group-hover:opacity-100 lg:group-hover:visible lg:group-hover:top-full"
                                  : "hidden"
                              }`}
                            >
                              {menuItem.submenu &&
                                menuItem.submenu.map(
                                  (submenuItem, submenuIndex) => (
                                    <Link
                                      href={submenuItem.path as string}
                                      target={
                                        (submenuItem.path as string).startsWith(
                                          "http",
                                        )
                                          ? "_blank"
                                          : "_self"
                                      }
                                      onClick={() => {
                                        setNavbarOpen(false);
                                      }}
                                      key={submenuIndex}
                                      className="text-dark hover:text-primary dark:hover:text-primary block min-w-20 rounded py-1.5 pr-3 text-sm whitespace-nowrap dark:text-white"
                                    >
                                      {t(submenuItem.title)}
                                    </Link>
                                  ),
                                )}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="flex items-center justify-end pr-16 lg:pr-0">
                <div>
                  <LanguageToggler />
                </div>
                <div>
                  <ThemeToggler />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
