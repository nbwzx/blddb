import json
import os
import re
import sys
import time
import urllib.parse

import commutator
import gspread as gs
import requests
import scrapetube
from google.auth.exceptions import TransportError
from gspread.exceptions import APIError, SpreadsheetNotFound
from loguru import logger
from requests.exceptions import ConnectionError, ProxyError, ReadTimeout

from tracer import *

MAX_STM = 20
MAX_CELL_LEN = 60


def main():
    def crawl_cell(cell: str) -> bool:
        for line in re.split(r'[\n\r]+| if | or | and ', cell.strip("\n\r")):
            if len(line) > MAX_CELL_LEN:
                continue
            alg = commutator.expand(line)
            alg = add_rotation(alg)
            alg = commutator.expand(alg, isInverse=isInverse)
            output_type, code = get_code_auto(alg, edge_ch, corner_ch)
            if output_type in output_types and len(code) > 0 and stm(alg) <= MAX_STM:
                if code not in algs_json[output_type]:
                    algs_json[output_type][code] = []
                is_new = True
                for all_algs in algs_json[output_type][code]:
                    if alg == all_algs[0]:
                        is_new = False
                if is_new:
                    algs_json[output_type][code].append([alg, commutator.search(
                        alg)[0], url_name, video[0], video[1]])
                    if output_type == "edge":
                        position = "-".join([edgeCodeToPos[char]
                                            for char in code])
                    elif output_type == "corner":
                        position = "-".join([cornerCodeToPos[char]
                                            for char in code])
                    elif output_type == "2flips":
                        position = edgeCodeToPos[code[0]] + \
                            " & " + edgeCodeToPos[code[1]]
                    elif output_type == "2twists":
                        position = cornerCodeToPos[code[0]] + \
                            " & " + cornerCodeToPos[code[1]]
                    elif output_type == "parity":
                        position = "-".join([edgeCodeToPos[char] for char in code[0:2]]) + ", " + "-".join(
                            [cornerCodeToPos[char] for char in code[2:4]])
                    elif output_type == "ltct":
                        position = "-".join([edgeCodeToPos[char] for char in code[0:2]]) + ", " + "-".join(
                            [cornerCodeToPos[char] for char in code[2:4]]) + "[" + cornerCodeToPos[code[4]] + "]"

                    full_list[output_type].append([position, alg, commutator.search(
                        alg)[0], url_name, '=HIPERLINK("' + video[1] + '";"' + video[0] + '")'])
                return True
        return False

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
    output_types = ["edge", "corner", "2flips", "2twists", "parity", "ltct"]
    isInverse = False
    edge_ch = "ABEFGHCDQRSTIJMNOPKLYZWX"
    corner_ch = "JKLABCGHIDEFXYZWMNRSTOPQ"
    edge_order_buffer = [
        "UF", "UB", "UR", "UL", "FR", "FL", "DF", "DB", "DR", "DL", "BR", "BL"
    ]
    corner_order_buffer = [
        "UFR", "UFL", "UBR", "UBL", "DFR", "DFL", "DBR", "DBL"
    ]
    edge_order = [
        "UB", "UL", "UR", "UF", "LU", "LB", "LF", "LD", "FU", "FL", "FR", "FD",
        "RU", "RF", "RB", "RD", "BU", "BR", "BL", "BD", "DF", "DL", "DR", "DB"
    ]
    corner_order = [
        "UBL", "UBR", "UFL", "UFR", "LUB", "LUF", "LDB", "LDF", "FUL", "FUR", "FDL", "FDR",
        "RUF", "RUB", "RDF", "RDB", "BUR", "BUL", "BDR", "BDL", "DFL", "DFR", "DBL", "DBR"
    ]
    edgeCodeToPos = {
        "E": "UB",
        "C": "UL",
        "G": "UR",
        "A": "UF",
        "D": "LU",
        "X": "LB",
        "T": "LF",
        "L": "LD",
        "B": "FU",
        "S": "FL",
        "Q": "FR",
        "J": "FD",
        "H": "RU",
        "R": "RF",
        "Z": "RB",
        "P": "RD",
        "F": "BU",
        "Y": "BR",
        "W": "BL",
        "N": "BD",
        "I": "DF",
        "K": "DL",
        "O": "DR",
        "M": "DB"
    }
    cornerCodeToPos = {
        "D": "UBL",
        "G": "UBR",
        "A": "UFL",
        "J": "UFR",
        "E": "LUB",
        "C": "LUF",
        "Q": "LDB",
        "M": "LDF",
        "B": "FUL",
        "L": "FUR",
        "N": "FDL",
        "Y": "FDR",
        "K": "RUF",
        "I": "RUB",
        "Z": "RDF",
        "S": "RDB",
        "H": "BUR",
        "F": "BUL",
        "T": "BDR",
        "P": "BDL",
        "W": "DFL",
        "X": "DFR",
        "O": "DBL",
        "R": "DBR"
    }

    url_file = "scripts/sourceToYoutube.json"
    with open(url_file, "r", encoding="utf8") as file:
        url_json = json.load(file)

    try:
        gc = gs.service_account_from_dict(
            json.loads(os.environ["SERVICE_ACCOUNT"]))
    except KeyError:
        gc = gs.service_account(filename="scripts/service_account.json")
    gc.set_timeout(60)

    for name in url_json:
        full_list = {}
        for output_type in output_types:
            full_list[output_type] = []
        algs_json = {output_type: {} for output_type in output_types}
        videos = scrapetube.get_channel(channel_username=url_json[name][0])

        video_list = []
        for video in videos:
            video_list.append([video['title']['runs'][0]['text'],
                               "https://www.youtube.com/watch?v=" + video['videoId']])

        logger.info(name)
        logger.info("Total videos: " + str(len(video_list)))
        for video in video_list:
            # nednoodlehead
            full_html = ""
            while True:
                try:
                    full_html = requests.get(video[1], timeout=10).text
                    break
                except Exception as e:
                    logger.warning(e.__class__.__name__ +
                                   " when opening " + video[1])
                    time.sleep(10)
            y = re.search(r'attributedDescription":{"content":"', full_html)
            desc = ""
            if y is None:
                # no description
                continue
            count = y.start() + 35  # adding the length of the attributedDescription":{"content":"
            while True:
                # get the letter at current index in text
                letter = full_html[count]
                if letter == "\"":
                    if full_html[count - 1] == "\\":
                        # this is case where the letter before is a backslash, meaning it is not real end of description
                        desc += letter
                        count += 1
                    else:
                        break
                else:
                    desc += letter
                    count += 1

            urls = re.findall(r'(https?://[^\s\\\u200b]+)', desc)

            for url_name in urls:
                if "alg.cubing.net" not in url_name and "bit.ly" not in url_name and "tinyurl.com" not in url_name and "tinyurl.com" not in url_name:
                    continue
                while True:
                    try:
                        resp = requests.get(url_name, timeout=10).url
                        break
                    except Exception as e:
                        logger.warning(e.__class__.__name__ +
                                       " when opening " + url_name)
                        time.sleep(10)
                if resp.startswith("https://alg.cubing.net/") and "&puzzle=4x4x4" not in resp and "&puzzle=5x5x5" not in resp:
                    resp_parsed = urllib.parse.unquote(resp).replace(
                        "_", " ").replace("-", "'")
                    isPlus2 = "+2" in resp_parsed.split("alg=")[0].replace(" ", "")
                    text = resp_parsed.split("alg=")[1]
                    last_alg = ""
                    for text_row in text.splitlines():
                        if text_row.replace(" ", "") != "" and not text_row.replace(" ", "").startswith("//"):
                            last_alg = text_row
                    for text_row in text.splitlines():
                        cell = ""
                        if text_row.find("//") == -1:
                            cell = text_row
                        else:
                            cell = text_row[0:text_row.find("//")]
                        isAlg = crawl_cell(cell)
                        if (not isAlg) and text_row.rfind("]") != -1:
                            cell = text_row[text_row.find(
                                "//") + 2:text_row.rfind("]") + 1]
                            isAlg = crawl_cell(cell)
                        for moves in ["R", "U", "D", "R'", "U'", "D'", "R2", "U2", "D2"]:
                            if not isAlg:
                                if isPlus2 and text_row == last_alg:
                                    isAlg = crawl_cell(cell + " " + moves)
                                else:
                                    isAlg = crawl_cell(moves + " " + cell)
                            else:
                                break

        issuccess = False
        while True:
            try:
                spreadsheet = gc.open_by_url(url_json[name][1])
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

        while True:
            try:
                worksheets = spreadsheet.worksheets()
                for sheet in worksheets:
                    if sheet.title == "Readme":
                        continue
                    spreadsheet.del_worksheet(sheet)
                break
            except (TransportError, APIError, ConnectionError, ProxyError, ReadTimeout) as e:
                logger.warning(e.__class__.__name__ +
                               " when getting the worksheets. (1)")
                time.sleep(10)
        for title_x in output_types:
            try:
                spreadsheet.add_worksheet(
                    title=title_x, rows=3000, cols=50)
            except:
                pass
        while True:
            try:
                worksheets = spreadsheet.worksheets()
                break
            except (TransportError, APIError, ConnectionError, ProxyError, ReadTimeout) as e:
                logger.warning(e.__class__.__name__ +
                               " when getting the worksheets. (2)")
                time.sleep(10)

        full_list["edge"] = sorted(full_list["edge"], key=lambda x: (
            edge_order_buffer.index(x[0].split("-")[0]), edge_order.index(x[0].split("-")[1]), edge_order.index(x[0].split("-")[2])))
        full_list["corner"] = sorted(full_list["corner"], key=lambda x: (
            corner_order_buffer.index(x[0].split("-")[0]), corner_order.index(x[0].split("-")[1]), corner_order.index(x[0].split("-")[2])))
        full_list["2flips"] = sorted(full_list["2flips"], key=lambda x: (
            edge_order_buffer.index(x[0].split("&")[0].strip()), edge_order.index(x[0].split("&")[1].strip())))
        full_list["2twists"] = sorted(full_list["2twists"], key=lambda x: (
            corner_order_buffer.index(x[0].split("&")[0].strip()), corner_order.index(x[0].split("&")[1].strip())))
        full_list["parity"] = sorted(full_list["parity"], key=lambda x: (
            edge_order_buffer.index(x[0].split(",")[0].strip().split("-")[0]), edge_order.index(x[0].split(",")[0].strip().split("-")[1]), corner_order_buffer.index(x[0].split(",")[1].strip().split("-")[0]), corner_order.index(x[0].split(",")[1].strip().split("-")[1])))
        # It has some bugs in columns_auto_size, so I have to do it manually.
        full_list["edge"].insert(
            0, ["Position" + " " * 10, "Alg" + " " * 70, "Commutator" + " " * 20, "Reconstruction Link", "Youtube Link"])
        full_list["corner"].insert(
            0, ["Position" + " " * 15, "Alg" + " " * 70, "Commutator" + " " * 20, "Reconstruction Link", "Youtube Link"])
        full_list["2flips"].insert(
            0, ["Position" + " " * 10, "Alg" + " " * 70, "Commutator" + " " * 40, "Reconstruction Link", "Youtube Link"])
        full_list["2twists"].insert(
            0, ["Position (cw & ccw)", "Alg" + " " * 90, "Commutator" + " " * 40, "Reconstruction Link", "Youtube Link"])
        full_list["parity"].insert(
            0, ["Position" + " " * 20, "Alg" + " " * 90, "Commutator", "Reconstruction Link", "Youtube Link"])
        full_list["ltct"].insert(
            0, ["Position" + " " * 30, "Alg" + " " * 90, "Commutator", "Reconstruction Link", "Youtube Link"])
        for worksheet in worksheets:
            if worksheet.title in full_list:
                while True:
                    try:
                        worksheet.update(
                            values=full_list[worksheet.title], range_name="A1:ZZ10000", value_input_option='USER_ENTERED')
                        worksheet = worksheet.columns_auto_resize(0, 5)
                        break
                    except (TransportError, APIError, ConnectionError, ProxyError, ReadTimeout) as e:
                        logger.warning(e.__class__.__name__ +
                                    " when updating the worksheet.")
                        time.sleep(10)


if __name__ == "__main__":
    main()
