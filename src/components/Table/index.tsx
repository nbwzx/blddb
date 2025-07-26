import React, { JSX, useState } from "react";
import commutator from "@/utils/commutator";
import commutator_555 from "@/utils/commutator_555";
import finger from "@/utils/finger";
import codeConverter from "@/utils/codeConverter";
import bigbldCodeConverter from "@/utils/bigbldCodeConverter";
import { useTranslation } from "@/i18n/client";
import rewrite from "@/utils/rewrite";

interface VideoAttributes {
  url: string;
  width: number;
  height: number;
}

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
  sourceToResult,
  algToUrl,
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
  selected?: Record<string, string>;
  sourceToUrl?: Record<string, Record<string, string>>;
  sourceToResult?: {
    [name: string]: {
      wca_id: string;
      "3bld"?: number;
      "4bld"?: number;
    };
  };
  algToUrl?: {
    [key: string]: Array<VideoAttributes>;
  };
}) => {
  const getPosition = (matchedPosition: string[]) => {
    let positionText = "";

    if (codeType === "parity") {
      positionText = `${t("common.position")} ${matchedPosition.slice(0, 2).join("-")} & ${matchedPosition.slice(2, 4).join("-")}`;
    } else if (codeType === "ltct") {
      positionText = `${t("common.position")} ${matchedPosition.slice(0, 2).join("-")}[${matchedPosition[2]}]`;
    } else if (codeType === "flips") {
      positionText = `${t("common.position")} ${matchedPosition[0]} & ${matchedPosition[1]}`;
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

  const getInverseCode = (code: string): string => {
    return code[0] + code[2] + code[1];
  };

  const { t } = useTranslation();
  let is3bld = true;
  let isCommutatorNeeded = false;
  let converter = codeConverter;
  const bigbldCodeTypes = ["wing", "xcenter", "tcenter", "midge"];
  const commutatorNeededList = bigbldCodeTypes.concat([
    "corner",
    "edge",
    "flips",
  ]);
  if (bigbldCodeTypes.includes(codeType)) {
    converter = bigbldCodeConverter;
    is3bld = false;
  }
  if (commutatorNeededList.includes(codeType)) {
    isCommutatorNeeded = true;
  }
  if (codeType === "twists" && inputText.length === 2) {
    isCommutatorNeeded = true;
  }

  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [videoList, setVideoList] = useState<VideoAttributes[]>([]);
  const [videoIdx, setVideoIdx] = useState(0);
  const [videoKey, setVideoKey] = useState(0);

  const getVideoUrl = (algorithms: string[]) => {
    const videoUrl: Array<VideoAttributes> = [];
    for (const algorithm of algorithms) {
      if (algToUrl?.[algorithm]) {
        videoUrl.push(...algToUrl[algorithm]);
      }
    }
    return videoUrl;
  };

  const calculateAndSetDimensions = (width: number, height: number) => {
    const widthScale = (Math.min(window.innerWidth, 1000) * 0.8) / width;
    const heightScale = (Math.min(window.innerHeight, 1000) * 0.8) / height;
    const scale = Math.min(widthScale, heightScale);
    setVideoDimensions({
      width: width * scale,
      height: height * scale,
    });
  };

  const handleCellClick = (algorithms: string[]) => {
    const videos = getVideoUrl(algorithms);
    if (videos.length > 0) {
      setVideoList(videos);
      setVideoIdx(0);
      const { width, height } = videos[0];
      calculateAndSetDimensions(width, height);
      setIsVideoVisible(true);
    }
  };

  const handleVideoChange = (delta: number) => {
    if (videoList.length > 1) {
      setVideoKey((prev) => prev + 1);
      const newIdx = (videoIdx + delta + videoList.length) % videoList.length;
      setVideoIdx(newIdx);
      const { width, height } = videoList[newIdx];
      calculateAndSetDimensions(width, height);
    }
  };

  const currentVideoUrl = videoList[videoIdx]?.url ?? "";
  const settings = loadSettings();
  const thumbPosition = settings.showThumbPosition;
  const mirrorLR = settings.mirrorLR;
  const orderOfAlgs: "Chichu" | "Speffz" =
    settings.orderOfAlgs ?? codeConverter.getDefaultOrderOfAlgs();
  const variantCode = converter.customCodeToVariantCode(
    inputText,
    codeType,
    mirrorLR,
  );
  const tableElements: JSX.Element[] = [];
  const isManmade = Object.values(data)[0][0] instanceof Array;
  if (variantCode.length === 0 || variantCode[0].split("*").length > 2) {
    return <div ref={divRef} className="mt-4"></div>;
  }
  const isRegularExpression = variantCode[0].includes("*");
  const hasInverseCodeTypes = bigbldCodeTypes.concat(["corner", "edge"]);
  const showInverseAlgs =
    settings.showInverseAlgs &&
    !isRegularExpression &&
    hasInverseCodeTypes.includes(codeType);
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
    } else if (codeType === "flips") {
      actualCodeType = "edge";
    }
  }
  const isThumbPositionNeeded =
    is3bld && (typeof thumbPosition === "undefined" || thumbPosition);
  for (const [key, value] of Object.entries(data)) {
    if (
      !(
        matchesPattern(variantCode, key) ||
        (showInverseAlgs && matchesPattern(variantCode, getInverseCode(key)))
      )
    ) {
      continue;
    }
    let processedValue = [...value];
    if (isManmade && sourceToResult) {
      const show3BldAlgsUnderSecs = settings.show3BldAlgsUnderSecs;
      const show4BldAlgsUnderSecs = settings.show4BldAlgsUnderSecs;
      processedValue = processedValue
        .map((innerArray) => {
          const filteredNames = innerArray[1].filter((name: string) => {
            return is3bld
              ? show3BldAlgsUnderSecs === "" ||
                  typeof show3BldAlgsUnderSecs === "undefined" ||
                  (sourceToResult[name] &&
                    (sourceToResult[name]["3bld"] ?? Infinity) <=
                      100 * parseFloat(show3BldAlgsUnderSecs))
              : show4BldAlgsUnderSecs === "" ||
                  typeof show4BldAlgsUnderSecs === "undefined" ||
                  (sourceToResult[name] &&
                    (sourceToResult[name]["4bld"] ?? Infinity) <=
                      100 * parseFloat(show4BldAlgsUnderSecs));
          });
          return [innerArray[0], filteredNames, innerArray[2]];
        })
        .filter((innerArray) => innerArray[1].length > 0);
      processedValue.sort((a, b) => {
        return b[1].length - a[1].length;
      });
    }
    const tableRows: JSX.Element[] = [];
    for (let i = 0; i < processedValue.length; i++) {
      let item: string[] = [];
      let source: string[] = [];
      let comm: string = "";
      if (isManmade) {
        item = is3bld ? processedValue[i][0] : [processedValue[i][0]];
        source = processedValue[i][1];
        comm = isCommutatorNeeded ? processedValue[i][2] : "";
      } else {
        item = [processedValue[i]];
      }
      if (mirrorLR) {
        item = item.map((alg) => rewrite.mirrorAxis(alg, "M"));
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
              slashNotation: settings.slashNotation,
              noBrackets: settings.noBrackets,
              spaceAfterColon: settings.spaceAfterColon,
              spaceAfterComma: settings.spaceAfterComma,
              outerBrackets: settings.outerBrackets,
            })[0];
          } else {
            const commutatorResultBefore = is3bld ? comm[j] : comm;
            const commutatorFunction = is3bld
              ? commutator.commutatorPost
              : commutator_555.commutatorPost;
            commutatorResult = commutatorFunction({
              algorithm: commutatorResultBefore,
              slashNotation: settings.slashNotation,
              noBrackets: settings.noBrackets,
              spaceAfterColon: settings.spaceAfterColon,
              spaceAfterComma: settings.spaceAfterComma,
              outerBrackets: settings.outerBrackets,
            });
            if (mirrorLR) {
              commutatorResult = rewrite.mirrorAxis(commutatorResult, "M");
            }
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
                <a href={url} target="_blank" className="dashed-link">
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
              item[j] ===
              (mirrorLR
                ? rewrite.mirrorAxis(selected?.[key] ?? "", "M")
                : selected?.[key] ?? "")
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
            {j === 0 && isThumbPositionNeeded && (
              <td
                rowSpan={item.length}
                onClick={() => handleCellClick(item)}
                className={
                  getVideoUrl(item).length > 0
                    ? "cursor-pointer text-primary dark:text-[#00BCD4]"
                    : ""
                }
              >
                {fingerResult}
              </td>
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
        mirrorLR,
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
        <React.Fragment key={matchedCharacterPosition[0]}>
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
              {isThumbPositionNeeded && <th>{t("table.thumbPosition")}</th>}
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
    } else if (showInverseAlgs && !matchesPattern(variantCode, key)) {
      const matchedCode = getInverseCode(
        converter.initCodeToCustomCode(variantCode[0], codeType),
      );
      const matchedPosition = converter.customCodeToPosition(
        matchedCode,
        codeType,
      );
      tableElements.push(
        <React.Fragment key={0}>
          <thead>
            <tr>
              <td colSpan={5} style={{ border: "none" }}>
                &nbsp;
              </td>
            </tr>
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
              {isThumbPositionNeeded && <th>{t("table.thumbPosition")}</th>}
              {isManmade && <th>{t("table.source")}</th>}
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
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
              {isThumbPositionNeeded && <th>{t("table.thumbPosition")}</th>}
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
    if (keyA === "0" || keyB === "0") {
      return keyA === "0" ? 1 : -1;
    }
    const order = converter.positionArrays[orderOfAlgs];
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
      {isVideoVisible && (
        <>
          <div
            className="z-999 fixed left-0 top-0 h-full w-full bg-black bg-opacity-50"
            onClick={() => setIsVideoVisible(false)}
          />
          <div
            className="z-1000 fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center rounded-lg bg-white shadow-lg"
            style={{
              width: videoDimensions.width || "80%",
              height: videoDimensions.height || "80%",
            }}
          >
            <>
              {videoIdx > 0 && (
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-300 p-2"
                  onClick={() => handleVideoChange(-1)}
                >
                  ◀
                </button>
              )}
              {videoIdx < videoList.length - 1 && (
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-300 p-2"
                  onClick={() => handleVideoChange(1)}
                >
                  ▶
                </button>
              )}
            </>
            <iframe
              key={videoKey}
              src={currentVideoUrl}
              width="100%"
              height="100%"
              allow="autoplay; fullscreen"
              sandbox="allow-same-origin allow-scripts"
            ></iframe>
          </div>
        </>
      )}
    </div>
  );
};

export default Table;
