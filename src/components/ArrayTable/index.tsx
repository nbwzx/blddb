"use client";

import { useTranslation } from "@/i18n/client";
import React, { JSX } from "react";
import codeConverter from "@/utils/codeConverter";

const ArrayTable = ({ codeType }: { codeType: string }) => {
  const { t } = useTranslation();
  const isCornerEdge = codeType === "corner" || codeType === "edge";
  const data: string[][] = isCornerEdge
    ? []
    : require(`public/data/nightmare/${codeType}.ts`).default;
  const dataCornerEdge: { [key: string]: string } = isCornerEdge
    ? require(`public/data/${codeType}NightmareSelected.json`)
    : {};

  const splitArrayByEmptyLine = (dataInput: string[][]): string[][][] => {
    const subArrays: string[][][] = [];
    let subArray: string[][] = [];

    for (const row of dataInput) {
      if (
        row.every((cell) => cell === "") ||
        row === dataInput[dataInput.length - 1]
      ) {
        if (row === dataInput[dataInput.length - 1]) {
          subArray.push(row);
        }
        if (subArray.length > 0) {
          while (
            subArray.every((subrow) => subrow[subArray[0].length - 1] === "")
          ) {
            subArray.forEach((subrow) => subrow.pop());
          }
          subArrays.push(subArray);
          subArray = [];
        }
      } else {
        subArray.push(row);
      }
    }

    return subArrays;
  };

  let subArrays: string[][][] = [];
  const array: string[][] = [];
  if (isCornerEdge) {
    const numColumns = codeConverter.codeTypeToNumber(codeType);
    let cnt = 0;
    let newRow: string[] = [];
    for (const key in dataCornerEdge) {
      cnt++;
      newRow.push(key);
      newRow.push(dataCornerEdge[key]);
      if (cnt % numColumns === 0) {
        array.push(newRow);
        newRow = [];
      }
    }
    // UFR-UBR-UFL-UBL-DFR-DFL
    const orderCorner = ["J", "G", "A", "D", "X", "W"];
    // UR-UF-UL-UB-DR-DL-FR-FL-BR-DF
    const orderEdge = ["G", "A", "C", "E", "O", "K", "Q", "S", "Y", "I"];
    const order = codeType === "corner" ? orderCorner : orderEdge;
    array.sort((a, b) => {
      return order.indexOf(a[0][0]) - order.indexOf(b[0][0]);
    });
    array.unshift([]);
    for (let i = 0; i < numColumns; i++) {
      array[0].push(t("nightmare.code"));
      array[0].push(t("nightmare.algorithm"));
    }
    subArrays.push(array);
  } else {
    subArrays = splitArrayByEmptyLine(data);
  }

  const tables: JSX.Element[] = [];

  subArrays.forEach((subArray) => {
    const currentTable: JSX.Element[] = [];
    const currentTableHead: JSX.Element[] = [];
    subArray.forEach((row, rowIndex) => {
      const isColumnEmpty = (cellIndex: number) =>
        subArray
          .slice(Math.min(rowIndex, Math.max(subArray.length - 2, 0)))
          .every((currentRow) => (currentRow[cellIndex] ?? "") === "");

      if (rowIndex === 0) {
        currentTableHead.push(
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <th
                key={cellIndex}
                className={`${isColumnEmpty(cellIndex) ? "border-y-0 border-r-0" : ""} ${cell === "" ? "p-[1em]" : ""} ${rowIndex === 0 && !isColumnEmpty(cellIndex) ? "" : "bg-white dark:bg-dark"}`}
                style={{
                  borderLeft:
                    isColumnEmpty(cellIndex - 1) && !isColumnEmpty(cellIndex)
                      ? "1px solid"
                      : "",
                }}
              >
                {cell}
              </th>
            ))}
          </tr>,
        );
      } else {
        currentTable.push(
          <tr
            key={rowIndex}
            className={`${rowIndex === 0 ? "sticky top-0" : ""}`}
          >
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className={`${isColumnEmpty(cellIndex) ? "border-y-0 border-r-0" : ""} ${cell === "" ? "p-[1em]" : ""} ${rowIndex === 0 && !isColumnEmpty(cellIndex) ? "bg-sky-200 font-bold dark:bg-sky-800" : ""}`}
                style={{
                  borderLeft:
                    isColumnEmpty(cellIndex - 1) && !isColumnEmpty(cellIndex)
                      ? "1px solid"
                      : "",
                }}
              >
                {cell}
              </td>
            ))}
          </tr>,
        );
      }
    });
    tables.push(
      <div
        key={tables.length}
        className={`mt-8 overflow-auto ${isCornerEdge ? "" : "max-h-[75vh]"}`}
      >
        <table>
          <thead>{currentTableHead}</thead>
          <tbody>{currentTable}</tbody>
        </table>
      </div>,
    );
  });

  return (
    <section className="pb-[120px] pt-[100px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-10/12">
            <h2 className="mb-8 text-center text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
              {t(`nightmare.${codeType}`)}
            </h2>
            {tables}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArrayTable;
