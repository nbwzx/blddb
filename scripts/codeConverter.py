# Automatically converted from codeConverter.ts
from typing import List, Dict, Union

letteringSchemes: Dict[str, str] = {
    "Chichu": "DEGC GAAJEDCX TQLMBBLS QNJYKHIR ZZPSHFFY WTNPWIXK OOMR",
    "Speffz": "AABD BDCCEEFH FHGGIIJL JLKKMMNP NPOOQQRT RTSSUUVX VXWW",
}
initialInputValues: str = letteringSchemes["Chichu"]
positionArray: List[str] = [
    "UBL", "UB", "UBR", "UL", "U", "UR", "UFL", "UF", "UFR",
    "LUB", "LU", "LUF", "LB", "L", "LF", "LDB", "LD", "LDF",
    "FUL", "FU", "FUR", "FL", "F", "FR", "FDL", "FD", "FDR",
    "RUF", "RU", "RUB", "RF", "R", "RB", "RDF", "RD", "RDB",
    "BUR", "BU", "BUL", "BR", "B", "BL", "BDR", "BD", "BDL",
    "DFL", "DF", "DFR", "DL", "D", "DR", "DBL", "DB", "DBR",
]
nextPositionsMap: Dict[str, str] = {
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
}


def codeTypeToNumber(codeType: str) -> int:
    codeTypeToNumberMap: Dict[str, int] = {
        "edge": 2,
        "corner": 3,
    }
    return codeTypeToNumberMap.get(codeType, 1)


def positionToCodeType(position: str) -> str:
    if position not in positionArray:
        return ""
    positionLengthToCodeType: Dict[int, str] = {
        1: "center",
        2: "edge",
        3: "corner",
    }
    return positionLengthToCodeType.get(len(position), "")


def positionToInitCode(position: List[str]) -> str:
    result = ""
    for pos in position:
        if pos in positionArray:
            index = positionArray.index(pos)
            result += initialInputValues[index]
    return result


def generateCyclicPermutations(arr: List[str]) -> List[str]:
    permutations = []
    for string in arr:
        for j in range(len(string)):
            rotatedStr = string[j:] + string[:j]
            permutations.append(rotatedStr)
    return permutations


def positionToVariantCode(result: List[str], codeType: str) -> List[str]:
    for pos in result:
        if pos not in positionArray:
            return []
    displacePositions = [result]
    for i in range(1, codeTypeToNumber(codeType)):
        displacePositions.append(
            list(
                map(lambda pos: nextPositionsMap[pos], displacePositions[i - 1]))
        )
    displaceCode = list(filter(lambda initCode: initCode.strip() != "", map(
        lambda pos: positionToInitCode(pos), displacePositions)))
    variantCode = generateCyclicPermutations(displaceCode)
    return variantCode
