"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/i18n/client";
import codeConverter from "@/utils/codeConverter";
import bigbldCodeConverter from "@/utils/bigbldCodeConverter";
import Table from "@/components/Table";
import Loading from "@/app/loading";

const BLD = ({ codeType }: { codeType: string }) => {
  const { i18n, t } = useTranslation();
  const tableRef = useRef<HTMLTableElement>(
    null as unknown as HTMLTableElement,
  );
  const divRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRefs = useRef<HTMLSelectElement[]>([]);
  const modeRef = useRef<HTMLSelectElement>(null);
  const [loading, setLoading] = useState(true);

  let is3bld = true;
  const selectValuesLenMap = {
    flips: 2,
    parity: 4,
    twists: 8,
  };
  const selectValuesLen = selectValuesLenMap[codeType] || 3;
  let converter = codeConverter;
  const bigbldCodeTypes = ["wing", "xcenter", "tcenter", "midge"];
  if (bigbldCodeTypes.includes(codeType)) {
    converter = bigbldCodeConverter;
    is3bld = false;
  }

  const availableModes = is3bld ? ["nightmare", "manmade"] : ["manmade"];
  const defaultMode = availableModes[0];
  const [manmade, setManmade] = useState({});
  const [nightmare, setNightmare] = useState({});
  const [nightmareSelected, setNightmareSelected] = useState({});
  const loadSettings = () => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("settings");
      return savedSettings ? JSON.parse(savedSettings) : {};
    }
    return {};
  };

  const [modeValue, setModeValue] = useState(() => {
    if (typeof window !== "undefined") {
      const initialSettings = loadSettings();
      const savedMode = initialSettings.mode;
      return savedMode && availableModes.includes(savedMode)
        ? savedMode
        : defaultMode;
    }
    return defaultMode;
  });

  const selectToInput = (positions: string[]) => {
    return converter.positionToCustomCode(getSelectValuesKey(positions));
  };

  const getSelectValuesDisplay = (positions: string[]) => {
    if (codeType !== "twists") {
      return positions;
    }
    const newSelectValues = [...positions];
    newSelectValues.forEach((value, i) => {
      if (value === "cw") {
        newSelectValues[i] = t("twists.cw");
      } else if (value === "ccw") {
        newSelectValues[i] = t("twists.ccw");
      }
    });
    return newSelectValues;
  };

  const setSelectValuesNew = (positions: string[]) => {
    setSelectValues(getSelectValuesDisplay(positions));
  };

  useEffect(() => {
    const loadData = async () => {
      const manmadeData = is3bld
        ? await import(`public/data/${codeType}Manmade.json`)
        : await import(`public/data/bigbld/${codeType}Manmade.json`);

      const nightmareData = is3bld
        ? await import(`public/data/${codeType}Nightmare.json`)
        : {};

      const nightmareSelectedData =
        is3bld && codeType !== "ltct" && codeType !== "twists"
          ? await import(`public/data/${codeType}NightmareSelected.json`)
          : {};

      setManmade(manmadeData.default);
      setNightmare(nightmareData.default || {});
      setNightmareSelected(nightmareSelectedData.default || {});

      const params = new URLSearchParams(window.location.search);
      const positionParam = params.get("position") || "";
      const modeParam = params.get("mode") || modeValue;

      if (positionParam) {
        const positions = positionParam.split("-");
        setSelectValuesNew(positions);
        if (inputRef.current) {
          inputRef.current.value = selectToInput(positions);
        }
      }

      if (modeParam) {
        setModeValue(modeParam);
      }
      setLoading(false);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeType, is3bld, converter, defaultMode, modeValue]);

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
  const sourceToResult = require("public/data/sourceToResult.json");

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
      const width = document.body.clientWidth;
      const tableCols = tableRef.current.rows[0].cells.length;
      const tableWidth0 = Math.round(
        tableCols * (width * 0.01) + (tableCols + 1) * (2 / 3),
      );
      tableRef.current.style.fontSize = "18px";
      const tableWidth = tableRef.current.offsetWidth;
      const divWidth = divRef.current.offsetWidth;
      if (tableWidth > divWidth) {
        const newFontSize =
          (18 * (divWidth - tableWidth0)) / (tableWidth - tableWidth0);
        tableRef.current.style.fontSize = `${newFontSize}px`;
      }
    }
  };

  useEffect(() => {
    if (availableModes.length === 1) {
      return;
    }
    const initialSettings = loadSettings();
    const newSettings = { ...initialSettings, mode: modeValue };
    localStorage.setItem("settings", JSON.stringify(newSettings));
  }, [availableModes.length, codeType, modeValue]);

  const [selectValues, setSelectValues] = useState<string[]>(
    Array(selectValuesLen).fill(""),
  );
  let selectValuesKey = [...selectValues];
  const compositionRef = useRef<boolean>(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getSelectValuesKey = (positions: string[]) => {
    selectValuesKey = [...positions];
    if (codeType !== "twists") {
      return selectValues;
    }
    for (let i = 0; i < selectValuesKey.length; i++) {
      if (
        [
          t("twists.cw", { lng: "en" }),
          t("twists.cw", { lng: "zh-CN" }),
          t("twists.cw", { lng: "ja" }),
        ].includes(selectValuesKey[i])
      ) {
        selectValuesKey[i] = "cw";
      } else if (
        [
          t("twists.ccw", { lng: "en" }),
          t("twists.ccw", { lng: "zh-CN" }),
          t("twists.ccw", { lng: "ja" }),
        ].includes(selectValuesKey[i])
      ) {
        selectValuesKey[i] = "ccw";
      }
    }
    return selectValuesKey;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!compositionRef.current) {
      const newValue = e.target.value.toUpperCase();
      const newSelectValues = converter.customCodeToPosition(
        newValue.padEnd(selectValuesLen, " "),
        codeType,
      );
      setSelectValuesNew(newSelectValues);
      const newSelectValuesTrim = newSelectValues.map((value) =>
        value === " " ? "" : value,
      );
      const newUrl = `?position=${newSelectValuesTrim.join("-")}&mode=${modeValue}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    }
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    let newSelectValues = [...selectValues];
    newSelectValues[index] = e.target.value;
    if (codeType === "twists") {
      newSelectValues = getSelectValuesKey(newSelectValues);
    }
    let blankCount = 0;
    let starCount = 0;
    let blankIndex = -1;
    for (let i = 0; i < newSelectValues.length; i++) {
      const selectValue = newSelectValues[i].trim();
      if (selectValue === "") {
        blankCount++;
        blankIndex = i;
      } else if (selectValue === "*") {
        starCount++;
      }
    }
    if (
      blankCount === 1 &&
      starCount === 0 &&
      e.target.value.trim() !== "" &&
      modeValue === "manmade"
    ) {
      newSelectValues[blankIndex] = "*";
    }
    setSelectValuesNew(newSelectValues);
    if (inputRef.current) {
      inputRef.current.value = selectToInput(newSelectValues);
    }
    const newSelectValuesTrim = newSelectValues.map((value) =>
      value === " " ? "" : value,
    );
    const positionStr = newSelectValuesTrim.join("-");
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

  useEffect(() => {
    if (!loading && inputRef.current) {
      setSelectValuesNew(selectValuesKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, converter, i18n.resolvedLanguage]);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.value = converter.positionToCustomCode(selectValuesKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, selectValues, converter, i18n.resolvedLanguage]);

  if (loading) {
    return <Loading />;
  }

  const positionElement = ({ positionHint }) => (
    <div className="mb-3 mr-2 mt-4 inline-block font-bold text-dark dark:text-white">
      {positionHint}
    </div>
  );

  const inputElement = ({ inputWidth }) => (
    <div className="mb-6">
      {positionElement({ positionHint: t("common.pairs") })}
      <input
        id="inputText"
        type="text"
        ref={inputRef}
        placeholder=""
        style={{ width: `${inputWidth}rem` }}
        className="rounded-sm border-b-[3px] border-gray-500 bg-inherit px-2 py-1 text-base font-medium uppercase text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-inherit dark:text-white dark:shadow-none dark:focus:border-primary dark:focus:shadow-none"
        autoComplete="off"
        maxLength={selectValuesLen}
        onChange={handleInputChange}
        onCompositionStart={Composition}
        onCompositionEnd={Composition}
        onCompositionUpdate={Composition}
        onClick={scrollToTop}
      />
      <span className="mx-3"></span>
      <div className="inline-block">
        {positionElement({ positionHint: t("common.mode") })}
        <select
          id="modeValue"
          onChange={handleModeChange}
          onClick={scrollToTop}
          ref={modeRef}
          value={modeValue}
          className="inline-block rounded-sm border-b-[3px] border-gray-500 bg-inherit py-1 pr-5 text-base font-medium text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-gray-dark dark:text-white dark:shadow-none dark:focus:border-primary dark:focus:shadow-none"
        >
          {Object.entries(modeToEmoji).map(([mode, emoji]) => (
            <option key={mode} value={mode}>
              {emoji + t(`common.${mode}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const groupInputElement = ({ groupArray, positionType }) =>
    groupArray.map((index: number) => (
      <React.Fragment key={index}>
        <select
          value={selectValues[index]}
          onChange={(e) => handleSelectChange(e, index)}
          onClick={scrollToTop}
          ref={(ref) => {
            selectRefs.current[index] = ref as HTMLSelectElement;
          }}
          className="w-[3.5rem] rounded-sm border-b-[3px] border-gray-500 bg-inherit py-1 text-base font-medium text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-gray-dark dark:text-white dark:shadow-none dark:focus:border-primary dark:focus:shadow-none"
        >
          <option></option>
          {modeValue === "manmade" && codeType !== "twists" && (
            <option>*</option>
          )}
          {codeType === "twists"
            ? converter
                .codeTypeToPositions(positionType)
                .map((position) => (
                  <option key={position}>{t(`${codeType}.${position}`)}</option>
                ))
            : converter
                .codeTypeToPositions(positionType)
                .map((position) => <option key={position}>{position}</option>)}
        </select>
        {index !== groupArray[groupArray.length - 1] && (
          <span className="mx-1">—</span>
        )}
      </React.Fragment>
    ));

  const renderBLD = () => {
    if (codeType === "flips") {
      return (
        <>
          {positionElement({ positionHint: t(`${codeType}.first`) })}
          {groupInputElement({ groupArray: [0], positionType: "edge0" })}
          <span className="mx-3"></span>
          {positionElement({ positionHint: t(`${codeType}.second`) })}
          {groupInputElement({ groupArray: [1], positionType: "edge0" })}
          <br />
          {inputElement({ inputWidth: 4.5 })}
        </>
      );
    }
    if (codeType === "twists") {
      const labels = ["UFR", "UBR", "UFL", "UBL", "DFR", "DBR", "DFL", "DBL"];
      return (
        <>
          {labels.map((label, index) => (
            <React.Fragment key={index}>
              {positionElement({ positionHint: `${label}:` })}
              {groupInputElement({
                groupArray: [index],
                positionType: "twists",
              })}
              {index % 2 === 0 ? (
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              ) : (
                <br />
              )}{" "}
            </React.Fragment>
          ))}
          {inputElement({ inputWidth: 4.5 })}
        </>
      );
    }
    if (codeType === "parity") {
      return (
        <>
          {positionElement({ positionHint: t(`${codeType}.edgeswap`) })}
          {groupInputElement({ groupArray: [0, 1], positionType: "edge" })}
          <br />
          {positionElement({ positionHint: t(`${codeType}.cornerswap`) })}
          {groupInputElement({ groupArray: [2, 3], positionType: "corner" })}
          {inputElement({ inputWidth: 4.5 })}
        </>
      );
    }
    if (codeType === "ltct") {
      return (
        <>
          {positionElement({ positionHint: t("common.position") })}
          {groupInputElement({ groupArray: [0, 1], positionType: "corner" })}
          <span className="mx-3"></span>
          {positionElement({ positionHint: t(`${codeType}.twist`) })}
          <div className="help inline-block">
            <i className="fas fa-question-circle mr-2 text-blue-600"></i>
            <span className="help-content whitespace-nowrap">
              {t(`${codeType}.twistHint`)}
            </span>
          </div>
          {groupInputElement({ groupArray: [2], positionType: "corner1" })}
          {inputElement({ inputWidth: 4.5 })}
        </>
      );
    }
    return (
      <>
        {positionElement({ positionHint: t("common.position") })}
        {groupInputElement({ groupArray: [0, 1, 2], positionType: codeType })}
        {inputElement({ inputWidth: 4 })}
      </>
    );
  };

  return (
    <section className="pb-[120px] pt-[100px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-10/12">
            <div>
              <h2 className="mb-8 text-center text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                {t(`${codeType}.title`)}
              </h2>
              <p className="text-black dark:text-white">
                {t(`${codeType}.hint`)
                  .split("\n")
                  .map((line, index, array) => (
                    <span key={index}>
                      {line}
                      {index < array.length - 1 && <br />}
                    </span>
                  ))}
              </p>
              {renderBLD()}
              <Table
                codeType={codeType}
                inputText={selectToInput(selectValues)}
                data={modeToData[modeValue]}
                divRef={divRef}
                tableRef={tableRef}
                selected={modeToSelected[modeValue]}
                sourceToUrl={sourceToUrl}
                sourceToResult={sourceToResult}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BLD;
