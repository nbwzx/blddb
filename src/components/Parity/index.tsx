"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/i18n/client";
import codeConverter from "@/utils/codeConverter";
import bigbldCodeConverter from "@/utils/bigbldCodeConverter";
import Table from "@/components/Table";
import Loading from "@/app/loading";

const Parity = ({ codeType }: { codeType: string }) => {
  const { t } = useTranslation();
  const tableRef = useRef<HTMLTableElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRefs = useRef<HTMLSelectElement[]>([]);
  const modeRef = useRef<HTMLSelectElement>(null);
  const [loading, setLoading] = useState(true);

  let is3bld = true;
  let converter = codeConverter;
  const bigbldCodeTypes = ["wing", "xcenter", "tcenter", "midge"];
  if (bigbldCodeTypes.indexOf(codeType) !== -1) {
    converter = bigbldCodeConverter;
    is3bld = false;
  }

  const defaultMode = is3bld ? "nightmare" : "manmade";
  const [manmade, setManmade] = useState({});
  const [nightmare, setNightmare] = useState({});
  const [nightmareSelected, setNightmareSelected] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const manmadeData = is3bld
          ? await import(`public/data/${codeType}Manmade.json`)
          : await import(`public/data/bigbld/${codeType}Manmade.json`);

        const nightmareData = is3bld
          ? await import(`public/data/${codeType}Nightmare.json`)
          : {};

        const nightmareSelectedData = is3bld
          ? await import(`public/data/${codeType}NightmareSelected.json`)
          : {};

        setManmade(manmadeData.default);
        setNightmare(nightmareData.default || {});
        setNightmareSelected(nightmareSelectedData.default || {});

        const params = new URLSearchParams(window.location.search);
        const positionParam = params.get("position") || "";
        const modeParam = params.get("mode") || defaultMode;

        if (positionParam) {
          const positions = positionParam.split("-");
          setSelectValues(positions);
          if (inputRef.current) {
            inputRef.current.value = converter.positionToCustomCode(positions);
          }
        }

        if (modeParam) {
          setModeValue(modeParam);
        }
        setLoading(false);
      } catch (error) {
        // Handle error
      }
    };
    loadData();
  }, [codeType, is3bld, converter, defaultMode]);

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

  const [selectValues, setSelectValues] = useState(["", "", "", ""]);
  const [modeValue, setModeValue] = useState("");
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
      const newSelectValues = converter.customCodeToPosition(
        newValue.padEnd(4, " "),
        codeType,
      );
      setSelectValues(newSelectValues);
      const newUrl = `?position=${newSelectValues.join("-")}&mode=${modeValue}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
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
    const positionStr = newSelectValues.join("-");
    const newUrl = `?position=${positionStr}&mode=${modeValue}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModeValue = e.target.value;
    setModeValue(newModeValue);
    const positionStr = selectValues.join("-");
    const newUrl = `?position=${positionStr}&mode=${newModeValue}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
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

  const filteredPositionsCorner = converter.positionArray.filter(
    (position) => converter.positionToCodeType(position) === "corner",
  );
  const filteredPositionsEdge = converter.positionArray.filter(
    (position) => converter.positionToCodeType(position) === "edge",
  );

  useEffect(() => {
    if (!loading && inputRef.current) {
      const positions = selectValues;
      inputRef.current.value = converter.positionToCustomCode(positions);
    }
  }, [loading, selectValues, converter]);

  if (loading) {
    return <Loading />;
  }

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
                  {t(`${codeType}.edgeswap`)}
                </div>
                {[0, 1].map((index) => (
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
                      {filteredPositionsEdge.map((position) => (
                        <option key={position}>{position}</option>
                      ))}
                    </select>
                    {index === 0 && <span className="mx-1">--</span>}
                  </React.Fragment>
                ))}
                <br />
                <div className="mb-3 mr-2 mt-4 inline-block font-bold text-dark dark:text-white">
                  {t(`${codeType}.cornerswap`)}
                </div>
                {[2, 3].map((index) => (
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
                      {filteredPositionsCorner.map((position) => (
                        <option key={position}>{position}</option>
                      ))}
                    </select>
                    {index === 2 && <span className="mx-1">--</span>}
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
                    className="text-transform: ml-2 w-[4.5rem] rounded-sm border-b-[3px] border-gray-500 bg-inherit px-2 py-1 text-base font-medium uppercase text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-inherit dark:text-white dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    autoComplete="off"
                    maxLength={4}
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
                      onChange={handleModeChange}
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
                    inputText={converter.positionToCustomCode(selectValues)}
                    data={modeToData[modeValue]}
                    divRef={divRef}
                    tableRef={tableRef}
                    selected={modeToSelected[modeValue]}
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

export default Parity;
