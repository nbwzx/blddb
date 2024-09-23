import json
import os
import re
import sys
import time

import commutator
import gspread as gs
from google.auth.exceptions import TransportError
from gspread.exceptions import APIError, SpreadsheetNotFound
from loguru import logger
from requests.exceptions import ConnectionError, ProxyError, ReadTimeout

import bigbldCodeConverter
from tracer_555 import *

MAX_STM = 20
MAX_CELL_LEN = 60


def is_included(substring: str, main_string: str, pattern_type: str) -> bool:
    patterns = {
        "basic": re.escape(substring),
        "non_alphabetic": r"(?<![a-zA-Z])" + re.escape(substring) + r"(?![a-zA-Z])",
        "non_alphanumeric": r"(?<![a-zA-Z0-9])" + re.escape(substring) + r"(?![a-zA-Z0-9])",
        "non_alphabetic_strict": r"(?<![a-zA-Z':2])" + re.escape(substring) + r"(?![a-zA-Z':2])",
        "ignore_case": re.escape(substring),
    }
    pattern = patterns[pattern_type]
    flags = re.IGNORECASE if pattern_type == "ignore_case" else 0
    return re.search(pattern, main_string, flags) is not None


def is_pattern(patterns: dict, main_string: str) -> bool:
    for pattern_type in patterns:
        if any(is_included(word, main_string, pattern_type) for word in patterns[pattern_type]):
            return True
    return False


def get_pattern(patterns: dict, main_string: str) -> str:
    for pattern_type in patterns:
        for word in patterns[pattern_type]:
            if is_included(word, main_string, pattern_type):
                return word
    return ""


def sum_of_kinch(source: list, result_json: dict) -> float:
    total_sum = 0
    for item in source:
        if item in result_json:
            total_sum += 1 / result_json[item]
    return total_sum


