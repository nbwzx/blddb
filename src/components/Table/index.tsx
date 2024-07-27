import React, { JSX } from "react";
import commutator from "@/utils/commutator";
import finger from "@/utils/finger";
import codeConverter from "@/utils/codeConverter";
import bigbldCodeConverter from "@/utils/bigbldCodeConverter";
import { useTranslation } from "@/i18n/client";

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
  const { t } = useTranslation();
  let is3bld = true;
  let isCommutatorNeeded = true;
  let converter = codeConverter;
  const bigbldCodeTypes = ["wing", "xcenter", "tcenter", "midge"];
  const commutatorNotNeeded = ["parity"];
  if (bigbldCodeTypes.indexOf(codeType) !== -1) {
    converter = bigbldCodeConverter;
    is3bld = false;
  }
  if (commutatorNotNeeded.includes(codeType)) {
    isCommutatorNeeded = false;
  }
  const variantCode = converter.customCodeToVariantCode(inputText, codeType);
  const tableElements: JSX.Element[] = [];
  const isManmade = Object.values(data)[0][0] instanceof Array;

  for (const [key, value] of Object.entries(data)) {
    if (!variantCode.includes(key)) {
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
        comm = is3bld ? "" : value[i][2];
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
          if (is3bld) {
            commutatorResult = commutator.search({
              algorithm: item[j],
              maxDepth: 1,
            })[0];
          } else {
            commutatorResult = comm;
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
                } else if (is3bld ? "3bld" : "bigbld" in sourceToUrl[name]) {
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
            >
              {item[j]}
            </td>
            {isCommutatorNeeded && <td>{commutatorResult}</td>}
            {j === 0 && is3bld && <td rowSpan={item.length}>{fingerResult}</td>}
            {isManmade && j === 0 && (
              <td className="help" rowSpan={item.length}>
                {source.length}
                <span className="help-content">{sourceResult}</span>
              </td>
            )}
          </tr>,
        );
      }
    }

    tableElements.push(
      <table ref={tableRef} key={key}>
        <thead>
          <tr>
            <th>{t("table.no")}</th>
            <th>{t("table.algorithm")}</th>
            {isCommutatorNeeded && <th>{t("table.commutator")}</th>}
            {is3bld && <th>{t("table.thumbPosition")}</th>}
            {isManmade && <th>{t("table.source")}</th>}
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>,
    );
  }

  return (
    <div ref={divRef} className="mt-4">
      {tableElements}
    </div>
  );
};

export default Table;
