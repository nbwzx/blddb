"use client";
import corner_output from "public/data/json/corner_output.json";
import { useState } from "react";
import React from "react";
import commutator from "@/utils/commutator";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import codeConverter from "@/utils/codeConverter";

const Corner = () => {
  const tableRef = useRef<HTMLTableElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTableMutation = (mutation: MutationRecord) => {
      if (
        mutation.addedNodes.length > 0 &&
        mutation.addedNodes[0] === tableRef.current
      ) {
        adjustTableFontSize();
      }
    };

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        handleTableMutation(mutation);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const handleResize = () => {
      if (tableRef.current) {
        tableRef.current.style.fontSize = "16px";
        adjustTableFontSize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const adjustTableFontSize = () => {
    if (tableRef.current && divRef.current) {
      const tableWidth = tableRef.current.offsetWidth;
      const divWidth = divRef.current.offsetWidth;
      const ratio = tableWidth / divWidth;
      if (ratio > 1) {
        const newFontSize = 16 / ratio;
        tableRef.current.style.fontSize = `${newFontSize}px`;
      }
    }
  };

  const { t } = useTranslation();
  const [name, setInputText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputText(newValue.toUpperCase());
  };
  return (
    <>
      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                <h2 className="mb-8 text-center text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                  {t("corner.title")}
                </h2>
                <p>{t("corner.hint")}</p>
                <div className="mb-8">
                  <label
                    htmlFor="name"
                    className="mb-3 mt-4 inline-block font-bold text-dark dark:text-white"
                  >
                    {t("pairs")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder=""
                    className="text-transform: ml-2 w-[4rem] rounded-sm border-b-[3px] border-gray-500 bg-inherit px-3 py-1 text-base uppercase text-dark outline-none outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-inherit dark:text-white dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    autoComplete="off"
                    maxLength={3}
                    value={name}
                    onChange={handleInputChange}
                  />
                  <div ref={divRef} className="mt-4">
                    {(() => {
                      const code = codeConverter.customCodeToInitCode(
                        name,
                        "corner",
                      );
                      const tableElements: JSX.Element[] = [];
                      for (const [key, value] of Object.entries(
                        corner_output,
                      )) {
                        if (key !== code) {
                          continue;
                        }
                        const tableRows: JSX.Element[] = [];
                        for (let i = 0; i < value.length; i++) {
                          const item = value[i];
                          const commutatorResult = commutator.search({
                            algorithm: item,
                            maxDepth: 1,
                          })[0];
                          tableRows.push(
                            <tr key={`${key}-${i}`}>
                              <td>{i + 1}</td>
                              <td>{item}</td>
                              <td>{commutatorResult}</td>
                            </tr>,
                          );
                        }
                        tableElements.push(
                          <table ref={tableRef} key={key}>
                            <thead>
                              <tr>
                                <th>No.</th>
                                <th>Algorithm</th>
                                <th>Commutator</th>
                                <th>Thumb Position</th>
                              </tr>
                            </thead>
                            <tbody>{tableRows}</tbody>
                          </table>,
                        );
                      }
                      return tableElements;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Corner;
