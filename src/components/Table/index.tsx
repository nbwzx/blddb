import React, { JSX, useState } from "react";
import commutator from "@/utils/commutator";
import finger from "@/utils/finger";
import codeConverter from "@/utils/codeConverter";
import bigbldCodeConverter from "@/utils/bigbldCodeConverter";
import { useTranslation } from "@/i18n/client";

function matchesPattern(patterns: string[], str: string): boolean {
  for (const pattern of patterns) {
    const regexPattern = pattern.replace(/\*/gu, ".");
    const regex = new RegExp(`^${regexPattern}$`, "u");
    if (regex.test(str)) {
      return true;
    }
  }
  return false;
}

const Table = ({
  codeType,
  inputText,
  data,
  divRef,
  tableRef,
  selected,
  sourceToUrl,
}: {
  codeType: string;
  inputText: string;
  data:
    | {}
    | { [key: string]: string[] } // nightmare
    | { [key: string]: [alg: string[], source: string[]][] } // manmade (3bld)
    | { [key: string]: [alg: string, source: string[], comm: string][] }; // manmade (bigbld)
  divRef: React.RefObject<HTMLDivElement>;
  tableRef: React.RefObject<HTMLTableElement>;
  selected?: { [key: string]: string };
  sourceToUrl?: { [key: string]: string[] };
}) => {
  const getPosition = (matchedPosition: string[]) => {
    let positionText = "";

    if (codeType === "parity") {
      positionText = `${t("common.position")} ${matchedPosition.slice(0, 2).join("-")} & ${matchedPosition.slice(2, 4).join("-")}`;
    } else if (codeType === "ltct") {
      positionText = `${t("common.position")} ${matchedPosition.slice(0, 2).join("-")}[${matchedPosition[2]}]`;
    } else {
      positionText = `${t("common.position")} ${matchedPosition.join("-")}`;
    }

    return positionText;
  };

  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    });
  };

  const loadSettings = () => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("settings");
      return savedSettings ? JSON.parse(savedSettings) : {};
    }
    return {};
  };

  const { t } = useTranslation();
  let is3bld = true;
  let isCommutatorNeeded = false;
  let converter = codeConverter;
  const bigbldCodeTypes = ["wing", "xcenter", "tcenter", "midge"];
  const commutatorNeededList = bigbldCodeTypes.concat(["corner", "edge"]);
  if (bigbldCodeTypes.includes(codeType)) {
    converter = bigbldCodeConverter;
    is3bld = false;
  }
  if (commutatorNeededList.includes(codeType)) {
    isCommutatorNeeded = true;
  }
  const variantCode = converter.customCodeToVariantCode(inputText, codeType);
  const tableElements: JSX.Element[] = [];
  const isManmade = Object.values(data)[0][0] instanceof Array;
  if (variantCode.length === 0 || variantCode[0].split("*").length > 2) {
    return <div ref={divRef} className="mt-4"></div>;
  }
  const isRegularExpression = variantCode[0].includes("*");
  const starIndex = inputText.indexOf("*");
  if (isRegularExpression && !isManmade) {
    return <div ref={divRef} className="mt-4"></div>;
  }
  let actualCodeType = codeType;
  if (isRegularExpression) {
    if (codeType === "parity") {
      if (starIndex === 0 || starIndex === 1) {
        actualCodeType = "edge";
      } else {
        actualCodeType = "corner";
      }
    } else if (codeType === "ltct") {
      actualCodeType = "corner";
    }
  }
  const settings = loadSettings();
  const trumbPosition = settings.showThumbPosition;
  const istrumbPositionNeeded =
    is3bld && (typeof trumbPosition === "undefined" || trumbPosition);
  for (const [key, value] of Object.entries(data)) {
    if (!matchesPattern(variantCode, key)) {
      continue;
    }
    const tableRows: JSX.Element[] = [];

    for (let i = 0; i < value.length; i++) {
      let item: string[] = [];
      let source: string[] = [];
      let comm: string = "";
      if (isManmade) {
        item = is3bld ? value[i][0] : [value[i][0]];
        source = value[i][1];
        comm = isCommutatorNeeded ? value[i][2] : "";
      } else {
        item = [value[i]];
      }
      const fingerResult = finger
        .fingerbeginfrom(item[0])
        .map((word) => t(word))
        .join("/");
      for (let j = 0; j < item.length; j++) {
        let commutatorResult = "";
        if (isCommutatorNeeded) {
          if (is3bld && !isManmade) {
            commutatorResult = commutator.search({
              algorithm: item[j],
              maxDepth: 1,
              slashNotaiton: settings.slashNotaiton,
              noBrackets: settings.noBrackets,
              spaceAfterColon: settings.spaceAfterColon,
              spaceAfterComma: settings.spaceAfterComma,
            })[0];
          } else {
            const commutatorResultBefore = is3bld ? comm[j] : comm;
            commutatorResult = commutator.commutatorPost(
              commutatorResultBefore,
              settings.slashNotaiton,
              settings.noBrackets,
              settings.spaceAfterColon,
              settings.spaceAfterComma,
            );
          }
        }
        let sourceResult: JSX.Element[] = [];
        if (isManmade) {
          sourceResult = source.map((name: string, index: number) => {
            let sourceElement: JSX.Element = <>{name}</>;
            if (sourceToUrl && name in sourceToUrl) {
              let url = "";
              if (name in sourceToUrl) {
                if (codeType in sourceToUrl[name]) {
                  url = sourceToUrl[name][codeType];
                } else if ((is3bld ? "3bld" : "bigbld") in sourceToUrl[name]) {
                  url = sourceToUrl[name][is3bld ? "3bld" : "bigbld"];
                } else if ("bld" in sourceToUrl[name]) {
                  url = sourceToUrl[name]["bld"];
                }
              }
              let nameNew = name;
              if (name.length > 25) {
                nameNew = name.split("(")[0].trim();
                if (nameNew.length > 25) {
                  nameNew = `${name.slice(0, 25)}...`;
                }
              }
              sourceElement = (
                <a href={url} target="_blank">
                  {nameNew}
                </a>
              );
            }
            return (
              <React.Fragment key={`${key}-source-${index}`}>
                {sourceElement}
                <br />
              </React.Fragment>
            );
          });
        }

        tableRows.push(
          <tr
            key={`${key}-${i}-${j}`}
            className={
              item[j] === (selected?.[key] ?? "")
                ? "bg-zinc-300 dark:bg-zinc-700"
                : ""
            }
          >
            {j === 0 && <td rowSpan={item.length}>{i + 1}</td>}
            <td
              style={{
                borderLeft: j === 0 ? "" : "none",
              }}
              className="cursor-pointer"
              onClick={() => handleCopy(item[j])}
            >
              {item[j]}
            </td>
            {isCommutatorNeeded && (
              <td
                className="cursor-pointer"
                onClick={() => handleCopy(commutatorResult)}
              >
                {commutatorResult}
              </td>
            )}
            {j === 0 && istrumbPositionNeeded && (
              <td rowSpan={item.length}>{fingerResult}</td>
            )}
            {isManmade && j === 0 && (
              <td className="help" rowSpan={item.length}>
                {source.length}
                <span className="help-content">{sourceResult}</span>
                <div className="triangle"></div>
              </td>
            )}
          </tr>,
        );
      }
    }
    if (isRegularExpression) {
      const variantCodeKey = converter.initCodeToVariantCustomCode(
        key,
        codeType,
      );
      let matchedCode = "";
      for (const i of variantCodeKey) {
        const regexPattern = inputText.replace(/\*/gu, ".");
        const regex = new RegExp(`^${regexPattern}$`, "u"); // Matches the entire string
        if (regex.test(i)) {
          matchedCode = i;
          break;
        }
      }
      const matchedPosition = converter.customCodeToPosition(
        matchedCode,
        codeType,
      );
      const matchedCharacterPosition = converter.customCodeToPosition(
        matchedCode[starIndex],
        actualCodeType,
      );
      tableElements.push(
        <React.Fragment key={matchedCharacterPosition}>
          <thead>
            <tr>
              <th
                colSpan={5}
                className="border-b-0 bg-green-300 text-left dark:bg-green-800"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {getPosition(matchedPosition)}
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                {codeType === "ltct"
                  ? `${t("common.pairs")} ${matchedCode.slice(0, 2)}[${matchedCode[2]}]`
                  : `${t("common.pairs")} ${matchedCode}`}
              </th>
            </tr>
            <tr>
              <th>{t("table.no")}</th>
              <th>{t("table.algorithm")}</th>
              {isCommutatorNeeded && <th>{t("table.commutator")}</th>}
              {istrumbPositionNeeded && <th>{t("table.thumbPosition")}</th>}
              {isManmade && <th>{t("table.source")}</th>}
            </tr>
          </thead>
          <tbody>
            {tableRows}
            <tr>
              <td colSpan={5} style={{ border: "none" }}>
                &nbsp;
              </td>
            </tr>
          </tbody>
        </React.Fragment>,
      );
    } else {
      tableElements.push(
        <React.Fragment key={key}>
          <thead>
            <tr>
              <th>{t("table.no")}</th>
              <th>{t("table.algorithm")}</th>
              {isCommutatorNeeded && <th>{t("table.commutator")}</th>}
              {istrumbPositionNeeded && <th>{t("table.thumbPosition")}</th>}
              {isManmade && <th>{t("table.source")}</th>}
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </React.Fragment>,
      );
    }
  }

  tableElements.sort((a, b) => {
    const keyA = a.key as string;
    const keyB = b.key as string;
    const order = converter.codeTypeToPositions(actualCodeType);
    return order.indexOf(keyA) - order.indexOf(keyB);
  });
  const tableElements2: JSX.Element[] = [];
  if (tableElements.length !== 0) {
    tableElements2.push(
      <table ref={tableRef} key="table">
        {tableElements}
      </table>,
    );
  }
  return (
    <div ref={divRef} className="mt-4">
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
      {tableElements2}
    </div>
  );
};

export default Table;
