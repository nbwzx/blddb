"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n/client";
import { ALG_SEARCH_EVENT, algSearchUrl } from "@/utils/algSearch";

const SearchIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const HeaderSearch = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  // The box is always shown where the header has room for it (md to lg, while the
  // menu is collapsed, and 2xl up). Elsewhere the icon opens it as a panel.
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notFound, setNotFound] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);
  const panelInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      panelInputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setNotFound(false);
        if (inlineInputRef.current === document.activeElement) {
          inlineInputRef.current?.blur();
        }
        return;
      }
      // "/" opens the search unless the user is already typing somewhere.
      const target = e.target as HTMLElement;
      const typing =
        target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        // The inline box is display:none on phones, so it has no offsetParent there.
        if (inlineInputRef.current?.offsetParent) {
          inlineInputRef.current.focus();
        } else {
          setOpen(true);
        }
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setNotFound(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = algSearchUrl(searchTerm);
    if (!url) {
      setNotFound(true);
      return;
    }
    setOpen(false);
    inlineInputRef.current?.blur();
    if (url.split("?")[0] === pathname) {
      // The table page stays mounted, so update the address directly and tell it to re-read.
      window.history.pushState(null, "", url);
      window.dispatchEvent(new Event(ALG_SEARCH_EVENT));
    } else {
      router.push(url);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setNotFound(false);
  };

  const notFoundMessage = notFound && (
    <p
      role="alert"
      className="dark:bg-dark mt-1 rounded bg-white px-3 py-1.5 text-sm text-red-500 shadow-[1px_1px_3px_1px_rgba(0,0,0,0.2)]"
    >
      {t("common.searchNotFound")}
    </p>
  );

  return (
    // Below md the panel anchors to the full-width header row, not the button:
    // the button sits too far left for a panel growing leftward from it.
    <div
      ref={wrapperRef}
      id="alg-search"
      className="mr-1.5 md:relative md:mr-2"
    >
      <form
        onSubmit={handleSearch}
        className="relative hidden md:block lg:hidden 2xl:block"
      >
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-300" />
        <input
          ref={inlineInputRef}
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={t("common.searchHint")}
          aria-label={t("common.search")}
          className="bg-gray-2 h-11 w-56 rounded-full border border-gray-300 pr-4 pl-11 text-base text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
        />
      </form>
      {notFound && !open && (
        <div className="absolute top-full right-0 z-50 hidden w-[20rem] md:block lg:hidden 2xl:block">
          {notFoundMessage}
        </div>
      )}
      <button
        aria-label={t("common.search")}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="bg-gray-2 dark:bg-dark-bg flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-black md:hidden lg:flex lg:h-14 lg:w-14 2xl:hidden dark:text-white"
      >
        <SearchIcon className="h-5 w-5 lg:h-6 lg:w-6" />
      </button>
      {open && (
        <div
          id="alg-search-panel"
          className="absolute inset-x-4 top-full z-50 mt-2 md:hidden lg:inset-x-auto lg:right-0 lg:block lg:w-[26rem] 2xl:hidden"
        >
          <form
            onSubmit={handleSearch}
            className="flex items-stretch rounded-lg shadow-[1px_1px_3px_1px_rgba(0,0,0,0.2)]"
          >
            <input
              ref={panelInputRef}
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder={t("common.searchHint")}
              className="min-w-0 flex-1 rounded-l-lg border border-r-0 border-gray-300 bg-white px-4 py-2.5 text-base text-black focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={!searchTerm.trim()}
              className="bg-primary hover:bg-primary/90 cursor-pointer rounded-r-lg px-4 font-semibold text-white transition duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("common.search")}
            </button>
          </form>
          {notFoundMessage}
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;
