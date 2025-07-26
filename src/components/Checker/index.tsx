"use client";

import React, { useState } from "react";
import { useTranslation } from "@/i18n/client";
import tracer from "@/utils/tracer";
import commutator from "@/utils/commutator";
import commutator_555 from "@/utils/commutator_555";
import codeConverter from "@/utils/codeConverter";
import tracer_555 from "@/utils/tracer_555";
import bigbldCodeConverter from "@/utils/bigbldCodeConverter";

const Checker = () => {
  const { t } = useTranslation();
  const [GsURL, setGsURL] = useState("");
  const [sheetData, setSheetData] = useState<Record<string, string[][]>>({});
  const [selectedSheet, setSelectedSheet] = useState("");
  const [selectedTypes, setSelectedTypes] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [buffer, setBuffer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const URL_KEY_V1_RE = /key=([^&#]+)/u;
  const URL_KEY_V2_RE = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/u;
  function extractIdFromURL(url: string): string {
    const m2 = URL_KEY_V2_RE.exec(url);
    if (m2) {
      return m2[1] ?? "";
    }
    const m1 = URL_KEY_V1_RE.exec(url);
    if (m1) {
      return m1[1] ?? "";
    }
    return "";
  }

  function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  }

  function isIncluded(
    substring: string,
    mainString: string,
    patternType: string,
  ): boolean {
    const patterns: { [key: string]: string } = {
      basic: escapeRegExp(substring),
      non_alphabetic: `(?<![a-zA-Z])${escapeRegExp(substring)}(?![a-zA-Z])`,
      non_alphanumeric: `(?<![a-zA-Z0-9])${escapeRegExp(substring)}(?![a-zA-Z0-9])`,
      non_alphabetic_strict: `(?<![a-zA-Z':2])${escapeRegExp(substring)}(?![a-zA-Z':2])`,
      ignore_case: `(?<![a-zA-Z])${escapeRegExp(substring)}`,
    };

    const pattern = patterns[patternType];
    const flags = patternType === "ignore_case" ? "i" : "";

    const regex = new RegExp(pattern, flags);
    return regex.test(mainString);
  }

  function getPattern(
    patterns: { [key: string]: string[] },
    mainString: string,
  ): string {
    for (const patternType in patterns) {
      if (Object.hasOwn(patterns, patternType)) {
        for (const word of patterns[patternType]) {
          if (isIncluded(word, mainString, patternType)) {
            return word;
          }
        }
      }
    }
    return "";
  }

  const patterns_3bld: { [key: string]: string[] } = {
    non_alphabetic_strict: codeConverter.positionArray.filter(
      (x) => x.length !== 1,
    ),
  };

  const patterns_5bld: { [key: string]: string[] } = {
    non_alphabetic_strict: bigbldCodeConverter.positionArray.filter(
      (x) => x.length !== 1,
    ),
  };

  const fetchData = async () => {
    const cacheBuster = Date.now();
    const url = `https://script.google.com/macros/s/AKfycbzhhIYLfm8LM3q_pKyy5W11WCBOV2rldddn1RURy1Cz8QZ9n2tCAXx5pdLTI25nkfA_5Q/exec?spreadsheetId=${extractIdFromURL(GsURL)}&cb=${cacheBuster}`;
    setSheetData({});
    setSelectedSheet("");
    setBuffer("");
    setSelectedTypes("");
    setSelectedTarget("");
    setErrorMessage("");
    setLoading(true);
    let data: any = {};
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      data = await response.json();
      data = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          (value as Array<Array<string>>).map((row) =>
            row.map((cell) => String(cell)),
          ),
        ]),
      );
      setSheetData(data);
      setErrorMessage("");
    } catch (error) {
      if (data && data.error) {
        setErrorMessage(`Error: ${data.error}`);
      } else if (error instanceof Error) {
        setErrorMessage(`Error: ${error.message}`);
      } else {
        setErrorMessage(`Error: ${String(error)}`);
      }
      setSheetData({});
    } finally {
      setLoading(false);
    }
  };

  const handleSheetChange = (event: { target: { value: any } }) => {
    const newSheet = event.target.value;
    setSelectedSheet(newSheet);
    const newBuffer =
      getPattern(patterns_3bld, newSheet) ||
      getPattern(patterns_5bld, newSheet);
    setBuffer(newBuffer);
    const selectedTypesNew =
      bigbldCodeConverter.positionArray.includes(newBuffer) &&
      !codeConverter.positionArray.includes(newBuffer)
        ? t("common.BigBLD")
        : t("common.3BLD");
    setSelectedTypes(selectedTypesNew);
  };

  const handleTypesChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedTypes(event.target.value);
    const newBuffer = getPattern(
      event.target.value === "BigBLD" ? patterns_5bld : patterns_3bld,
      selectedSheet,
    );
    setBuffer(newBuffer);
  };

  const handleTargetChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedTarget(event.target.value);
  };

  const getSheetOptions = () => {
    return Object.keys(sheetData).map((sheetName) => (
      <option key={sheetName} value={sheetName}>
        {sheetName}
      </option>
    ));
  };

  const getTableData = () => {
    const getPosition = (
      cellInput: string,
      firstRow: string,
      firstCol: string,
    ) => {
      let cell = cellInput;
      if (cell.length > 60) {
        return "";
      }
      if (
        !is3bld &&
        !(
          (cell.includes("M") || cell.includes("E") || cell.includes("S")) &&
          (cell.includes("m") || cell.includes("e") || cell.includes("s"))
        )
      ) {
        if (
          converter.positionToCodeType(firstRow) !==
            converter.positionToCodeType(buffer) ||
          converter.positionToCodeType(firstCol) !==
            converter.positionToCodeType(buffer)
        ) {
          return "";
        }
        if (converter.positionToCodeType(buffer) === "midge") {
          cell = cell
            .replace(/M/gu, "m")
            .replace(/E/gu, "e")
            .replace(/S/gu, "s");
        }
        if (converter.positionToCodeType(buffer) === "tcenter") {
          cell = cell
            .replace(/M/gu, "m")
            .replace(/E/gu, "e")
            .replace(/S/gu, "s");
        }
        if (converter.positionToCodeType(buffer) === "wing") {
          cell = cell
            .replace(/m/gu, "M")
            .replace(/e/gu, "E")
            .replace(/s/gu, "S");
        }
        // xcenter is complex, m and M are both used.
      }
      if (!is5bld) {
        const replacements: [string, string][] = [
          ["3Rw", "4Rw"],
          ["3Lw", "4Lw"],
          ["3Uw", "4Uw"],
          ["3Dw", "4Dw"],
          ["3Fw", "4Fw"],
          ["3Bw", "4Bw"],
        ];
        for (const [old, newValue] of replacements) {
          if (cell.includes(old) && !cell.includes("4")) {
            cell = cell.replace(old, newValue);
          }
        }
      }
      const expanded = is3bld
        ? commutator.expand({ algorithm: cell })
        : commutator_555.expand(cell);
      if (
        firstRow.split("").sort().join("") ===
          firstCol.split("").sort().join("") &&
        expanded === ""
      ) {
        return "matched";
      }
      const codeAuto = is3bld
        ? tracer.getCodeAuto(expanded)
        : tracer_555.getCodeAuto(expanded);
      if (
        ["xcenter", "tcenter"].includes(converter.positionToCodeType(buffer)) &&
        firstRow[0] === firstCol[0]
      ) {
        return "matched";
      }
      const codeFromPattern = converter.customCodeToVariantCode(
        converter.positionToCustomCode([buffer, firstRow, firstCol]),
        codeAuto[0],
      );
      if (selectedTarget === t("checker.column")) {
        if (
          codeFromPattern.includes(
            codeAuto[1][0] + codeAuto[1][2] + codeAuto[1][1],
          )
        ) {
          return "matched";
        }
        if (codeFromPattern.includes(codeAuto[1])) {
          return "inverse";
        }
      } else {
        if (codeFromPattern.includes(codeAuto[1])) {
          return "matched";
        }
        if (
          codeFromPattern.includes(
            codeAuto[1][0] + codeAuto[1][2] + codeAuto[1][1],
          )
        ) {
          return "inverse";
        }
      }
      return `${codeAuto[1]};${codeFromPattern}`;
    };

    if (!selectedSheet || !sheetData[selectedSheet]) {
      return null;
    }
    const values = sheetData[selectedSheet];
    let is5bld = false;
    for (const row of values) {
      for (const cell of row) {
        if (
          ["4Rw", "4Lw", "4Uw", "4Dw", "4Fw", "4Bw"].some((x) =>
            cell.includes(x),
          )
        ) {
          is5bld = true;
        }
      }
    }

    let is3bld = true;
    let converter = codeConverter;
    if (selectedTypes === "BigBLD") {
      converter = bigbldCodeConverter;
      is3bld = false;
    }

    return (
      <>
        <div className="mt-4 text-dark dark:text-white">
          {t("checker.notice")}
        </div>
        <div className="mt-4 max-h-[75vh] overflow-auto">
          <table className="overflow-x-auto">
            <thead>
              <tr>
                {values[0].map(
                  (header, index) =>
                    (index === 0 || header) && (
                      <th
                        key={index}
                        className={
                          index === 0
                            ? "sticky left-0 top-0 z-20"
                            : "sticky top-0 z-10"
                        }
                      >
                        {header}
                      </th>
                    ),
                )}
              </tr>
            </thead>
            <tbody>
              {values.slice(1).map(
                (row, rowIndex) =>
                  values[rowIndex + 1][0] && (
                    <tr key={rowIndex}>
                      {row.map(
                        (cell, cellIndex) =>
                          (cellIndex === 0 || values[0][cellIndex]) && (
                            <td
                              key={cellIndex}
                              className={
                                (cellIndex === 0
                                  ? "sticky left-0 z-10 bg-sky-200 font-bold dark:bg-sky-800"
                                  : "") +
                                (() => {
                                  const positionValue = getPosition(
                                    cell,
                                    getPattern(
                                      is3bld ? patterns_3bld : patterns_5bld,
                                      values[0][cellIndex],
                                    ),
                                    getPattern(
                                      is3bld ? patterns_3bld : patterns_5bld,
                                      values[rowIndex + 1][0],
                                    ),
                                  );
                                  if (
                                    positionValue === "matched" ||
                                    cellIndex === 0
                                  ) {
                                    return "";
                                  }
                                  if (positionValue === "inverse") {
                                    return "bg-green-300 dark:bg-green-800";
                                  }
                                  return "bg-pink-300 dark:bg-pink-500";
                                })()
                              }
                            >
                              {cell}
                            </td>
                          ),
                      )}
                    </tr>
                  ),
              )}
            </tbody>
          </table>
        </div>
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
                {t("checker.title")}
              </h2>
              <p className="text-black dark:text-white">{t("checker.hint")}</p>
              <div className="mb-3 mr-2 mt-4 inline-block font-bold text-dark dark:text-white">
                {t("checker.url")}
              </div>
              <input
                type="text"
                id="GsURLInput"
                value={GsURL}
                onChange={(e) => setGsURL(e.target.value)}
                style={{ width: "100%", maxWidth: "500px" }}
                className="mr-4 rounded-sm border-b-[3px] border-gray-500 bg-inherit px-2 py-1 text-base font-medium text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-inherit dark:text-white dark:shadow-none dark:focus:border-primary dark:focus:shadow-none"
                autoComplete="off"
              />
              <div
                className="mb-1 mt-1 inline-block cursor-pointer rounded-sm border-2 border-black bg-white px-4 py-2 text-base font-semibold text-black duration-300 ease-in-out hover:text-primary dark:border-white dark:bg-dark dark:text-white dark:hover:text-primary"
                onClick={fetchData}
              >
                {t("checker.fetchData")}
              </div>
              {loading && (
                <div className="flex items-center justify-center">
                  <div className="loader">
                    <div className="lds-ellipsis">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              )}
              <br />
              {Object.keys(sheetData).length > 0 && (
                <>
                  <div className="mb-3 mr-2 mt-4 inline-block font-bold text-dark dark:text-white">
                    {t("checker.selectSheet")}
                  </div>
                  <select
                    id="sheetSelection"
                    onChange={handleSheetChange}
                    className="inline-block rounded-sm border-b-[3px] border-gray-500 bg-inherit py-1 pr-5 text-base font-medium text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-gray-dark dark:text-white dark:shadow-none dark:focus:border-primary dark:focus:shadow-none"
                  >
                    <option value=""></option>
                    {getSheetOptions()}
                  </select>
                </>
              )}
              {Object.keys(sheetData).length > 0 && (
                <>
                  <span className="mx-3"></span>
                  <div className="inline-block">
                    <div className="mb-3 mr-2 mt-4 inline-block font-bold text-dark dark:text-white">
                      {t("checker.types")}
                    </div>
                    <select
                      id="typeSelection"
                      value={selectedTypes}
                      onChange={handleTypesChange}
                      className="inline-block rounded-sm border-b-[3px] border-gray-500 bg-inherit py-1 pr-5 text-base font-medium text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-gray-dark dark:text-white dark:shadow-none dark:focus:border-primary dark:focus:shadow-none"
                    >
                      <option>{t("common.3BLD")}</option>
                      <option>{t("common.BigBLD")}</option>
                    </select>
                  </div>
                </>
              )}
              <br />
              {Object.keys(sheetData).length > 0 && (
                <>
                  <div className="mb-3 mr-2 mt-4 inline-block font-bold text-dark dark:text-white">
                    {t("checker.buffer")}
                  </div>
                  <input
                    type="text"
                    id="bufferInput"
                    value={buffer}
                    onChange={(e) => setBuffer(e.target.value)}
                    style={{ width: "100px" }}
                    className="inline-block rounded-sm border-b-[3px] border-gray-500 bg-inherit px-2 py-1 text-base font-medium text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-inherit dark:text-white dark:shadow-none dark:focus:border-primary dark:focus:shadow-none"
                    autoComplete="off"
                  />
                </>
              )}
              {Object.keys(sheetData).length > 0 && (
                <>
                  <span className="mx-3"></span>
                  <div className="inline-block">
                    <div className="mb-3 mr-2 mt-4 inline-block font-bold text-dark dark:text-white">
                      {t("checker.firstTarget")}
                    </div>
                    <select
                      id="sheetTarget"
                      onChange={handleTargetChange}
                      className="inline-block rounded-sm border-b-[3px] border-gray-500 bg-inherit py-1 pr-5 text-base font-medium text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-gray-dark dark:text-white dark:shadow-none dark:focus:border-primary dark:focus:shadow-none"
                    >
                      <option>{t("checker.row")}</option>
                      <option>{t("checker.column")}</option>
                    </select>
                  </div>
                </>
              )}
              {errorMessage && <div>{errorMessage}</div>}
              <div id="result">{getTableData()}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checker;
