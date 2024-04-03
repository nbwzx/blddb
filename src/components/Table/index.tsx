import React, { JSX } from "react";
import commutator from "@/utils/commutator";
import finger from "@/utils/finger";
import codeConverter from "@/utils/codeConverter";
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
    | { [key: string]: string[] }
    | { [key: string]: [alg: string[], source: string[]][] };
  divRef: React.RefObject<HTMLDivElement>;
  tableRef: React.RefObject<HTMLTableElement>;
  selected?: { [key: string]: string };
  sourceToUrl?: { [key: string]: string[] };
}) => {
  const { t } = useTranslation();
  const code = codeConverter.customCodeToInitCode(inputText, codeType);
  const variantCode = codeConverter.initCodeToVariantCode(code, codeType);
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
      if (isManmade) {
        item = value[i][0];
        source = value[i][1];
      } else {
        item = [value[i]];
      }
      const fingerResult = finger
        .fingerbeginfrom(item[0])
        .map((finger) => t(finger))
        .join("/");
      for (let j = 0; j < item.length; j++) {
        const commutatorResult = commutator.search({
          algorithm: item[j],
          maxDepth: 1,
        })[0];

        let sourceResult: JSX.Element[] = [];
        if (isManmade) {
          sourceResult = source.map((item: string, index: number) => {
            let sourceElement: JSX.Element;
            if (sourceToUrl && item in sourceToUrl) {
              sourceElement = (
                <a
                  href={
                    sourceToUrl[item][
                      codeType === "corner" ? sourceToUrl[item].length - 1 : 0
                    ]
                  }
                  target="_blank"
                >
                  {item}
                </a>
              );
            } else {
              sourceElement = <>{item}</>;
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
            <td>{item[j]}</td>
            <td>{commutatorResult}</td>
            {j === 0 && <td rowSpan={item.length}>{fingerResult}</td>}
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
            <th>{t("table.commutator")}</th>
            <th>{t("table.thumbPosition")}</th>
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
