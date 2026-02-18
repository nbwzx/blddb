"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/i18n/client";
import codeConverter from "@/utils/codeConverter";
import bigbldCodeConverter from "@/utils/bigbldCodeConverter";
import Table from "@/components/Table";
import useResponsiveTable from "@/utils/useResponsiveTable";
import Loading from "@/app/loading";
import PageSection from "@/components/PageSection";
import tracer from "@/utils/tracer";
import tracer_555 from "@/utils/tracer_555";

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
  const [errorKey, setErrorKey] = useState("");

  let is3bld = true;
  const selectValuesLenMap: Record<string, number> = {
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

  const [highlightValue, setHighlightValue] = useState("");

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
      const highlightParam = params.get("highlight") || "";

      if (positionParam) {
        const positions = positionParam.split("-");
        setSelectValuesNew(positions);
        const newInputValue = selectToInput(positions);
        if (inputRef.current) {
          inputRef.current.value = newInputValue;
        }
        checkForDuplicates(positions, modeParam);
      }

      if (modeParam) {
        setModeValue(modeParam);
      }

      if (highlightParam) {
        setHighlightValue(highlightParam);
      }

      let isStandard = true;
      const localStorageKey = is3bld ? "code" : "bigbldCode";
      let storedValues = "";
      if (typeof localStorage !== "undefined") {
        storedValues =
          localStorage.getItem(localStorageKey) ?? converter.initialInputValues;
      }
      if (!is3bld) {
        // The index 1 is notEditableCells[0][0]
        if (storedValues && storedValues[1] === " ") {
          isStandard = false;
        }
      }
      const groups = is3bld ? tracer.trackDict : tracer_555.trackDict;
      let isValidCode = true;
      Object.entries(groups).forEach(([key, group]: [string, number[]]) => {
        if (isStandard && key === "wingOpposite") {
          return;
        }
        if (!isStandard && key === "wing") {
          return;
        }
        const values = group.map((idx) => storedValues[idx - 1] ?? " ");
        for (let i = 0; i < values.length; i++) {
          if (
            values.filter((v) => v === values[i]).length >= 2 ||
            values[i] === " "
          ) {
            isValidCode = false;
            return;
          }
        }
      });
      if (!isValidCode) {
        setErrorKey("invalidCode");
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
  const algToUrl = require("public/data/algToUrl.json");

  useResponsiveTable(tableRef, divRef, { inputRef, selectRefs, modeRef });

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
      return selectValuesKey;
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

  const checkForDuplicates = (
    newSelectValues: string[],
    newModeValue: string,
  ) => {
    if (codeType !== "twists") {
      const filteredValues = newSelectValues.filter(
        (value) => value !== " " && value !== "" && value !== "*",
      );
      const sortedValues = filteredValues.map((value) =>
        value.split("").sort().join(""),
      );
      const uniqueValues = new Set(sortedValues);
      if (uniqueValues.size !== sortedValues.length) {
        setErrorKey("multiplePositions");
      }
      const newValue = selectToInput(newSelectValues);
      if (newModeValue === "nightmare" && newValue.includes("*")) {
        setErrorKey("starNightmare");
      }
      if (newModeValue === "manmade" && newValue.split("*").length > 2) {
        setErrorKey("starManmade");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!compositionRef.current) {
      setErrorKey("");
      const newValue = e.target.value.toUpperCase();
      const newSelectValues = converter.customCodeToPosition(
        newValue.padEnd(selectValuesLen, " "),
        codeType,
      );
      setSelectValuesNew(newSelectValues);
      if (codeType === "twists") {
        const positions = converter.customCodeToPosition(newValue, "corner");
        const corner1Positions = converter.codeTypeToPositions("corner1");
        for (let i = 0; i < newValue.length; i++) {
          if (!corner1Positions.includes(positions[i])) {
            setErrorKey("invalidLetter");
            break;
          }
        }
      } else {
        for (let i = 0; i < newValue.length; i++) {
          if (newValue[i] !== selectToInput(newSelectValues)[i]) {
            setErrorKey("invalidLetter");
            break;
          }
        }
      }
      checkForDuplicates(newSelectValues, modeValue);
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
    setErrorKey("");
    let newSelectValues = [...selectValues];
    newSelectValues[index] = e.target.value;
    if (codeType === "twists") {
      newSelectValues = getSelectValuesKey(newSelectValues);
    }
    checkForDuplicates(newSelectValues, modeValue);
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
    setErrorKey("");
    const newModeValue = e.target.value;
    setModeValue(newModeValue);
    checkForDuplicates(selectValues, newModeValue);
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

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const pasteString =
        e.clipboardData
          ?.getData("text/plain")
          .replace(/[—&]+/gu, "-")
          .replace(/(\s*)-(\s*)/gu, "-")
          .replace(/\s+/gu, "-")
          .trim() || "";
      if (pasteString.match(/^[A-Za-z*]+(?:-+[A-Za-z*]*)*$/u)) {
        const values = pasteString.split(/-/u);
        const newSelectValues = Array(selectValuesLen).fill("");
        for (let i = 0; i < selectValuesLen && i < values.length; i++) {
          newSelectValues[i] = values[i];
        }
        checkForDuplicates(newSelectValues, modeValue);
        setSelectValuesNew(newSelectValues);
        const newSelectValuesTrim = newSelectValues.map((value) =>
          value === " " ? "" : value,
        );
        const newUrl = `?position=${newSelectValuesTrim.join("-")}&mode=${modeValue}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
        e.preventDefault();
      }
    };
    document.addEventListener("paste", handleGlobalPaste);
    return () => document.removeEventListener("paste", handleGlobalPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPosition = (matchedPosition: string[]) => {
    let positionText = "";

    if (codeType === "parity") {
      positionText = `${matchedPosition.slice(0, 2).join("-")} & ${matchedPosition.slice(2, 4).join("-")}`;
    } else if (codeType === "ltct") {
      positionText = `${matchedPosition.slice(0, 2).join("-")}[${matchedPosition[2]}]`;
    } else if (codeType === "flips") {
      positionText = `${matchedPosition[0]} & ${matchedPosition[1]}`;
    } else if (codeType === "twists") {
      const labels = ["UFR", "UBR", "UFL", "UBL", "DFR", "DBR", "DFL", "DBL"];
      for (let i = 0; i < labels.length; i++) {
        if (matchedPosition[i] !== "") {
          positionText += `${labels[i]}: ${matchedPosition[i]}, `;
        }
      }
      positionText = positionText.slice(0, -2);
    } else {
      positionText = `${matchedPosition.join("-")}`;
    }

    return positionText;
  };

  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const handleCopyPosition = () => {
    const text = getPosition(selectValues);
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    });
  };

  if (loading) {
    return <Loading />;
  }

  const positionElement = ({ positionHint }: { positionHint: string }) => {
    const isClickable = !(
      positionHint === t("common.pairs") || positionHint === t("common.mode")
    );

    return (
      <div
        className={`text-dark mt-4 mr-2 mb-3 inline-block font-bold dark:text-white ${isClickable ? "cursor-pointer" : ""}`}
        onClick={isClickable ? handleCopyPosition : undefined}
      >
        {positionHint}
      </div>
    );
  };

  const inputElement = ({ inputWidth }: { inputWidth: number }) => (
    <div className="mb-6">
      {positionElement({ positionHint: t("common.pairs") })}
      <input
        id="inputText"
        type="text"
        ref={inputRef}
        placeholder=""
        style={{ width: `${inputWidth}rem` }}
        className="text-dark focus:border-primary dark:focus:border-primary border-b-[3px] border-gray-500 bg-inherit px-2 py-1 text-base font-medium uppercase outline-hidden transition-all duration-300 dark:border-gray-100 dark:bg-inherit dark:text-white dark:shadow-none dark:focus:shadow-none"
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
          className="text-dark focus:border-primary dark:bg-gray-dark dark:focus:border-primary inline-block border-b-[3px] border-gray-500 bg-inherit py-1 pr-5 text-base font-medium outline-hidden transition-all duration-300 dark:border-gray-100 dark:text-white dark:shadow-none dark:focus:shadow-none"
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

  const groupInputElement = ({
    groupArray,
    positionType,
  }: {
    groupArray: number[];
    positionType: string;
  }) =>
    groupArray.map((index: number) => (
      <React.Fragment key={index}>
        <select
          value={selectValues[index]}
          onChange={(e) => handleSelectChange(e, index)}
          onClick={scrollToTop}
          ref={(ref) => {
            selectRefs.current[index] = ref as HTMLSelectElement;
          }}
          className="text-dark focus:border-primary dark:bg-gray-dark dark:focus:border-primary group-array border-b-[3px] border-gray-500 bg-inherit py-1 text-base font-medium outline-hidden transition-all duration-300 dark:border-gray-100 dark:text-white dark:shadow-none dark:focus:shadow-none"
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
          <div className="inline-block">
            {positionElement({ positionHint: t(`${codeType}.twist`) })}
            <div className="help inline-block">
              <i className="fas fa-question-circle mr-2 text-blue-600 dark:text-blue-400"></i>
              <span className="help-content whitespace-nowrap">
                {t(`${codeType}.twistHint`)}
              </span>
            </div>
            {groupInputElement({ groupArray: [2], positionType: "corner1" })}
          </div>
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
    <PageSection title={t(`${codeType}.title`)}>
      {copySuccess && (
        <div
          id="copypopup"
          className="fade-in-out fixed bottom-[30px] left-1/2 z-50 -translate-x-1/2 transform rounded-md border-2 bg-gray-100 p-4 text-black shadow-lg dark:bg-gray-700 dark:text-white"
          style={{
            animation:
              "fadein 0.5s ease forwards, fadeout 0.5s ease 1.5s forwards",
          }}
        >
          <span className="text-lg">{t("table.copied")}</span>
        </div>
      )}
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
      <div ref={divRef}>
        <p className="text-black dark:text-white">
          {errorKey && t("error.prefix") + t(`error.${errorKey}`)}
        </p>
      </div>
      <Table
        codeType={codeType}
        inputText={selectToInput(selectValues)}
        data={modeToData[modeValue as keyof typeof modeToData] || {}}
        divRef={divRef}
        tableRef={tableRef}
        selected={modeToSelected[modeValue as keyof typeof modeToSelected]}
        sourceToUrl={sourceToUrl}
        sourceToResult={sourceToResult}
        algToUrl={algToUrl}
        highlight={highlightValue}
      />
    </PageSection>
  );
};

export default BLD;
