"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="relative z-10 md:pt-8 lg:pt-12">
        <div className="container">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D2D8E183] to-transparent dark:via-[#959CB183]"></div>
          <div className="py-4">
            <div className="dark:text-gray text-center text-base text-body-color">
              <ul className="copyright">
                <li>© 2022-2025 Zixing Wang. All rights reserved.</li>
                <li>
                  Github:{" "}
                  <a
                    href="https://github.com/nbwzx/blddb"
                    className="hover:text-primary"
                  >
                    blddb
                  </a>
                </li>
                <li>
                  License:{" "}
                  <a
                    href="https://www.gnu.org/licenses"
                    className="hover:text-primary"
                  >
                    GPL-3.0 license
                  </a>
                </li>
                <li>
                  <Link href="/donate" className="hover:text-primary">
                    Donate me
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
