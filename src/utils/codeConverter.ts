"use strict";

const codeConverter = (function () {
  const initialInputValues =
    "DEGCUGAAJEDCXLTQLMBBLSFQNJYKHIRRZZPSHFFYBWTNPWIXKDOOMR";
  // prettier-ignore
  const positionArray = [
    "UBL", "UB", "UBR", "UL", "U", "UR", "UFL", "UF", "UFR",
    "LUB", "LU", "LUF", "LB", "L", "LF", "LDB", "LD", "LDF",
    "FUL", "FU", "FUR", "FL", "F", "FR", "FDL", "FD", "FDR",
    "RUF", "RU", "RUB", "RF", "R", "RB", "RDF", "RD", "RDB",
    "BUR", "BU", "BUL", "BR", "B", "BL", "BDR", "BD", "BDL",
    "DFL", "DF", "DFR", "DL", "D", "DR", "DBL", "DB", "DBR"
  ];

  function positionToCodeType(position: string) {
    const positionLengthToCodeType = {
      1: "center",
      2: "edge",
      3: "corner",
    };
    return positionLengthToCodeType[position.length] || "";
  }

  function customCodeToInitCode(code: string, codeType: string) {
    let storedValues = "";
    if (typeof localStorage !== "undefined") {
      storedValues = localStorage.getItem("code") ?? initialInputValues;
    }
    const result: string[] = Array(code.length).fill(" ");
    for (let i in positionArray) {
      if (positionToCodeType(positionArray[i]) !== codeType) {
        continue;
      }
      for (let j = 0; j < code.length; j++) {
        if (storedValues[i] === code[j]) {
          result[j] = initialInputValues[i];
        }
      }
    }
    return result.join("");
  }

  function customCodeToPosition(code: string, codeType: string) {
    const initCode = customCodeToInitCode(code, codeType);
    const result: string[] = Array(3).fill("");
    const codeTypeValues = Array.from(initialInputValues)
      .map((char, index) =>
        positionToCodeType(positionArray[index]) !== codeType ? " " : char,
      )
      .join("");
    for (let i = 0; i < initCode.length; i++) {
      const index = codeTypeValues.indexOf(initCode[i]);
      if (index !== -1) {
        result[i] = positionArray[index];
      }
    }
    return result;
  }

  function positionToCustomCode(position: string[]) {
    let storedValues = "";
    if (typeof localStorage !== "undefined") {
      storedValues = localStorage.getItem("code") ?? initialInputValues;
    }
    let result = "";
    for (let pos of position) {
      const index = positionArray.indexOf(pos);
      if (index !== -1) {
        result += storedValues[index];
      }
    }
    return result;
  }

  return {
    positionToCodeType,
    customCodeToInitCode,
    customCodeToPosition,
    positionToCustomCode,
    initialInputValues,
    positionArray,
  };
})();

export default codeConverter;
