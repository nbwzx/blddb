"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/i18n/client";
import codeConverter from "@/utils/codeConverter";
import bigbldCodeConverter from "@/utils/bigbldCodeConverter";
import Table from "@/components/Table";

const BLD = ({ codeType }: { codeType: string }) => {
  const { t } = useTranslation();
  const tableRef = useRef<HTMLTableElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRefs = useRef<HTMLSelectElement[]>([]);
  const modeRef = useRef<HTMLSelectElement>(null);
  let is3bld = true;
  let converter = codeConverter;
  const bigbldCodeTypes = ["wing", "xcenter", "tcenter", "midge"];
  if (bigbldCodeTypes.indexOf(codeType) !== -1) {
    converter = bigbldCodeConverter;
    is3bld = false;
  }
  const manmade = is3bld
    ? require(`public/data/${codeType}Manmade.json`)
    : require(`public/data/bigbld/${codeType}Manmade.json`);
  const nightmare = is3bld
    ? require(`public/data/${codeType}Nightmare.json`)
    : {};
  const nightmareSelected = is3bld
    ? require(`public/data/${codeType}NightmareSelected.json`)
    : {};
  const modeToData = is3bld
    ? {
        nightmare,
        manmade,
      }
    : {
        manmade,
      };
  const modeToSelected = is3bld
    ? {
        nightmare: nightmareSelected,
      }
    : {};
  const modeToEmoji = is3bld
    ? {
        nightmare: "\u{1F480}",
        manmade: "\u{2009}\u{F2BD}\u{2009}",
      }
    : {
        manmade: "\u{2009}\u{F2BD}\u{2009}",
      };
  const sourceToUrl = require("public/data/sourceToUrl.json");

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
      tableRef.current.style.fontSize = "18px";
      const tableWidth = tableRef.current.offsetWidth;
      const divWidth = divRef.current.offsetWidth;
      const ratio = tableWidth / divWidth;
      if (ratio > 1) {
        const newFontSize = 18 / ratio;
        tableRef.current.style.fontSize = `${newFontSize}px`;
      }
    }
  };

  const [selectValues, setSelectValues] = useState(["", "", ""]);
  const [modeValue, setModeValue] = useState("");
  const [data, setdataValue] = useState(is3bld ? nightmare : manmade);
  const [selected, setSelected] = useState(is3bld ? nightmareSelected : {});
  const compositionRef = useRef<boolean>(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!compositionRef.current) {
      const newValue = e.target.value.toUpperCase();
      setSelectValues(
        converter.customCodeToPosition(newValue.padEnd(3, " "), codeType),
      );
    }
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const newSelectValues = [...selectValues];
    newSelectValues[index] = e.target.value;
    setSelectValues(newSelectValues);
    if (inputRef.current) {
      inputRef.current.value = converter.positionToCustomCode(newSelectValues);
    }
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModeValue = e.target.value;
    setModeValue(newModeValue);
    setdataValue(modeToData[newModeValue]);
    setSelected(modeToSelected[newModeValue]);
    scrollToTop();
  };

  const Composition = (e: React.CompositionEvent<HTMLInputElement>) => {
    if (e.type === "compositionend") {
      compositionRef.current = false;
      handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
    } else {
      compositionRef.current = true;
    }
  };

  const filteredPositions = converter.positionArray.filter(
    (position) => converter.positionToCodeType(position) === codeType,
  );

  return (
    <>
      <section className="pb-[120px] pt-[100px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-10/12">
              <div>
                <h2 className="mb-8 text-center text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                  {t(`${codeType}.title`)}
                </h2>
                <p className="text-black dark:text-white">
                  {t(`${codeType}.hint`)}
                </p>
                <div className="mb-3 mr-2 mt-4 inline-block font-bold text-dark dark:text-white">
                  {t("common.position")}
                </div>
                {[0, 1, 2].map((index) => (
                  <React.Fragment key={index}>
                    <select
                      value={selectValues[index]}
                      onChange={(e) => handleSelectChange(e, index)}
                      onClick={scrollToTop}
                      ref={(ref) =>
                        (selectRefs.current[index] = ref as HTMLSelectElement)
                      }
                      className="text-transform: w-[3.5rem] rounded-sm border-b-[3px] border-gray-500 bg-inherit py-1 text-base font-medium text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-gray-dark dark:text-white dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    >
                      <option></option>
                      {filteredPositions.map((position) => (
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
                    className="text-transform: ml-2 w-[4rem] rounded-sm border-b-[3px] border-gray-500 bg-inherit px-2 py-1 text-base font-medium uppercase text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-inherit dark:text-white dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    autoComplete="off"
                    maxLength={3}
                    onChange={handleInputChange}
                    onCompositionStart={Composition}
                    onCompositionEnd={Composition}
                    onCompositionUpdate={Composition}
                    onClick={scrollToTop}
                  />
                  <span className="mx-3"></span>
                  <div className="inline-block">
                    <label
                      htmlFor="modeValue"
                      className="mb-3 mt-4 inline-block font-bold text-dark dark:text-white"
                    >
                      {t("common.mode")}
                    </label>
                    <select
                      id="modeValue"
                      onChange={(e) => handleModeChange(e)}
                      onClick={scrollToTop}
                      ref={modeRef}
                      value={modeValue}
                      className="text-transform: ml-2 inline-block rounded-sm border-b-[3px] border-gray-500 bg-inherit py-1 pr-5 text-base font-medium text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-gray-dark dark:text-white dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    >
                      {Object.entries(modeToEmoji).map(([mode, emoji]) => (
                        <option key={mode} value={mode}>
                          {emoji + t(`common.${mode}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Table
                    codeType={codeType}
                    inputText={inputRef.current?.value.toUpperCase() ?? ""}
                    data={data}
                    divRef={divRef}
                    tableRef={tableRef}
                    selected={selected}
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

export default BLD;
