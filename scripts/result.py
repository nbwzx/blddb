import json
import requests
import sys

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
    with open("public/data/sourceToUrl.json", "r", encoding="utf8") as file:
        algs_json = json.load(file)

    results = {}
    results_444 = {}

    for name in algs_json:
        search_url = f"https://www.worldcubeassociation.org/api/v0/search?q={name}"
        response = requests.get(search_url)

        if response.status_code == 200:
            search_results = response.json().get("result")
            for search_result in search_results:
                if search_result.get("name") != name:
                    continue

                result_name = {}
                wca_id_text = search_result.get("wca_id")
                result_name["wca_id"] = wca_id_text
                person_url = (
                    f"https://www.worldcubeassociation.org/persons/{wca_id_text}"
                )
                response = requests.get(person_url)

                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, "html.parser")
                    links = soup.find_all("a")
                    for link in links:
                        if link.get("href") == "/results/rankings/333bf/single":
                            result_name["3bld"] = parse_time(link.text.strip())
                        if link.get("href") == "/results/rankings/444bf/single":
                            result_name["4bld"] = parse_time(link.text.strip())
                else:
                    logger.error(
                        f"Request to {person_url} failed with status code: {response.status_code}"
                    )
                if name not in results:
                    results[name] = result_name
                else:
                    if "3bld" in result_name and ("3bld" not in results[name] or result_name["3bld"] < results[name]["3bld"]):
                        results[name]["wca_id"] = result_name["wca_id"]
                        results[name]["3bld"] = result_name["3bld"]
                        results[name]["4bld"] = result_name["4bld"]
        else:
            logger.error(
                f"Request to search URL failed for {name} with status code: {response.status_code}"
            )

        logger.info(f"{name}: {results.get(name)}")

    results_json = json.dumps(results, ensure_ascii=False, indent=4)
    with open("public/data/sourceToResult.json", "w", encoding="utf-8") as f:
        f.write(results_json)

    logger.info("Results written to JSON files successfully.")


if __name__ == "__main__":
    main()
