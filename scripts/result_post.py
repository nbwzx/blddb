import json
import sys

from loguru import logger


def main():
    logger.remove(0)
    logger.add(sys.stderr, format="{time:HH:mm:ss} | {level} | {message}")
    with open("public/data/sourceToUrl.json", "r", encoding="utf-8") as file:
        algs_json = json.load(file)

    with open("public/data/sourceToResult.json", "r", encoding="utf-8") as file:
        results = json.load(file)

    for key in list(results.keys()):
        if key not in algs_json:
            results.pop(key)

    results = dict(sorted(results.items()))
    results_json = json.dumps(results, ensure_ascii=False, indent=4)
    with open("public/data/sourceToResult.json", "w", encoding="utf-8") as file:
        file.write(results_json)

    logger.info("Results written to JSON files successfully.")


if __name__ == "__main__":
    main()
