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

from rewrite import single
from tracer import *

MAX_STM = 20
MAX_CELL_LEN = 60


def is_included(substring: str, main_string: str, pattern_type: str) -> bool:
    patterns = {
        "basic": re.escape(substring),
        "non_alphabetic": r"(?<![a-zA-Z])" + re.escape(substring) + r"(?![a-zA-Z])",
        "non_alphanumeric": r"(?<![a-zA-Z0-9])" + re.escape(substring) + r"(?![a-zA-Z0-9])",
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


def sum_of_kinch(source: list, result_json: dict) -> float:
    total_sum = 0
    for item in source:
        if item in result_json:
            total_sum += 1 / result_json[item]
    return total_sum


def main():
    def crawl_spreadsheet(spreadsheet: gs.Spreadsheet, isInverse: bool) -> None:
        def crawl_cell(cell: str) -> None:
            for line in re.split(r'[\n\r]+| if | or | and ', cell.strip("\n\r")):
                if len(line) > MAX_CELL_LEN:
                    continue
                alg = commutator.expand(line, isInverse=isInverse)
                output_type, code = get_code_auto(alg)
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
                        if alg == all_algs[0]:
                            is_new = False
                            if name not in all_algs[1]:
                                all_algs[1].append(name)
                                all_algs[1].sort()
                    if is_new:
                        algs_json[output_type][code].append([alg, [name]])

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
                 "4x4", "5x5", "6x6", "7x7",
                 "4BLD", "5BLD", "6BLD", "7BLD",
                 "wing", "midge", "center", "centre",
                 "XC", "X-C",
                 "+C", "+-C",
                 "TC", "T-C",
                 "翼棱", "中棱", "角心", "边心",
                 "test",
                 "Ignore",
                 "Oblique",
                 "OH"],
                "non_alphabetic":
                ["UFl", "URf", "ULb", "UBr", "RUb", "RFu", "RDf", "RBd", "LUf", "LFd", "LDb", "LBu",
                 "FUr", "FRd", "FLu", "FDl", "DRb", "DLf", "DFr", "DBl", "BUl", "BRu", "BLd", "BDr",
                 "URb", "ULf", "UFr", "UBl", "RUf", "RFd", "RDb", "RBu", "LUb", "LFu", "LDf", "LBd",
                 "FUl", "FRu", "FLd", "FDr", "DRf", "DLb", "DFl", "DBr", "BRr", "BRd", "BLu", "BDl",
                 "Urb", "Ulf", "Ufr", "Ubl", "Ruf", "Rfd", "Rdb", "Rbu", "Lub", "Lfu", "Ldf", "Lbd",
                 "Ful", "Fru", "Fld", "Fdr", "Drf", "Dlb", "Dfl", "Dbr", "Bur", "Brd", "Blu", "Bdl",
                 "Ufl", "Urf", "Ulb", "Ubr", "Rub", "Rfu", "Rdf", "Rbd", "Luf", "Lfd", "Ldb", "Lbu",
                 "Fur", "Frd", "Flu", "Fdl", "Drb", "Dlf", "Dfr", "Dbl", "Bul", "Bru", "Bld", "Bdr",
                 "Uf", "Ul", "Ub", "Ur", "Df", "Dl", "Db", "Dr", "Fr", "Fl", "Bl", "Br",
                 "Fu", "Lu", "Bu", "Ru", "Fd", "Ld", "Bd", "Rd", "Rf", "Lf", "Lb", "Rb"],
                "non_alphanumeric":
                ["t", "x", "m", "w", "T", "X", "M", "W"]
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
            isbigbld = False
            for rows in values:
                for cell in rows:
                    if any(x in cell for x in ["3Rw", "3Lw", "3Uw", "3Dw", "3Fw", "3Bw", "3Rw", "3Lw", "4Uw", "4Dw", "4Fw", "4Bw"]):
                        isbigbld = True
            if isbigbld:
                logger.info("\t\t" + worksheet.title + ": " + str(round(time.time() -
                            start_time, 2)) + " seconds." + " Ignored because it is a bigBLD sheet.")
                continue
            for rows in values:
                for cell in rows:
                    crawl_cell(cell)
            for rows in notes:
                for cell in rows:
                    crawl_cell(cell)
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
    # logger.add("scripts/file_main.log", format="{time:HH:mm:ss} | {level} | {message}")
    logger.add(sys.stderr, format="{time:HH:mm:ss} | {level} | {message}")
    output_types = ["edge", "corner"]
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
        for url in url_json[name]:
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
                except (SpreadsheetNotFound) as e:
                    break
            if not issuccess:
                logger.error("Failed to open the spreadsheet.")
                continue
            url_json_new[name] = url_json[name]
            logger.info("\tOriginal:")
            crawl_spreadsheet(spreadsheet, False)
            logger.info("\tInverse:")
            crawl_spreadsheet(spreadsheet, True)

        logger.info("Code: " + str({output_type: len(code_used[output_type])
                                    for output_type in output_types}))
        logger.info("Alg: " + str({output_type: len(alg_used[output_type])
                                   for output_type in output_types}))

    url_json_new = dict(sorted(url_json_new.items()))
    url_json_dumps = json.dumps(url_json_new, indent=4, ensure_ascii=False)
    with open(url_file, "w", encoding="utf8") as file:
        file.write(url_json_dumps)

    algs_json = dict(sorted(algs_json.items()))

    result_file = "scripts/sourceToResult.json"
    try:
        with open(result_file, "r", encoding="utf8") as file:
            result_json = json.load(file)
    except FileNotFoundError:
        result_json = {}

    algs_json_new = {output_type: {} for output_type in output_types}
    algs_json_dumps = {output_type: "" for output_type in output_types}
    for output_type in output_types:
        output_file = "assets/json/" + output_type + "AlgToInfoManmade.json"
        for algs in algs_json[output_type]:
            algs_json[output_type][algs].sort(
                key=lambda line: -len(line[1]))
            singleList = []
            groupedValues = {}
            for alg in algs_json[output_type][algs]:
                singleValue = single(alg[0])
                if singleValue in groupedValues:
                    groupedValues[singleValue].append(alg)
                else:
                    groupedValues[singleValue] = [alg]
                    singleList.append(singleValue)

            groupedalg = []
            for i in range(len(singleList)):
                groupedalg.append([])
                for j in groupedValues[singleList[i]]:
                    groupedalg[i].append(j[0])
            groupedsource = []
            for i in range(len(singleList)):
                groupedsource.append([])
                for j in groupedValues[singleList[i]]:
                    groupedsource[i].extend(j[1])
                groupedsource[i] = list(set(groupedsource[i]))
                groupedsource[i].sort()
            algs_json_new[output_type][algs] = []
            for i in range(len(singleList)):
                algs_json_new[output_type][algs].append([])
                algs_json_new[output_type][algs][i] = [
                    groupedalg[i], groupedsource[i]]
            algs_json_new[output_type][algs] = sorted(
                algs_json_new[output_type][algs], key=lambda x: (-len(x[1]), -sum_of_kinch(x[1], result_json)))

        algs_json_new[output_type] = dict(
            sorted(algs_json_new[output_type].items()))
        algs_json_dumps[output_type] = json.dumps(
            algs_json_new[output_type], indent=4, ensure_ascii=False)
        with open(output_file, "w", encoding="utf8") as filef:
            filef.write(algs_json_dumps[output_type])


if __name__ == "__main__":
    main()
