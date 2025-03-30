const codeConverter = (function () {
  const localStorageKey = "code";
  const letteringSchemes = {
    Chichu: "DEGC GAAJEDCX TQLMBBLS QNJYKHIR ZZPSHFFY WTNPWIXK OOMR",
    Speffz: "AABD BDCCEEFH FHGGIIJL JLKKMMNP NPOOQQRT RTSSUUVX VXWW",
  };
  const initialInputValues = letteringSchemes["Chichu"];
  // prettier-ignore
  const positionArray = [
    "UBL", "UB", "UBR", "UL", "U", "UR", "UFL", "UF", "UFR",
    "LUB", "LU", "LUF", "LB", "L", "LF", "LDB", "LD", "LDF",
    "FUL", "FU", "FUR", "FL", "F", "FR", "FDL", "FD", "FDR",
    "RUF", "RU", "RUB", "RF", "R", "RB", "RDF", "RD", "RDB",
    "BUR", "BU", "BUL", "BR", "B", "BL", "BDR", "BD", "BDL",
    "DFL", "DF", "DFR", "DL", "D", "DR", "DBL", "DB", "DBR",
  ];
  // prettier-ignore
  const nextPositionsMap = {
    "UBL": "LUB", "LUB": "BUL", "BUL": "UBL",
    "UBR": "BUR", "BUR": "RUB", "RUB": "UBR",
    "UFL": "FUL", "FUL": "LUF", "LUF": "UFL",
    "UFR": "RUF", "RUF": "FUR", "FUR": "UFR",
    "DFL": "LDF", "LDF": "FDL", "FDL": "DFL",
    "DFR": "FDR", "FDR": "RDF", "RDF": "DFR",
    "DBL": "BDL", "BDL": "LDB", "LDB": "DBL",
    "DBR": "RDB", "RDB": "BDR", "BDR": "DBR",
    "UB": "BU", "BU": "UB",
    "UL": "LU", "LU": "UL",
    "UR": "RU", "RU": "UR",
    "UF": "FU", "FU": "UF",
    "BL": "LB", "LB": "BL",
    "FL": "LF", "LF": "FL",
    "BR": "RB", "RB": "BR",
    "FR": "RF", "RF": "FR",
    "DF": "FD", "FD": "DF",
    "DL": "LD", "LD": "DL",
    "DR": "RD", "RD": "DR",
    "DB": "BD", "BD": "DB",
    "*": "*",
  };

  function codeTypeToNumber(codeType: string) {
    const codeTypeToNumberMap = {
      edge: 2,
      corner: 3,
    };
    return codeTypeToNumberMap[codeType] || 1;
  }

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
      storedValues =
        localStorage.getItem(localStorageKey) ?? initialInputValues;
    }
    const result: string[] = Array(code.length).fill(" ");
    for (const i in positionArray) {
      if (positionToCodeType(positionArray[i]) !== codeType) {
        continue;
      }
      for (let j = 0; j < code.length; j++) {
        if (storedValues[i] === code[j]) {
          result[j] = initialInputValues[i];
        }
        if (code[j] === "*") {
          result[j] = "*";
        }
      }
    }
    return result.join("");
  }

  function customCodeToPosition(code: string, codeType: string) {
    if (codeType === "flips") {
      return customCodeToPosition(code, "edge");
    }
    if (codeType === "parity") {
      return [
        ...customCodeToPosition(code.slice(0, 2), "edge"),
        ...customCodeToPosition(code.slice(2, 4), "corner"),
      ];
    }
    if (codeType === "ltct") {
      return customCodeToPosition(code, "corner");
    }
    let storedValues = "";
    if (typeof localStorage !== "undefined") {
      storedValues =
        localStorage.getItem(localStorageKey) ?? initialInputValues;
    }
    const result: string[] =
      codeType === "twists" ? Array(8).fill(" ") : Array(code.length).fill(" ");
    if (codeType === "twists") {
      const indices = [
        20, 27, 29, 36, 11, 18, 38, 9, 33, 26, 42, 35, 24, 17, 15, 44,
      ];
      const positionMap = indices.map((index) => storedValues[index]).join("");
      const directions = ["cw", "ccw"];
      for (const letter of code) {
        const index = positionMap.indexOf(letter);
        if (index !== -1) {
          result[Math.floor(index / 2)] = directions[index % 2];
        }
      }
      return result;
    }
    for (const i in positionArray) {
      if (positionToCodeType(positionArray[i]) !== codeType) {
        continue;
      }
      for (let j = 0; j < code.length; j++) {
        if (storedValues[i] === code[j]) {
          result[j] = positionArray[i];
        }
        if (code[j] === "*") {
          result[j] = "*";
        }
      }
    }
    return result;
  }

  function positionToInitCode(position: string[]) {
    let result = "";
    if (position.length === 8) {
      const positionMap = "LKIHCBFEZYTSNMQP";
      for (let i = 0; i < position.length; i++) {
        if (position[i] === "cw") {
          result += positionMap[i * 2];
        } else if (position[i] === "ccw") {
          result += positionMap[i * 2 + 1];
        }
      }
      return result.split("").sort().join("");
    }
    for (const pos of position) {
      const index = positionArray.indexOf(pos);
      if (index !== -1) {
        result += initialInputValues[index];
      }
      if (pos === "*") {
        result += "*";
      }
    }
    return result;
  }

  function positionToCustomCode(position: string[]) {
    let storedValues = "";
    if (typeof localStorage !== "undefined") {
      storedValues =
        localStorage.getItem(localStorageKey) ?? initialInputValues;
    }
    let result = "";
    if (position.length === 8) {
      const indices = [
        20, 27, 29, 36, 11, 18, 38, 9, 33, 26, 42, 35, 24, 17, 15, 44,
      ];
      const positionMap = indices.map((index) => storedValues[index]).join("");
      for (let i = 0; i < position.length; i++) {
        if (position[i] === "cw") {
          result += positionMap[i * 2];
        } else if (position[i] === "ccw") {
          result += positionMap[i * 2 + 1];
        }
      }
      return result.split("").sort().join("");
    }
    for (const pos of position) {
      const index = positionArray.indexOf(pos);
      if (index !== -1) {
        result += storedValues[index];
      }
      if (pos === "*") {
        result += "*";
      }
    }
    return result;
  }

  function generateCyclicPermutations(arr: string[]): string[] {
    const permutations: string[] = [];
    for (const str of arr) {
      for (let j = 0; j < str.length; j++) {
        const rotatedStr = str.slice(j) + str.slice(0, j);
        permutations.push(rotatedStr);
      }
    }
    return permutations;
  }

  function cartesianProduct(arrays: string[][]): string[] {
    return arrays.reduce((a, b) => a.flatMap((x) => b.map((y) => x + y)));
  }

  function customCodeToVariantCode(
    code: string,
    codeType: string,
    mirrorLR = false,
  ) {
    if (codeType === "flips") {
      return customCodeToVariantCode(code, "edge");
    }
    if (codeType === "parity") {
      return cartesianProduct([
        customCodeToVariantCode(code.slice(0, 2), "edge"),
        customCodeToVariantCode(code.slice(2, 4), "corner"),
      ]);
    }
    if (codeType === "ltct") {
      return customCodeToVariantCode(code.slice(0, 2), "corner").map(
        (codes: string) =>
          codes + customCodeToInitCode(code[2] ?? "", "corner"),
      );
    }
    let result = customCodeToPosition(code, codeType);
    if (mirrorLR) {
      result = result.map((pos) => {
        return pos.replace(/L/gu, "_").replace(/R/gu, "L").replace(/_/gu, "R");
      });
    }
    if (codeType === "twists") {
      return [positionToInitCode(result)];
    }
    const displacePositions: string[][] = [result];
    for (let i = 1; i < codeTypeToNumber(codeType); i++) {
      displacePositions.push(
        displacePositions[i - 1].map((pos) => nextPositionsMap[pos]),
      );
    }
    const displaceCode = displacePositions
      .map((pos) => positionToInitCode(pos))
      .filter((initCode) => initCode.trim() !== "");
    const variantCode = generateCyclicPermutations(displaceCode);
    return variantCode;
  }

  function initCodeToCustomCode(code: string, codeType: string) {
    if (codeType === "flips") {
      return initCodeToCustomCode(code, "edge");
    }
    if (codeType === "twists") {
      return initCodeToCustomCode(code, "corner");
    }
    if (codeType === "parity") {
      return (
        initCodeToCustomCode(code.slice(0, 2), "edge") +
        initCodeToCustomCode(code.slice(2, 4), "corner")
      );
    }
    if (codeType === "ltct") {
      return initCodeToCustomCode(code, "corner");
    }
    let storedValues = "";
    if (typeof localStorage !== "undefined") {
      storedValues =
        localStorage.getItem(localStorageKey) ?? initialInputValues;
    }
    const result: string[] = Array(code.length).fill(" ");
    for (const i in positionArray) {
      if (positionToCodeType(positionArray[i]) !== codeType) {
        continue;
      }
      for (let j = 0; j < code.length; j++) {
        if (initialInputValues[i] === code[j]) {
          result[j] = storedValues[i];
        }
      }
    }
    return result.join("");
  }

  function customCodeToVariantCustomCode(
    code: string,
    codeType: string,
    mirrorLR = false,
  ) {
    if (codeType === "flips") {
      return cartesianProduct([customCodeToVariantCustomCode(code, "edge")]);
    }
    if (codeType === "twists") {
      return [code];
    }
    if (codeType === "parity") {
      return cartesianProduct([
        customCodeToVariantCustomCode(code.slice(0, 2), "edge"),
        customCodeToVariantCustomCode(code.slice(2, 4), "corner"),
      ]);
    }
    if (codeType === "ltct") {
      return customCodeToVariantCustomCode(code.slice(0, 2), "corner").map(
        (codes: string) => codes + (code[2] ?? ""),
      );
    }
    let result = customCodeToPosition(code, codeType);
    if (mirrorLR) {
      result = result.map((pos) => {
        return pos.replace(/L/gu, "_").replace(/R/gu, "L").replace(/_/gu, "R");
      });
    }
    const displacePositions: string[][] = [result];
    for (let i = 1; i < codeTypeToNumber(codeType); i++) {
      displacePositions.push(
        displacePositions[i - 1].map((pos) => nextPositionsMap[pos]),
      );
    }
    const displaceCode = displacePositions
      .map((pos) => positionToCustomCode(pos))
      .filter((initCode) => initCode.trim() !== "");
    const variantCode = generateCyclicPermutations(displaceCode);
    return variantCode;
  }

  function initCodeToVariantCustomCode(
    code: string,
    codeType: string,
    mirrorLR = false,
  ) {
    return customCodeToVariantCustomCode(
      initCodeToCustomCode(code, codeType),
      codeType,
      mirrorLR,
    );
  }

  function codeTypeToPositions(codeType: string) {
    if (codeType === "twists") {
      return ["cw", "ccw"];
    }
    if (codeType === "corner0") {
      return positionArray.filter(
        (position) =>
          positionToCodeType(position) === "corner" &&
          (position[0] === "U" || position[0] === "D"),
      );
    }
    if (codeType === "corner1") {
      return positionArray.filter(
        (position) =>
          positionToCodeType(position) === "corner" &&
          position[0] !== "U" &&
          position[0] !== "D",
      );
    }
    if (codeType === "edge0") {
      return positionArray.filter(
        (position) =>
          positionToCodeType(position) === "edge" &&
          (position[0] === "U" ||
            position[0] === "D" ||
            position === "FL" ||
            position === "FR" ||
            position === "BL" ||
            position === "BR"),
      );
    }
    if (codeType === "edge1") {
      return positionArray.filter(
        (position) =>
          positionToCodeType(position) === "edge" &&
          position[0] !== "U" &&
          position[0] !== "D" &&
          position !== "FL" &&
          position !== "FR" &&
          position !== "BL" &&
          position !== "BR",
      );
    }
    return positionArray.filter(
      (position) => positionToCodeType(position) === codeType,
    );
  }

  return {
    positionToCodeType,
    customCodeToInitCode,
    customCodeToPosition,
    positionToCustomCode,
    customCodeToVariantCode,
    codeTypeToNumber,
    initCodeToVariantCustomCode,
    codeTypeToPositions,
    initialInputValues,
    letteringSchemes,
    positionArray,
  };
})();

export default codeConverter;
