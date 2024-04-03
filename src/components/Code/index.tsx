"use client";
import React, { useEffect, useState, useRef } from "react";
import codeConverter from "@/utils/codeConverter";
import { useTranslation } from "@/i18n/client";

const Code = ({ cubeSize }: { cubeSize: number }) => {
  const { t } = useTranslation();
  const faceSize = cubeSize * cubeSize;
  const elementRef = useRef<HTMLDivElement>(null);
  const [cellWidth, setWidth] = useState(0);
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
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [cubeSize]);

  const faces = [
    "face-u white",
    "face-l orange",
    "face-f green",
    "face-r red",
    "face-b blue",
    "face-d yellow",
  ];
  const letteringSchemes = codeConverter.letteringSchemes;
  const [inputValues, setInputValues] = useState("");

  useEffect(() => {
    const initialInputValues = codeConverter.initialInputValues;
    const storedValues = localStorage.getItem("code");
    if (storedValues) {
      setInputValues(storedValues);
    } else {
      setInputValues(initialInputValues);
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    const updatedValues =
      inputValues.substring(0, index) +
      (value[0]?.toUpperCase() ?? " ") +
      inputValues.substring(index + 1);
    setInputValues(updatedValues);
    localStorage.setItem("code", updatedValues);
  };

  return (
    <section className="pb-[120px] pt-[100px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-10/12">
            <h2 className="mb-8 text-center text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
              {t("code.title")}
            </h2>
            <div className="mb-5">
              {t("code.setting")}
              {Object.entries(letteringSchemes).map(([scheme, value]) => (
                <div
                  key={scheme}
                  className="mb-1 ml-4 mt-1 inline-block cursor-pointer rounded-sm border-2 border-black bg-white px-4 py-2 text-base font-semibold text-black duration-300 ease-in-out hover:text-primary dark:border-white dark:bg-dark dark:text-white dark:hover:text-primary"
                  onClick={() => {
                    setInputValues(value);
                    localStorage.setItem("code", value);
                  }}
                >
                  {t("code." + scheme)}
                </div>
              ))}
            </div>
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
                        !(cellIndex === (faceSize - 1) / 2) ? (
                          <input
                            key={faceIndex * faceSize + cellIndex}
                            type="text"
                            className={`relative h-full w-full rounded-none border-l-2  border-t-2 border-black bg-transparent p-0 text-center uppercase leading-normal text-dark outline-none hover:cursor-pointer hover:bg-black/40`}
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
                        ) : (
                          <div
                            className="rounded-none border-l-2 border-t-2 border-black"
                            key={faceIndex * faceSize + cellIndex}
                          ></div>
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