def main():
    def crawl_spreadsheet(spreadsheet: gs.Spreadsheet, isInverse: bool) -> None:
        def crawl_cell(cell: str, output_type_from_pattern: str = "", code_from_pattern: list = []) -> None:
            cell_is5bld = False
            for line in re.split(r'[\n\r]+| if | or | and ', cell.strip("\n\r")):
                if len(line) > MAX_CELL_LEN:
                    continue
                alg_original = line

                patterns_5bld = {
                    "ignore_case":
                    ["5BLD", "5x5"]
                }
                if is_pattern(patterns_5bld, alg_original):
                    cell_is5bld = True
                if not (("M" in alg_original or "E" in alg_original or "S" in alg_original) and ("m" in alg_original or "e" in alg_original or "s" in alg_original)):
                    if is_pattern(patterns_midge, title):
                        alg_original = alg_original.replace(
                            "M", "m").replace("E", "e").replace("S", "s")
                    if is_pattern(patterns_tcenter, title):
                        alg_original = alg_original.replace(
                            "M", "m").replace("E", "e").replace("S", "s")
                    if is_pattern(patterns_wing, title):
                        alg_original = alg_original.replace(
                            "m", "M").replace("e", "E").replace("s", "S")
                    # xcenter is complex, m and M are both used.
                if is5bld == False and cell_is5bld == False:
                    # make 4bld algs to 5bld
                    replacements = [("3Rw", "4Rw"), ("3Lw", "4Lw"), ("3Uw", "4Uw"),
                                    ("3Dw", "4Dw"), ("3Fw", "4Fw"), ("3Bw", "4Bw")]
                    for old, new in replacements:
                        if old in alg_original and "4" not in alg_original:
                            alg_original = alg_original.replace(old, new)
                if isInverse:
                    alg_original = commutator.expand_555(
                        alg_original, isInverse=isInverse)
                    alg = alg_original
                else:
                    alg = commutator.expand_555(alg_original)
                output_type, code = get_code_auto(alg)
                if output_type_from_pattern:
                    if output_type_from_pattern != output_type or (code not in code_from_pattern and code[0] + code[2] + code[1] not in code_from_pattern):
                        continue
                if output_type in output_types and len(code) > 0 and stm(alg) <= MAX_STM:
                    if code not in algs_json[output_type]:
                        algs_json[output_type][code] = []
                    if not isInverse:
                        code_used_original[output_type].add(code)
                    if isInverse:
                        if code in code_used_original[output_type]:
                            continue
                    code_used[output_type].add(code)
                    alg_used[output_type].add(alg)
                    is_new = True
                    for all_algs in algs_json[output_type][code]:
                        if commutator.expand_555_final(alg) == commutator.expand_555_final(all_algs[0]):
                            is_new = False
                            if qtm(alg) < qtm(all_algs[0]):
                                all_algs[0] = alg
                            if "," in alg_original or "/" in alg_original:
                                all_algs[2].append(commutator.expand_555(alg_original))
                            if name not in all_algs[1]:
                                all_algs[1].append(name)
                                all_algs[1].sort()
                    if is_new:
                        if "," in alg_original or "/" in alg_original:
                            algs_json[output_type][code].append(
                                [alg, [name], [commutator.expand_555(alg_original)]])
                        else:
                            algs_json[output_type][code].append(
                                [alg, [name], []])
                    algs_json[output_type][code].sort(
                        key=lambda line: -len(line[1]))

        while True:
            try:
                worksheets = spreadsheet.worksheets()
                break
            except (TransportError, APIError, ConnectionError, ProxyError, ReadTimeout) as e:
                logger.warning(e.__class__.__name__ +
                               " when getting the worksheets.")
                time.sleep(10)

        for worksheet in worksheets:
            start_time = time.time()
            title = re.sub(r"\s", " ", worksheet.title.strip())
            if worksheet.isSheetHidden:
                logger.info("\t\t" + title + ": " + str(round(time.time() -
                            start_time, 2)) + " seconds." + " Ignored because it is hidden.")
                continue
            code_used_old = {output_type: len(code_used[output_type])
                             for output_type in output_types}
            alg_used_old = {output_type: len(alg_used[output_type])
                            for output_type in output_types}

            patterns = {
                "ignore_case":
                ["UF5", "5 Cycle", "5-Cycle", "5 Style", "5-Style",
                 "6BLD", "7BLD",
                 "twist", "flip", "parity", "2e2c", "2c2e",
                 "2t", "2f", "3f",
                 "2e2e", "2c2c", "ltct", "ltef",
                 "Info", "Intro", "Readme", "Read me", "作者", "说明", "前言",
                 "Custom", "Letter", "Scheme", "Setting", "From", "设置", "编码", "参考",
                 "test",
                 "Ignore",
                 "Oblique",
                 "OH"]
            }

            patterns_midge = {
                "ignore_case":
                ["midge", "中棱"],
                "non_alphanumeric":
                ["m", "M"]
            }
            patterns_wing = {
                "ignore_case":
                ["wing", "翼棱"],
                "non_alphabetic":
                ["UFl", "URf", "ULb", "UBr", "RUb", "RFu", "RDf", "RBd", "LUf", "LFd", "LDb", "LBu",
                    "FUr", "FRd", "FLu", "FDl", "DRb", "DLf", "DFr", "DBl", "BUl", "BRu", "BLd", "BDr",
                    "URb", "ULf", "UFr", "UBl", "RUf", "RFd", "RDb", "RBu", "LUb", "LFu", "LDf", "LBd",
                    "FUl", "FRu", "FLd", "FDr", "DRf", "DLb", "DFl", "DBr", "BRr", "BRd", "BLu", "BDl"],
                "non_alphanumeric":
                ["w", "W"]
            }
            patterns_tcenter = {
                "ignore_case":
                ["+",
                    "+C", "+-C",
                    "TC", "T-C",
                    "边心"],
                "non_alphabetic":
                ["Uf", "Ul", "Ub", "Ur", "Df", "Dl", "Db", "Dr", "Fr", "Fl", "Bl", "Br",
                    "Fu", "Lu", "Bu", "Ru", "Fd", "Ld", "Bd", "Rd", "Rf", "Lf", "Lb", "Rb"],
                "non_alphanumeric":
                ["t", "T"]
            }
            patterns_xcenter = {
                "ignore_case":
                ["XC", "X-C",
                    "角心"],
                "non_alphabetic":
                ["Urb", "Ulf", "Ufr", "Ubl", "Ruf", "Rfd", "Rdb", "Rbu", "Lub", "Lfu", "Ldf", "Lbd",
                    "Ful", "Fru", "Fld", "Fdr", "Drf", "Dlb", "Dfl", "Dbr", "Bur", "Brd", "Blu", "Bdl",
                    "Ufl", "Urf", "Ulb", "Ubr", "Rub", "Rfu", "Rdf", "Rbd", "Luf", "Lfd", "Ldb", "Lbu",
                    "Fur", "Frd", "Flu", "Fdl", "Drb", "Dlf", "Dfr", "Dbl", "Bul", "Bru", "Bld", "Bdr"],
                "non_alphanumeric":
                ["x", "X"]
            }

            patterns_5bld = {
                "non_alphabetic_strict":
                [x for x in bigbldCodeConverter.positionArray if len(x) != 1]
            }

            if is_pattern(patterns, title):
                logger.info("\t\t" + worksheet.title + ": " + str(round(time.time() -
                            start_time, 2)) + " seconds." + " Ignored because it contains disallowed word.")
                continue

            while True:
                try:
                    values = worksheet.get_values()
                    notes = worksheet.get_notes()
                    break
                except (TransportError, APIError, ConnectionError, ProxyError, ReadTimeout) as e:
                    logger.warning(
                        e.__class__.__name__ + " when trying to get values from the spreadsheet.")
                    time.sleep(10)
                except Exception as e:
                    logger.error(e.__class__.__name__ +
                                 " when trying to get values from the spreadsheet.")
                    time.sleep(10)
            is5bld = False
            if (is_pattern(patterns_midge, title)) or (is_pattern(patterns_tcenter, title)):
                is5bld = True
            else:
                for rows in values:
                    for cell in rows:
                        if any(x in cell for x in ["4Rw", "4Lw", "4Uw", "4Dw", "4Fw", "4Bw"]):
                            is5bld = True
            buffer = get_pattern(patterns_5bld, title)
            if values == [[]]:
                continue
            top_list = []
            for cell in values[0]:
                top_list.append(get_pattern(patterns_5bld, cell))
            left_list = []
            for rows in values:
                left_list.append(get_pattern(patterns_5bld, rows[0]))
            for i in range(len(values)):
                for j in range(len(values[i])):
                    cell = values[i][j]
                    cell_pattern = get_pattern(patterns_5bld, cell)
                    if cell_pattern and ((not top_list[j]) or (not left_list[i])):
                        top_list[j] = cell_pattern
                        left_list[i] = cell_pattern
                    output_type_from_pattern = ""
                    code_from_pattern = []
                    if bigbldCodeConverter.positionToCodeType(buffer) == bigbldCodeConverter.positionToCodeType(top_list[j]) and bigbldCodeConverter.positionToCodeType(buffer) == bigbldCodeConverter.positionToCodeType(left_list[i]):
                        output_type_from_pattern = bigbldCodeConverter.positionToCodeType(
                            buffer)
                        code_from_pattern = bigbldCodeConverter.positionToVariantCode(
                            [buffer, left_list[i], top_list[j]], output_type_from_pattern)

                    crawl_cell(cell, output_type_from_pattern,
                               code_from_pattern)
                    try:
                        crawl_cell(notes[i][j], output_type_from_pattern,
                                   code_from_pattern)
                    except IndexError:
                        pass
            code_used_delta = {output_type: len(code_used[output_type]) - code_used_old[output_type]
                               for output_type in output_types}
            alg_used_delta = {output_type: len(alg_used[output_type]) - alg_used_old[output_type]
                              for output_type in output_types}
            logger.info("\t\t" + worksheet.title + ": " + str(round(time.time() - start_time, 2)) +
                        " seconds." + " Found code: " + str(code_used_delta) + " and alg: " + str(alg_used_delta))

    # 📍 What are Google Sheets limits? (Quick Answer)

    # Cell Limit: 10 million cells
    # Column Limit: 18278 columns
    # Row Limit: no row limit, depends if you’ve exceeded 10 million cell limit
    # API Limits (Read requests): 300 Per minute per project, 60 Per minute per user per project
    # API Limits (Write requests): 300 Per minute per project, 60 Per minute per user per project
    # File Size Limit: 100MB
    # Query Limit: no set limit but if it’s too complex your sheet will be very slow.

    logger.remove(0)
    # logger.add("scripts/file_main_555.log", format="{time:HH:mm:ss} | {level} | {message}")
    logger.add(sys.stderr, format="{time:HH:mm:ss} | {level} | {message}")
    output_types = ["wing", "xcenter", "tcenter", "midge"]
    algs_json = {output_type: {} for output_type in output_types}

    url_file = "assets/json/sourceToUrl.json"
    with open(url_file, "r", encoding="utf8") as file:
        url_json = json.load(file)
    url_json_new = {}

    try:
        gc = gs.service_account_from_dict(
            json.loads(os.environ["SERVICE_ACCOUNT"]))
    except KeyError:
        gc = gs.service_account(filename="scripts/service_account.json")
    gc.set_timeout(60)

    for name in url_json:
        code_used_original = {output_type: set()
                              for output_type in output_types}
        code_used = {output_type: set() for output_type in output_types}
        alg_used = {output_type: set() for output_type in output_types}
        url_json_new[name] = {}
        for key in url_json[name]:
            url = url_json[name][key]
            logger.info(name)
            logger.info(url)
            issuccess = False
            while True:
                try:
                    spreadsheet = gc.open_by_url(url)
                    issuccess = True
                    break
                except (TransportError, APIError, ConnectionError, ProxyError, ReadTimeout) as e:
                    logger.warning(e.__class__.__name__ +
                                   " when opening the spreadsheet.")
                    time.sleep(10)
                except (SpreadsheetNotFound, PermissionError) as e:
                    break
            if not issuccess:
                logger.error("Failed to open the spreadsheet.")
                continue
            url_json_new[name][key] = url_json[name][key]
            if key not in output_types and key != "bigbld" and key != "bld":
                logger.info("Ignored because it is not in the output types.")
                continue
            logger.info("\tOriginal:")
            crawl_spreadsheet(spreadsheet, False)
            logger.info("\tInverse:")
            crawl_spreadsheet(spreadsheet, True)

        if not url_json_new[name]:
            del url_json_new[name]
        logger.info("Code: " + str({output_type: len(code_used[output_type])
                                    for output_type in output_types}))
        logger.info("Alg: " + str({output_type: len(alg_used[output_type])
                                   for output_type in output_types}))

    url_json_new = dict(sorted(url_json_new.items()))
    url_json_dumps = json.dumps(url_json_new, indent=4, ensure_ascii=False)
    with open(url_file, "w", encoding="utf8") as file:
        file.write(url_json_dumps)

    algs_json = dict(sorted(algs_json.items()))

    result_file = "scripts/bigbldSourceToResult.json"
    try:
        with open(result_file, "r", encoding="utf8") as file:
            result_json = json.load(file)
    except FileNotFoundError:
        result_json = {}

    algs_json_dumps = {output_type: "" for output_type in output_types}
    for output_type in output_types:
        output_file = "assets/json/bigbld/bigbld" + \
            output_type.capitalize() + "AlgToInfoManmade.json"
        for algs in algs_json[output_type]:
            for alg in algs_json[output_type][algs]:
                best_alg = alg[0]
                if len(alg[2]) > 0:
                    best_alg = max(alg[2], key=lambda x: alg[2].count(x))
                commutator_alg = commutator.search_555(best_alg)[0]
                if commutator_alg == "Not found.":
                    alg[2] = commutator.search_555_final(
                            commutator.expand_555_final(best_alg))[0]
                else:
                    alg[2] = commutator_alg
                alg[2] = commutator.finalReplaceCommutator(alg[2])
            for i in range(len(algs_json[output_type][algs])):
                algs_json[output_type][algs][i][0] = commutator.finalReplaceAlg(
                    algs_json[output_type][algs][i][0])
            algs_json[output_type][algs] = sorted(
                algs_json[output_type][algs], key=lambda x: (-len(x[1]), -sum_of_kinch(x[1], result_json)))

        algs_json[output_type] = dict(sorted(algs_json[output_type].items()))
        algs_json_dumps[output_type] = json.dumps(
            algs_json[output_type], indent=4, ensure_ascii=False)
        with open(output_file, "w", encoding="utf8") as filef:
            filef.write(algs_json_dumps[output_type])


if __name__ == "__main__":
    main()
