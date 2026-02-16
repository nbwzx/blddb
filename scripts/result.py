import json
import requests
import sys
import time

from bs4 import BeautifulSoup
from loguru import logger


def parse_time(time_str):
    parts = time_str.split(":")
    total = 0
    num_parts = len(parts)
    if num_parts >= 1:
        total += int(float(parts[-1]) * 100)
    if num_parts >= 2:
        total += int(parts[-2]) * 6000
    if num_parts == 3:
        total += int(parts[-3]) * 360000
    return total


def main():
    logger.remove(0)
    logger.add(sys.stderr, format="{time:HH:mm:ss} | {level} | {message}")
    with open("public/data/sourceToUrl.json", "r", encoding="utf-8") as file:
        algs_json = json.load(file)
    result_file = "public/data/sourceToResult.json"
    try:
        with open(result_file, "r", encoding="utf-8") as file:
            result_json = json.load(file)
    except FileNotFoundError:
        result_json = {}

    results = {}
    algs_new = {}

    for name in algs_json:
        search_param = name
        # Use name in result_json first.
        if name in result_json:
            search_param = result_json[name].get("wca_id")
        search_url = f"https://www.worldcubeassociation.org/api/v0/search?q={search_param}"

        while True:
            try:
                response = requests.get(search_url, timeout=10)
                if response.status_code == 200:
                    search_results = response.json().get("result")
                    break
                else:
                    logger.warning(
                        f"Request to search URL failed for {name} with status code: {response.status_code}"
                    )
                    time.sleep(10)
            except Exception as e:
                logger.warning(str(e) + " when opening " + search_url)
                time.sleep(10)

        new_name = name
        for search_result in search_results:
            if search_result.get("name") != name and search_param == name:
                continue

            new_name = search_result.get("name")
            result_name = {}
            wca_id_text = search_result.get("wca_id")
            result_name["wca_id"] = wca_id_text
            person_url = f"https://www.worldcubeassociation.org/persons/{wca_id_text}"

            while True:
                try:
                    response = requests.get(person_url, timeout=10)

                    if response.status_code == 200:
                        soup = BeautifulSoup(response.text, "html.parser")
                        links = soup.find_all("a")
                        for link in links:
                            if link.get("href") == "/results/rankings/333bf/single":
                                result_name["3bld"] = parse_time(link.text.strip())
                            if link.get("href") == "/results/rankings/444bf/single":
                                result_name["4bld"] = parse_time(link.text.strip())
                        break
                    else:
                        logger.warning(
                            f"Request to {person_url} failed with status code: {response.status_code}"
                        )
                        time.sleep(10)
                except Exception as e:
                    logger.warning(str(e) + " when opening " + person_url)
                    time.sleep(10)

            if new_name not in results:
                results[new_name] = result_name
            else:
                if "3bld" in result_name and (
                    "3bld" not in results[new_name]
                    or result_name["3bld"] < results[new_name]["3bld"]
                ):
                    results[new_name]["wca_id"] = result_name["wca_id"]
                    results[new_name]["3bld"] = result_name["3bld"]
                    results[new_name]["4bld"] = result_name["4bld"]

        logger.info(f"{new_name}: {results.get(new_name)}")
        algs_new[new_name] = algs_json[name]

    results = dict(sorted(results.items()))
    results_json = json.dumps(results, ensure_ascii=False, indent=4)
    with open("public/data/sourceToResult.json", "w", encoding="utf-8") as file:
        file.write(results_json)
    algs_new = dict(sorted(algs_new.items()))
    algs_json_new = json.dumps(algs_new, ensure_ascii=False, indent=4)
    with open("public/data/sourceToUrl.json", "w", encoding="utf-8") as file:
        file.write(algs_json_new)

    logger.info("Results written to JSON files successfully.")


if __name__ == "__main__":
    main()
