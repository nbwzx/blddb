"use client";
import corner_output from "public/data/json/corner_output.json";
import corner_manmade from "public/data/json/corner_manmade.json";
import sourceToUrl from "public/data/json/sourceToUrl.json";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import codeConverter from "@/utils/codeConverter";
import Table from "@/components/Table";

const Corner = () => {
  const codeType = "corner";
  const { t } = useTranslation();
  const tableRef = useRef<HTMLTableElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRefs = useRef<HTMLSelectElement[]>([]);
  const modeRef = useRef<HTMLSelectElement>(null);
  const modeToData = {
    nightmare: corner_output,
    manmade: corner_manmade,
  };
  const modeToEmoji = {
    nightmare: "\u{1F480}",
    manmade: "\u{2009}\u{F2BD}\u{2009}",
  };

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      if (mutationsList && tableRef.current) {
        inputRef.current?.blur();
        selectRefs.current.forEach((selectRef) => selectRef.blur());
        modeRef.current?.blur();
        adjustTableFontSize();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("resize", adjustTableFontSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", adjustTableFontSize);
    };
  }, []);

  const adjustTableFontSize = () => {
    if (tableRef.current && divRef.current) {
      tableRef.current.style.fontSize = "16px";
      const tableWidth = tableRef.current.offsetWidth;
      const divWidth = divRef.current.offsetWidth;
      const ratio = tableWidth / divWidth;
      if (ratio > 1) {
        const newFontSize = 16 / ratio;
        tableRef.current.style.fontSize = `${newFontSize}px`;
      }
    }
  };

  const [inputText, setInputText] = useState("");
  const [selectValues, setSelectValues] = useState(["", "", ""]);
  const [modeValue, setModeValue] = useState("");
  const [data, setdataValue] = useState(corner_output);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setInputText(newValue);
    setSelectValues(
      codeConverter.customCodeToPosition(newValue.padEnd(3, " "), codeType),
    );
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const newSelectValues = [...selectValues];
    newSelectValues[index] = e.target.value;
    setSelectValues(newSelectValues);
    setInputText(codeConverter.positionToCustomCode(newSelectValues));
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModeValue = e.target.value;
    setModeValue(newModeValue);
    setdataValue(modeToData[newModeValue]);
  };

  return (
    <>
      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                <h2 className="mb-8 text-center text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                  {t(`${codeType}.title`)}
                </h2>
                <p>{t(`${codeType}.hint`)}</p>
                <div className="mb-3 mr-2 mt-4 inline-block font-bold text-dark dark:text-white">
                  {t("common.position")}
                </div>
                {[0, 1, 2].map((index) => (
                  <React.Fragment key={index}>
                    <select
                      value={selectValues[index]}
                      onChange={(e) => handleSelectChange(e, index)}
                      ref={(ref) =>
                        (selectRefs.current[index] = ref as HTMLSelectElement)
                      }
                      className="text-transform: w-[3.5rem] rounded-sm border-b-[3px] border-gray-500 bg-inherit py-1 text-base font-medium uppercase text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-black dark:text-white dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    >
                      <option></option>
                      {codeConverter.positionArray
                        .filter(
                          (position) =>
                            codeConverter.positionToCodeType(position) ===
                            codeType,
                        )
                        .map((position) => (
                          <option key={position}>{position}</option>
                        ))}
                    </select>
                    {index !== 2 && <span className="mx-1">--</span>}
                  </React.Fragment>
                ))}
                <div className="mb-8">
                  <label
                    htmlFor="inputText"
                    className="mb-3 mt-4 inline-block font-bold text-dark dark:text-white"
                  >
                    {t("common.pairs")}
                  </label>
                  <input
                    id="inputText"
                    type="text"
                    ref={inputRef}
                    placeholder=""
                    className="text-transform: ml-2 w-[4rem] rounded-sm border-b-[3px] border-gray-500 bg-inherit px-3 py-1 text-base font-medium uppercase text-dark outline-none outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-inherit dark:text-white dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    autoComplete="off"
                    maxLength={3}
                    value={inputText}
                    onChange={handleInputChange}
                  />
                  <span className="mx-3"></span>
                  <label
                    htmlFor="modeValue"
                    className="mb-3 mt-4 inline-block font-bold text-dark dark:text-white"
                  >
                    Mode:
                  </label>
                  <select
                    id="modeValue"
                    onChange={(e) => handleModeChange(e)}
                    ref={modeRef}
                    value={modeValue}
                    className="text-transform: ml-2 w-[8rem] rounded-sm border-b-[3px] border-gray-500 bg-inherit py-1 text-base font-medium text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-black dark:text-white dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                  >
                    {Object.entries(modeToEmoji).map(([mode, emoji]) => (
                      <option key={mode} value={mode}>
                        {emoji + mode}
                      </option>
                    ))}
                  </select>
                  <Table
                    codeType={codeType}
                    inputText={inputText}
                    data={data}
                    divRef={divRef}
                    tableRef={tableRef}
                    sourceToUrl={sourceToUrl}
                  />
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
