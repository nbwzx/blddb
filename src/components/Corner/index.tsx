"use client";
import corner_output from "public/data/json/corner_output.json";
import { useState } from "react";
import React from "react";
import commutator from "@/utils/commutator";
import { useTranslation } from "react-i18next";

const Corner = () => {
  const { t } = useTranslation();
  const [name, setInputText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputText(newValue.toUpperCase());
  };
  return (
    <>
      <section className="pb-[120px] pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                <h2 className="mb-8 text-center text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                  {t("corner.title")}
                </h2>
                <p>{t("corner.hint")}</p>
                <div className="mb-8">
                  <label
                    htmlFor="name"
                    className="mb-3 mt-4 inline-block font-bold text-dark dark:text-white"
                  >
                    {t("pairs")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder=""
                    className="text-transform: ml-2 w-[4rem] rounded-sm border-b-[3px] border-gray-500 bg-inherit px-3 py-1 text-base uppercase text-dark outline-none outline-none transition-all duration-300 focus:border-primary dark:border-gray-100 dark:bg-inherit dark:text-white dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    autoComplete="off"
                    maxLength={3}
                    value={name}
                    onChange={handleInputChange}
                  />
                  <div className="mt-4">
                    {Object.entries(corner_output).map(([key, value]) => {
                      if (key !== name) {
                        return null;
                      }
                      return (
                        <table key={key}>
                          <thead>
                            <tr>
                              <th>No.</th>
                              <th>Algorithm</th>
                              <th>Commutator</th>
                              <th>Thumb Position</th>
                            </tr>
                          </thead>
                          <tbody>
                            {value.map((item, index) => (
                              <tr key={`${key}-${index}`}>
                                <td>{index + 1}</td>
                                <td>{item}</td>
                                <td>
                                  {
                                    commutator.search({
                                      algorithm: item,
                                      maxDepth: 1,
                                    })[0]
                                  }
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Corner;
