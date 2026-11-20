"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n/client";
import { ALG_SEARCH_EVENT, algSearchUrl } from "@/utils/algSearch";

const HeaderSearch = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      // "/" opens the search unless the user is already typing somewhere.
      const target = e.target as HTMLElement;
      const typing =
        target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
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
      return;
    }
    setOpen(false);
    if (url.split("?")[0] === pathname) {
      // The table page stays mounted, so update the address directly and tell it to re-read.
      window.history.pushState(null, "", url);
      window.dispatchEvent(new Event(ALG_SEARCH_EVENT));
    } else {
      router.push(url);
    }
  };

  return (
    <div ref={wrapperRef} className="relative mr-1.5 md:mr-2">
      <button
        aria-label={t("common.search")}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="bg-gray-2 dark:bg-dark-bg flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-black md:h-14 md:w-14 dark:text-white"
      >
        <svg
          className="h-5 w-5 md:h-6 md:w-6"
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
      </button>
      {open && (
        <form
          onSubmit={handleSearch}
          className="absolute top-full right-0 z-50 mt-2 flex w-[min(90vw,26rem)] items-stretch rounded-lg shadow-[1px_1px_3px_1px_rgba(0,0,0,0.2)]"
        >
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
      )}
    </div>
  );
};

export default HeaderSearch;
