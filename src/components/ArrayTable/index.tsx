"use client";

import { useTranslation } from "@/i18n/client";
import React, { JSX } from "react";

const ArrayTable = ({ codeType }: { codeType: string }) => {
  const { t } = useTranslation();
  const data: string[][] = require(
    `public/data/nightmare/${codeType}.ts`,
  ).default;

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

  const subArrays = splitArrayByEmptyLine(data);
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
          <tr
            key={rowIndex}
            className={`${rowIndex === 0 ? "sticky top-0" : ""}`}
          >
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
      <div key={tables.length} className="mt-8 max-h-[75vh] overflow-auto">
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
