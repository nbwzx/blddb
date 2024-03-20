import React from "react";
import commutator from "@/utils/commutator";
import finger from "@/utils/finger";
import codeConverter from "@/utils/codeConverter";
import { useTranslation } from "react-i18next";

const Table = ({
  codeType,
  inputText,
  data,
  divRef,
  tableRef,
}: {
  codeType: string;
  inputText: string;
  data: { [key: string]: string[] };
  divRef: React.RefObject<HTMLDivElement>;
  tableRef: React.RefObject<HTMLTableElement>;
}) => {
  const { t } = useTranslation();
  const code = codeConverter.customCodeToInitCode(inputText, codeType);
  const variantCode = codeConverter.initCodeToVariantCode(code, codeType);
  const tableElements: JSX.Element[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (!variantCode.includes(key)) {
      continue;
    }

    const tableRows: JSX.Element[] = [];

    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const commutatorResult = commutator.search({
        algorithm: item,
        maxDepth: 1,
      })[0];
      const fingerResult = finger
        .fingerbeginfrom(item)
        .map((finger) => t(finger))
        .join("/");

      tableRows.push(
        <tr key={`${key}-${i}`}>
          <td>{i + 1}</td>
          <td>{item}</td>
          <td>{commutatorResult}</td>
          <td>{fingerResult}</td>
        </tr>,
      );
    }

    tableElements.push(
      <table ref={tableRef} key={key}>
        <thead>
          <tr>
            <th>{t("table.no")}</th>
            <th>{t("table.algorithm")}</th>
            <th>{t("table.commutator")}</th>
            <th>{t("table.thumbPosition")}</th>
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
