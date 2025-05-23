"use client";

import React, { useEffect, useState, useRef } from "react";
import codeConverter from "@/utils/codeConverter";
import bigbldCodeConverter from "@/utils/bigbldCodeConverter";
import { useTranslation } from "@/i18n/client";
import Loading from "@/app/loading";

const Code = ({ cubeSize }: { cubeSize: 3 | 5 }) => {
  const { t } = useTranslation();
  const faceSize = cubeSize * cubeSize;
  const elementRef = useRef<HTMLDivElement>(null);
  const [cellWidth, setWidth] = useState(0);
  const localStorageKey = cubeSize === 3 ? "code" : "bigbldCode";
  const [loading, setLoading] = useState(true);
  const [faces, setFaces] = useState([
    "face-u white",
    "face-l orange",
    "face-f green",
    "face-r red",
    "face-b blue",
    "face-d yellow",
  ]);
  const faceList = ["u", "l", "f", "r", "b", "d"];
  const colorList = ["white", "orange", "green", "red", "blue", "yellow"];
  // prettier-ignore
  const orientations = [
    "wg", "wr", "wb", "wo",
    "yg", "yr", "yb", "yo",
    "ob", "ow", "oy", "og",
    "rb", "rw", "ry", "rg",
    "go", "gy", "gw", "gr",
    "bo", "by", "bw", "br",
  ];
  const facesMap = [
    [0, 1, 2, 3, 4, 5],
    [0, 2, 3, 4, 1, 5],
    [0, 3, 4, 1, 2, 5],
    [0, 4, 1, 2, 3, 5],
    [5, 3, 2, 1, 4, 0],
    [5, 4, 3, 2, 1, 0],
    [5, 1, 4, 3, 2, 0],
    [5, 2, 1, 4, 3, 0],
    [1, 0, 4, 5, 2, 3],
    [1, 2, 0, 4, 5, 3],
    [1, 4, 5, 2, 0, 3],
    [1, 5, 2, 0, 4, 3],
    [3, 5, 4, 0, 2, 1],
    [3, 4, 0, 2, 5, 1],
    [3, 2, 5, 4, 0, 1],
    [3, 0, 2, 5, 4, 1],
    [2, 0, 1, 5, 3, 4],
    [2, 1, 5, 3, 0, 4],
    [2, 3, 0, 1, 5, 4],
    [2, 5, 3, 0, 1, 4],
    [4, 5, 1, 0, 3, 2],
    [4, 3, 5, 1, 0, 2],
    [4, 1, 0, 3, 5, 2],
    [4, 0, 3, 5, 1, 2],
  ];
  const [selectedOrientationIndex, setSelectedOrientationIndex] = useState(0);
  const handleOrientationChange = (selectedIndex: number) => {
    const selectedColor = facesMap[selectedIndex].map((key) => colorList[key]);
    const newFaces = selectedColor.map(
      (color, i) => `face-${faceList[i]} ${color}`,
    );
    setFaces(newFaces);
    setSelectedOrientationIndex(selectedIndex);
    localStorage.setItem("orientation", orientations[selectedIndex]);
  };

  const letteringSchemes = {
    3: codeConverter.letteringSchemes,
    5: bigbldCodeConverter.letteringSchemes,
  };
  const [inputValues, setInputValues] = useState("");
  const notEditableCells = [
    [1, 15, 9, 23],
    [3, 5, 19, 21],
  ];
  const [isStandard, setIsStandard] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (elementRef.current) {
        setWidth(
          Math.min(
            Math.trunc(elementRef.current.offsetWidth / cubeSize / 4),
            50,
          ),
        );
      }
    };
    if (loading) {
      return undefined;
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [cubeSize, loading]);

  const swapCharacters = (array: string[], index1: number, index2: number) => {
    [array[index1], array[index2]] = [array[index2], array[index1]];
    return array;
  };

  const handleWingCoding = (isStandardBool: boolean) => {
    const initialInputValues = {
      3: codeConverter.initialInputValues,
      5: bigbldCodeConverter.initialInputValues,
    };
    setIsStandard(isStandardBool);
    const storedValues =
      localStorage.getItem(localStorageKey) ?? initialInputValues[cubeSize];
    if (
      (storedValues[notEditableCells[0][0]] === " " && isStandardBool) ||
      (storedValues[notEditableCells[1][0]] === " " && !isStandardBool)
    ) {
      let storedValuesArray = storedValues.split("");
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
          storedValuesArray = swapCharacters(
            storedValuesArray,
            25 * i + notEditableCells[0][j],
            25 * i + notEditableCells[1][j],
          );
        }
      }
      const updatedValues = storedValuesArray.join("");
      setInputValues(updatedValues);
      localStorage.setItem(localStorageKey, updatedValues);
    }
  };

  useEffect(() => {
    if (cubeSize === 5) {
      const storedValues = localStorage.getItem(localStorageKey);
      // The index 1 is notEditableCells[0][0]
      if (storedValues && storedValues[1] === " ") {
        setIsStandard(false);
      }
    }
    const initialInputValues = {
      3: codeConverter.initialInputValues,
      5: bigbldCodeConverter.initialInputValues,
    };
    const storedValues =
      localStorage.getItem(localStorageKey) ?? initialInputValues[cubeSize];
    setInputValues(storedValues);
    const savedOrientation = localStorage.getItem("orientation") ?? "wg";
    const index = orientations.indexOf(savedOrientation);
    if (index !== -1) {
      const selectedColor = facesMap[index].map((key) => colorList[key]);
      const newFaces = selectedColor.map(
        (color, i) => `face-${faceList[i]} ${color}`,
      );
      setFaces(newFaces);
      setSelectedOrientationIndex(index);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cubeSize, localStorageKey]);

  const handleChange = (index: number, value: string) => {
    const updatedValues =
      inputValues.substring(0, index) +
      (value[0]?.toUpperCase() ?? " ") +
      inputValues.substring(index + 1);
    setInputValues(updatedValues);
    localStorage.setItem(localStorageKey, updatedValues);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="pb-[120px] pt-[100px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-10/12">
            <h2 className="mb-8 text-center text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
              {cubeSize === 3 ? t("code.3BLD") : t("code.BigBLD")}
            </h2>
            <div className="mb-5">
              {" "}
              <div className="inline-block font-bold text-black dark:text-white">
                {t("code.setting")}
              </div>
              <div className="inline-block">
                {Object.entries(letteringSchemes[cubeSize]).map(
                  ([scheme, value]) => (
                    <div
                      key={scheme}
                      className="mb-1 ml-4 mt-1 inline-block cursor-pointer rounded-sm border-2 border-black bg-white px-4 py-2 text-base font-semibold text-black duration-300 ease-in-out hover:text-primary dark:border-white dark:bg-dark dark:text-white dark:hover:text-primary"
                      onClick={() => {
                        setInputValues(value);
                        const settings = JSON.parse(
                          localStorage.getItem("settings") ?? "{}",
                        );
                        const newSettings = {
                          ...settings,
                          orderOfAlgs: scheme,
                        };
                        localStorage.setItem(
                          "settings",
                          JSON.stringify(newSettings),
                        );
                        if (cubeSize === 5) {
                          setIsStandard(true);
                        }
                        localStorage.setItem(localStorageKey, value);
                      }}
                    >
                      {t(`code.${scheme}`)}
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="mb-5">
              <div className="mr-2 inline-block font-bold text-dark dark:text-white">
                {t("code.orientation")}
              </div>
              <select
                className="rounded-sm border-b-[3px] border-gray-500 bg-inherit py-1 pr-4 text-base font-medium text-dark outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-gray-dark dark:text-white dark:shadow-none dark:focus:border-primary dark:focus:shadow-none"
                onChange={(e) =>
                  handleOrientationChange(Number(e.target.value))
                }
                value={selectedOrientationIndex}
              >
                {orientations.map((orientation, index) => (
                  <option key={index} value={index}>
                    {t(`code.orientationOptions.${orientation}`)}
                  </option>
                ))}
              </select>
            </div>
            {cubeSize === 5 && (
              <div className="mb-5 flex">
                {" "}
                <div className="inline-block  font-bold text-black dark:text-white">
                  {t("code.wingCodeSetting")}
                </div>
                <span
                  onClick={() => handleWingCoding(true)}
                  className={`${
                    isStandard
                      ? "pointer-events-none text-primary"
                      : "text-dark dark:text-white"
                  } ml-4 mr-4 cursor-pointer text-base font-semibold`}
                >
                  {t("code.wingCode1")}
                </span>
                <div
                  onClick={() => handleWingCoding(!isStandard)}
                  className="flex cursor-pointer items-center"
                >
                  <div className="relative">
                    <div className="h-5 w-14 rounded-full bg-[#1D2144] shadow-inner"></div>
                    <div
                      className={`${
                        isStandard ? "" : "translate-x-full"
                      } shadow-switch-1 absolute left-0 top-[-4px] flex h-7 w-7 items-center justify-center rounded-full bg-primary transition`}
                    >
                      <span className="active h-4 w-4 rounded-full bg-white"></span>
                    </div>
                  </div>
                </div>
                <span
                  onClick={() => handleWingCoding(false)}
                  className={`${
                    isStandard
                      ? "text-dark dark:text-white"
                      : "pointer-events-none text-primary"
                  } ml-4 cursor-pointer text-base font-semibold`}
                >
                  {t("code.wingCode2")}
                </span>
              </div>
            )}
            <div ref={elementRef} className="flex items-center justify-center">
              {cellWidth !== 0 && (
                <div
                  className="relative grid grid-cols-4 grid-rows-3"
                  style={{
                    height: `${3 * cubeSize * cellWidth}px`,
                    width: `${4 * cubeSize * cellWidth}px`,
                  }}
                >
                  {faces.map((face, faceIndex) => (
                    <div
                      className={`${face} absolute grid`}
                      style={{
                        gridTemplateRows: `repeat(${cubeSize}, ${cellWidth}px)`,
                        gridTemplateColumns: `repeat(${cubeSize}, ${cellWidth}px)`,
                      }}
                      key={faceIndex}
                    >
                      {Array.from({ length: faceSize }).map((_, cellIndex) =>
                        cellIndex === (faceSize - 1) / 2 ||
                        (cubeSize === 5 &&
                          notEditableCells[Number(isStandard)].includes(
                            cellIndex,
                          )) ? (
                          <div
                            className="rounded-none border-l-2 border-t-2 border-black"
                            key={faceIndex * faceSize + cellIndex}
                          ></div>
                        ) : (
                          <input
                            key={faceIndex * faceSize + cellIndex}
                            type="text"
                            className={
                              "relative h-full w-full rounded-none border-l-2  border-t-2 border-black bg-transparent p-0 text-center uppercase leading-normal text-dark outline-none hover:cursor-pointer hover:bg-black/40"
                            }
                            style={{ fontSize: `${0.75 * cellWidth}px` }}
                            onFocus={(e) => e.target.select()}
                            maxLength={1}
                            value={(
                              inputValues[faceIndex * faceSize + cellIndex] ??
                              ""
                            ).trim()}
                            onChange={(e) =>
                              handleChange(
                                faceIndex * faceSize + cellIndex,
                                e.target.value ?? "",
                              )
                            }
                          />
                        ),
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Code;
