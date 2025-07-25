const bigbldCodeConverter = (function () {
  const localStorageKey = "bigbldCode";
  const letteringSchemes = {
    Chichu:
      "DEE G DEGGCC GGCAAJ A AAJEDD C EDCTXX TTXQLM Q LLMBBB L BBLQSS QQSNJY N JJYKHH I KHIZRR ZZRZPS Z PPSHFF F HFFWYY WWYTNP T NNPWII X WIXOKK OOKOMR O MMR",
    Speffz:
      "AAA B AABBDD BBDDCC D CCCEEE F EEFFHH FFHHGG H GGGIII J IIJJLL JJLLKK L KKKMMM N MMNNPP NNPPOO P OOOQQQ R QQRRTT RRTTSS T SSSUUU V UUVVXX VVXXWW X WWW",
  };
  const initialInputValues = letteringSchemes["Chichu"];
  // prettier-ignore
  const positionArray = [
    // U layer
    "UBL", "UBl", "UB", "UBr", "UBR",
    "ULb", "Ubl", "Ub", "Ubr", "URb",
    "UL", "Ul", "U", "Ur", "UR",
    "ULf", "Ufl", "Uf", "Ufr", "URf",
    "UFL", "UFl", "UF", "UFr", "UFR",
    // L layer
    "LUB", "LUb", "LU", "LUf", "LUF",
    "LBu", "Lub", "Lu", "Luf", "LFu",
    "LB", "Lb", "L", "Lf", "LF",
    "LBd", "Ldb", "Ld", "Ldf", "LFd",
    "LDB", "LDb", "LD", "LDf", "LDF",
    // F layer
    "FUL", "FUl", "FU", "FUr", "FUR",
    "FLu", "Ful", "Fu", "Fur", "FRu",
    "FL", "Fl", "F", "Fr", "FR",
    "FLd", "Fdl", "Fd", "Fdr", "FRd",
    "FDL", "FDl", "FD", "FDr", "FDR",
    // R layer
    "RUF", "RUf", "RU", "RUb", "RUB",
    "RFu", "Ruf", "Ru", "Rub", "RBu",
    "RF", "Rf", "R", "Rb", "RB",
    "RFd", "Rdf", "Rd", "Rdb", "RBd",
    "RDF", "RDf", "RD", "RDb", "RDB",
    // B layer
    "BUR", "BUr", "BU", "BUl", "BUL",
    "BRu", "Bur", "Bu", "Bul", "BLu",
    "BR", "Br", "B", "Bl", "BL",
    "BRd", "Bdr", "Bd", "Bdl", "BLd",
    "BDR", "BDr", "BD", "BDl", "BDL",
    // D layer
    "DFL", "DFl", "DF", "DFr", "DFR",
    "DLf", "Dfl", "Df", "Dfr", "DRf",
    "DL", "Dl", "D", "Dr", "DR",
    "DLb", "Dbl", "Db", "Dbr", "DRb",
    "DBL", "DBl", "DB", "DBr", "DBR",
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
      "UFr", "UFl", "FUl", "FUr",
      "ULf", "ULb", "LUb", "LUf",
      "UBl", "UBr", "BUr", "BUl",
      "URb", "URf", "RUf", "RUb",
      "DFl", "DFr", "FDr", "FDl",
      "DLb", "DLf", "LDf", "LDb",
      "DBr", "DBl", "BDl", "BDr",
      "DRf", "DRb", "RDb", "RDf",
      "FRu", "FRd", "RFd", "RFu",
      "FLd", "FLu", "LFu", "LFd",
      "BLu", "BLd", "LBd", "LBu",
      "BRd", "BRu", "RBu", "RBd",
      "Ufl", "Ful", "Luf",
      "Ubl", "Lub", "Bul",
      "Ubr", "Bur", "Rub",
      "Ufr", "Ruf", "Fur",
      "Dfl", "Ldf", "Fdl",
      "Dbl", "Bdl", "Ldb",
      "Dbr", "Rdb", "Bdr",
      "Dfr", "Fdr", "Rdf",
      "Uf", "Fu",
      "Ul", "Lu",
      "Ub", "Bu",
      "Ur", "Ru",
      "Df", "Fd",
      "Dl", "Ld",
      "Db", "Bd",
      "Dr", "Rd",
      "Fr", "Rf",
      "Fl", "Lf",
      "Bl", "Lb",
      "Br", "Rb",
      "U", "D", "F", "B", "L", "R",
    ],
    Speffz: [
      // U layer
      "UBL", "UBl", "UB", "UBr", "UBR",
      "URb", "Ubl", "Ub", "Ubr", "URf",
      "UR", "Ur", "U", "Uf", "UF",
      "UFr", "Ufr", "Ul", "Ufl", "UFl",
      "UFR", "ULf", "UL", "ULb", "UFL",
      // L layer
      "LUB", "LUb", "LU", "LUf", "LUF",
      "LFu", "Lub", "Lu", "Luf", "LFd",
      "LF", "Lf", "L", "Ld", "LD",
      "LDf", "Ldf", "Lb", "Ldb", "LDb",
      "LDF", "LBd", "LB", "LBu", "LDB",
      // F layer
      "FUL", "FUl", "FU", "FUr", "FUR",
      "FRu", "Ful", "Fu", "Fur", "FRd",
      "FR", "Fr", "F", "Fd", "FD",
      "FDr", "Fdr", "Fl", "Fdl", "FDl",
      "FDR", "FLd", "FL", "FLu", "FDL",
      // R layer
      "RUF", "RUf", "RU", "RUb", "RUB",
      "RBu", "Ruf", "Ru", "Rub", "RBd",
      "RB", "Rb", "R", "Rd", "RD",
      "RDb", "Rdb", "Rf", "Rdf", "RDf",
      "RDB", "RFd", "RF", "RFu", "RDF",
      // B layer
      "BUR", "BUr", "BU", "BUl", "BUL",
      "BLu", "Bur", "Bu", "Bul", "BLd",
      "BL", "Bl", "B", "Bd", "BD",
      "BDl", "Bdl", "Br", "Bdr", "BDr",
      "BDL", "BRd", "BR", "BRu", "BDR",
      // D layer
      "DFL", "DFl", "DF", "DFr", "DFR",
      "DRf", "Dfl", "Df", "Dfr", "DRb",
      "DR", "Dr", "D", "Db", "DB",
      "DBr", "Dbr", "Dl", "Dbl", "DBl",
      "DBR", "DLb", "DL", "DLf", "DBL",
    ],
  };
  // prettier-ignore
  const nextPositionsMap = {
    "UBl": "BUl", "BUl": "UBl",
    "URb": "RUb", "RUb": "URb",
    "UFr": "FUr", "FUr": "UFr",
    "ULf": "LUf", "LUf": "ULf",
    "LUb": "ULb", "ULb": "LUb",
    "LFu": "FLu", "FLu": "LFu",
    "LDf": "DLf", "DLf": "LDf",
    "LBd": "BLd", "BLd": "LBd",
    "FUl": "UFl", "UFl": "FUl",
    "FRu": "RFu", "RFu": "FRu",
    "FDr": "DFr", "DFr": "FDr",
    "FLd": "LFd", "LFd": "FLd",
    "RUf": "URf", "URf": "RUf",
    "RBu": "BRu", "BRu": "RBu",
    "RDb": "DRb", "DRb": "RDb",
    "RFd": "FRd", "FRd": "RFd",
    "BUr": "UBr", "UBr": "BUr",
    "BLu": "LBu", "LBu": "BLu",
    "BDl": "DBl", "DBl": "BDl",
    "BRd": "RBd", "RBd": "BRd",
    "DFl": "FDl", "FDl": "DFl",
    "DRf": "RDf", "RDf": "DRf",
    "DBr": "BDr", "BDr": "DBr",
    "DLb": "LDb", "LDb": "DLb",
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
      midge: 2,
      wing: 2,
    };
    return codeTypeToNumberMap[codeType] || 1;
  }

  function positionToCodeType(position: string): string {
    if (position.length === 1) {
      return "center";
    } else if (position.length === 2) {
      if (position[1].toLowerCase() === position[1]) {
        return "tcenter";
      }
      return "midge";
    } else if (position.length === 3) {
      if (position[2].toLowerCase() === position[2]) {
        let storedValues = "";
        if (typeof localStorage !== "undefined") {
          storedValues =
            localStorage.getItem(localStorageKey) ?? initialInputValues;
        }
        if (position[1].toLowerCase() === position[1]) {
          return "xcenter";
        } else if (storedValues[positionArray.indexOf(position)] !== " ") {
          return "wing";
        }
        return "";
      }
      return "corner";
    }
    return "";
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
      }
    }
    return result.join("");
  }

  function customCodeToPosition(code: string, codeType: string) {
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

  function customCodeToVariantCode(
    code: string,
    codeType: string,
    mirrorLR = false,
  ): string[] {
    let result = customCodeToPosition(code, codeType);
    if (mirrorLR) {
      result = result.map((pos) => {
        return pos
          .replace(/L/gu, "_")
          .replace(/R/gu, "L")
          .replace(/_/gu, "R")
          .replace(/l/gu, "_")
          .replace(/r/gu, "l")
          .replace(/_/gu, "r");
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
      .map((pos) => positionToInitCode(pos))
      .filter((initCode) => initCode.trim() !== "");
    const variantCode = generateCyclicPermutations(displaceCode);
    return variantCode;
  }

  function initCodeToCustomCode(code: string, codeType: string) {
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
    let result = customCodeToPosition(code, codeType);
    if (mirrorLR) {
      result = result.map((pos) => {
        return pos
          .replace(/L/gu, "_")
          .replace(/R/gu, "L")
          .replace(/_/gu, "R")
          .replace(/l/gu, "_")
          .replace(/r/gu, "l")
          .replace(/_/gu, "r");
      });
      if (codeType === "wing") {
        result = result.map((pos) => pos[1] + pos[0] + pos[2]);
      }
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

export default bigbldCodeConverter;
