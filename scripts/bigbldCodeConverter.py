# Automatically converted from bigbldCodeConverter.ts
from typing import List, Dict, Union

letteringSchemes: Dict[str, str] = {
    "Chichu": "DEE G DEGGCC GGCAAJ A AAJEDD C EDCTXX TTXQLM Q LLMBBB L BBLQSS QQSNJY N JJYKHH I KHIZRR ZZRZPS Z PPSHFF F HFFWYY WWYTNP T NNPWII X WIXOKKOOOKOMR O MMR",
    "Speffz": "AAA B AABBDD BBDDCC D CCCEEE F EEFFHH FFHHGG H GGGIII J IIJJLL JJLLKK L KKKMMM N MMNNPP NNPPOO P OOOQQQ R QQRRTT RRTTSS T SSSUUU V UUVVXXUVVXXWW X WWW",
}
initialInputValues: str = letteringSchemes["Chichu"]
positionArray: List[str] = [
    # U layer
    "UBL", "UBl", "UB", "UBr", "UBR",
    "ULb", "Ubl", "Ub", "Ubr", "URb",
    "UL", "Ul", "U", "Ur", "UR",
    "ULf", "Ufl", "Uf", "Ufr", "URf",
    "UFL", "UFl", "UF", "UFr", "UFR",
    # L layer
    "LUB", "LUb", "LU", "LUf", "LUF",
    "LBu", "Lub", "Lu", "Luf", "LFu",
    "LB", "Lb", "L", "Lf", "LF",
    "LBd", "Ldb", "Ld", "Ldf", "LFd",
    "LDB", "LDb", "LD", "LDf", "LDF",
    # F layer
    "FUL", "FUl", "FU", "FUr", "FUR",
    "FLu", "Ful", "Fu", "Fur", "FRu",
    "FL", "Fl", "F", "Fr", "FR",
    "FLd", "Fdl", "Fd", "Fdr", "FRd",
    "FDL", "FDl", "FD", "FDr", "FDR",
    # R layer
    "RUF", "RUf", "RU", "RUb", "RUB",
    "RFu", "Ruf", "Ru", "Rub", "RBu",
    "RF", "Rf", "R", "Rb", "RB",
    "RFd", "Rfd", "Rd", "Rdb", "RBd",
    "RDF", "RDf", "RD", "RDb", "RDB",
    # B layer
    "BUR", "BUr", "BU", "BUl", "BUL",
    "BRu", "Bur", "Bu", "Bul", "BLu",
    "BR", "Br", "B", "Bl", "BL",
    "BRd", "Bdr", "Bd", "Bdl", "BLd",
    "BDR", "BDr", "BD", "BDl", "BDL",
    # D layer
    "DFL", "DFl", "DF", "DFr", "DFR",
    "DLf", "Dfl", "Df", "Dfr", "DRf",
    "DL", "Dl", "D", "Dr", "DR",
    "DLb", "Dbl", "Db", "Dbr", "DRb",
    "DBL", "DBl", "DB", "DBr", "DBR",
]
nextPositionsMap: Dict[str, str] = {
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
}


def codeTypeToNumber(codeType: str) -> int:
    codeTypeToNumberMap: Dict[str, int] = {
        "midge": 2,
        "wing": 2,
    }
    return codeTypeToNumberMap.get(codeType, 1)


def positionToCodeType(position: str) -> str:
    if position not in positionArray:
        return ""
    if len(position) == 1:
        return "center"
    elif len(position) == 2:
        if position[1].lower() == position[1]:
            return "tcenter"
        return "midge"
    elif len(position) == 3:
        if position[2].lower() == position[2]:
            if position[1].lower() == position[1]:
                return "xcenter"
            elif initialInputValues[positionArray.index(position)] != " ":
                return "wing"
            return ""
        return "corner"
    return ""


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
