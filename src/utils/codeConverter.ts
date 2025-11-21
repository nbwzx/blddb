const codeConverter = (function () {
  const localStorageKey = "code";
  const letteringSchemes = {
    Chichu: "DEGC GAAJEDCX TQLMBBLS QNJYKHIR ZZPSHFFY WTNPWIXK OOMR",
    Speffz: "AABD BDCCEEFH FHGGIIJL JLKKMMNP NPOOQQRT RTSSUUVX VXWW",
    Clear: " ".repeat(54),
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
  const positionArrays = {
    Chichu: [
      "UFL", "FUL", "LUF",
      "UBL", "LUB", "BUL",
      "UBR", "BUR", "RUB",
      "UFR", "RUF", "FUR",
      "DFL", "LDF", "FDL",
      "DBL", "BDL", "LDB",
      "DBR", "RDB", "BDR",
      "DFR", "FDR", "RDF",
      "UF", "FU",
      "UL", "LU",
      "UB", "BU",
      "UR", "RU",
      "DF", "FD",
      "DL", "LD",
      "DB", "BD",
      "DR", "RD",
      "FR", "RF",
      "FL", "LF",
      "BL", "LB",
      "BR", "RB",
      "U", "D", "F", "B", "L", "R",
    ],
    Speffz: [
      "UBL", "UB", "UBR", "UR", "U", "UF", "UFR", "UL", "UFL",
      "LUB", "LU", "LUF", "LF", "L", "LD", "LDF", "LB", "LDB",
      "FUL", "FU", "FUR", "FR", "F", "FD", "FDR", "FL", "FDL",
      "RUF", "RU", "RUB", "RB", "R", "RD", "RDB", "RF", "RDF",
      "BUR", "BU", "BUL", "BL", "B", "BD", "BDL", "BR", "BDR",
      "DFL", "DF", "DFR", "DR", "D", "DB", "DBR", "DL", "DBL",
    ],
  };
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
    const codeTypeToNumberMap: Record<string, number> = {
      edge: 2,
      corner: 3,
    };
    return codeTypeToNumberMap[codeType] || 1;
  }

  function positionToCodeType(position: string): string {
    const positionLengthToCodeType: Record<number, string> = {
      1: "center",
      2: "edge",
      3: "corner",
    };

    const len = position.length;
    return positionLengthToCodeType[len] || "";
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

  function customCodeToPosition(code: string, codeType: string): string[] {
    if (codeType === "flips") {
      return customCodeToPosition(code, "edge0");
    }
    if (codeType === "parity") {
      return [
        ...customCodeToPosition(code.slice(0, 2), "edge"),
        ...customCodeToPosition(code.slice(2, 4), "corner"),
      ];
    }
    if (codeType === "ltct") {
      return [
        ...customCodeToPosition(code.slice(0, 2), "corner"),
        ...customCodeToPosition(code.slice(2, 3), "corner1"),
      ];
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
    const validPositions = codeTypeToPositions(codeType);
    for (const i in positionArray) {
      if (!validPositions.includes(positionArray[i])) {
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
    cycle = 0,
  ): string[] {
    if (codeType === "flips") {
      return customCodeToVariantCode(code, "edge", mirrorLR);
    }
    if (codeType === "parity") {
      return cartesianProduct([
        customCodeToVariantCode(code.slice(0, 2), "edge", mirrorLR),
        customCodeToVariantCode(code.slice(2, 4), "corner", mirrorLR),
      ]);
    }
    if (codeType === "ltct") {
      const ltctCycle = ["B", "E", "H", "K", "M", "P", "S", "Y"].includes(
        customCodeToInitCode(code[2] ?? "", "corner"),
      )
        ? 1
        : 2;
      const cornerCode = customCodeToVariantCode(
        code.slice(0, 2),
        "corner",
        mirrorLR,
        ltctCycle,
      );
      return cornerCode.map(
        (codes: string) =>
          codes +
          (mirrorLR
            ? positionToInitCode(
                customCodeToPosition(code[2] ?? "", "corner").map((pos) => {
                  return pos
                    .replace(/L/gu, "_")
                    .replace(/R/gu, "L")
                    .replace(/_/gu, "R");
                }),
              )
            : customCodeToInitCode(code[2] ?? "", "corner")),
      );
    }
    let result = customCodeToPosition(code, codeType);
    if (mirrorLR) {
      result = result.map((pos) => {
        return pos.replace(/L/gu, "_").replace(/R/gu, "L").replace(/_/gu, "R");
      });
    }
    if (codeType === "twists") {
      // prettier-ignore
      if (mirrorLR) {
        result = [
          result[2], result[3], result[0], result[1],
          result[6], result[7], result[4], result[5],
        ];
      }
      return [positionToInitCode(result)];
    }
    const displacePositions: string[][] = [result];
    for (let i = 1; i < codeTypeToNumber(codeType); i++) {
      displacePositions.push(
        displacePositions[i - 1].map(
          (pos) => nextPositionsMap[pos as keyof typeof nextPositionsMap],
        ),
      );
    }
    const displaceCode = displacePositions
      .map((pos) => positionToInitCode(pos))
      .filter((initCode) => initCode.trim() !== "");
    if (cycle > 0) {
      if (code.length < 2) {
        return [];
      }
      displaceCode.push(
        displaceCode[0][1] + displaceCode[cycle % 3][0],
        displaceCode[1][1] + displaceCode[(cycle + 1) % 3][0],
        displaceCode[2][1] + displaceCode[(cycle + 2) % 3][0],
      );
      return displaceCode;
    }
    const variantCode = generateCyclicPermutations(displaceCode);
    return variantCode;
  }

  function initCodeToCustomCode(code: string, codeType: string): string {
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
  ): string[] {
    if (codeType === "flips") {
      return cartesianProduct([
        customCodeToVariantCustomCode(code, "edge", mirrorLR),
      ]);
    }
    if (codeType === "twists") {
      return [code];
    }
    if (codeType === "parity") {
      return cartesianProduct([
        customCodeToVariantCustomCode(code.slice(0, 2), "edge", mirrorLR),
        customCodeToVariantCustomCode(code.slice(2, 4), "corner", mirrorLR),
      ]);
    }
    if (codeType === "ltct") {
      return customCodeToVariantCustomCode(
        code.slice(0, 2),
        "corner",
        mirrorLR,
      ).map(
        (codes: string) =>
          codes +
          (mirrorLR
            ? positionToCustomCode(
                customCodeToPosition(code[2] ?? "", "corner").map((pos) => {
                  return pos
                    .replace(/L/gu, "_")
                    .replace(/R/gu, "L")
                    .replace(/_/gu, "R");
                }),
              )
            : (code[2] ?? "")),
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
        displacePositions[i - 1].map(
          (pos) => nextPositionsMap[pos as keyof typeof nextPositionsMap],
        ),
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

  function getDefaultOrderOfAlgs() {
    const scheme = initialInputValues;
    let storedValues = "";
    if (typeof localStorage !== "undefined") {
      storedValues =
        localStorage.getItem(localStorageKey) ?? initialInputValues;
    }
    const allowedDifferences = 10;
    const minLength = Math.min(storedValues.length, scheme.length);
    let differences = 0;
    for (let i = 0; i < minLength; i++) {
      if (storedValues[i] !== scheme[i]) {
        differences++;
        if (differences > allowedDifferences) {
          return "Speffz";
        }
      }
    }
    differences += Math.abs(storedValues.length - scheme.length);
    return differences <= allowedDifferences ? "Chichu" : "Speffz";
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
    getDefaultOrderOfAlgs,
    initCodeToCustomCode,
    initialInputValues,
    letteringSchemes,
    positionArray,
    positionArrays,
  };
})();

export default codeConverter;
