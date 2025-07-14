"use client";

import React, { useState, useRef, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import commutator from "@/utils/commutator";
import finger from "@/utils/finger";
import { useTranslation } from "@/i18n/client";
import data from "public/data/cornerNightmare.json";
import useResponsiveTable from "@/utils/useResponsiveTable";
import Loading from "@/app/loading";
import { useTheme } from "next-themes";

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

const defaultData: Record<string, string[]> = Object.fromEntries(
  Object.entries(data).filter(([key]) => key.startsWith("J")),
);

const defaultOptions: Record<string, Option[]> = {};
for (const [key, value] of Object.entries(defaultData)) {
  defaultOptions[key] = value.map(createOption);
}

const Custom = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [options, setOptions] =
    useState<Record<string, Option[]>>(defaultOptions);
  const [values, setValues] = useState<Record<string, Option | null>>({});
  const { theme } = useTheme();
  const tableRef = useRef<HTMLTableElement>(
    null as unknown as HTMLTableElement,
  );
  const divRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);

  useResponsiveTable(tableRef, divRef);

  const handleCreate = (inputValue: string, index: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(
        commutator.expand({ algorithm: inputValue }),
      );
      setIsLoading(false);
      setOptions((prev) => {
        const newOptions = { ...prev };
        newOptions[index] = [newOption, ...newOptions[index]];
        return newOptions;
      });
      updateValue(newOption, index);
    }, 100);
  };

  const customIsValidNewOption = (
    inputValue: string,
    selectValue: Option[],
    selectOptions: Option[],
  ) => {
    const expandValue = commutator.expand({ algorithm: inputValue });
    const hasValue = selectValue.some((option) => option.label === inputValue);
    const hasOption = selectOptions.some(
      (option) => option.label === expandValue,
    );
    return !(expandValue === "" || hasValue || hasOption);
  };

  const customFilterOption = (option: Option, inputValue: string) => {
    const expandValue = commutator.expand({ algorithm: inputValue });
    return (
      option.label.startsWith(expandValue) || option.label.startsWith("Create ")
    );
  };

  const updateValue = (value: Option | null, index: string) => {
    setValues((prev) => {
      const newValues = { ...prev };
      newValues[index] = value;
      return newValues;
    });
    commutatorRefs.current[index].textContent = value
      ? commutator.search({ algorithm: value.label })[0]
      : "";
    const fingerResult = finger
      .fingerbeginfrom(value ? value.label : "")
      .map((word) => t(word))
      .join("/");
    thumbPositionRefs.current[index].textContent = value ? fingerResult : "";
  };
  const targetHeight = 22;
  const customStyles = {
    singleValue: (base: any) => ({
      ...base,
      color: theme === "light" ? "black" : "white",
      height: `${targetHeight - 1 - 1}px`,
      lineHeight: `${targetHeight - 1 - 1}px`,
      paddingBottom: "0px",
      paddingTop: "0px",
    }),
    input: (base: any) => ({
      ...base,
      color: theme === "light" ? "black" : "white",
      marginTop: "0px",
      marginBottom: "0px",
      paddingTop: "0px",
      paddingBottom: "0px",
    }),
    control: (base: any) => ({
      ...base,
      border: "0px",
      boxShadow: "none",
      backgroundColor: "transparent",
      minHeight: "initial",
    }),
    clearIndicator: (base: any) => ({
      ...base,
      padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: "0 8px",
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
    }),
    menu: (base: any) => ({
      ...base,
      padding: 0,
      margin: "1px",
      outline: "none",
      backgroundColor: theme === "light" ? "#EEEEEE" : "#616161",
      lineHeight: 1,
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0,
    }),
  };

  const commutatorRefs = useRef<HTMLTableCellElement[]>([]);
  const thumbPositionRefs = useRef<HTMLTableCellElement[]>([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <section className="pb-[120px] pt-[100px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-10/12">
              <h2 className="mb-8 text-center text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                {t("custom.title")}
              </h2>
              <div ref={divRef}>
                <table ref={tableRef}>
                  <thead>
                    <tr>
                      <th style={{ width: "7.5%" }}>Letters</th>
                      <th style={{ width: "43%", minWidth: "32em", zIndex: 2 }}>
                        Algorithm
                      </th>
                      <th style={{ width: "27.5%", minWidth: "20em" }}>
                        Commutator
                      </th>
                      <th style={{ width: "22%" }}>Thumb Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(defaultOptions).map(([index]) => (
                      <tr key={index}>
                        <td className="px-0 py-0">{index}</td>
                        <td className="px-0 py-0">
                          <CreatableSelect
                            instanceId={index}
                            isClearable={true}
                            isDisabled={isLoading}
                            isLoading={isLoading}
                            onChange={(newValue) =>
                              updateValue(newValue, index)
                            }
                            createOptionPosition="first"
                            onCreateOption={(newValue) =>
                              handleCreate(newValue, index)
                            }
                            options={options[index]}
                            value={values[index]}
                            isValidNewOption={customIsValidNewOption}
                            filterOption={customFilterOption}
                            styles={customStyles}
                            formatCreateLabel={(inputValue: string) =>
                              `Create ${inputValue}`
                            }
                            theme={(themeInput) => ({
                              ...themeInput,
                              borderRadius: 0,
                              colors: {
                                ...themeInput.colors,
                                primary25:
                                  theme === "light" ? "#B2D4FF" : "#85C1E9",
                                primary50:
                                  theme === "light" ? "#B2D4FF" : "#85C1E9",
                              },
                            })}
                          />
                        </td>
                        <td
                          className="px-0 py-0"
                          ref={(ref) => {
                            commutatorRefs.current[index] =
                              ref as HTMLTableCellElement;
                          }}
                        ></td>
                        <td
                          className="px-0 py-0"
                          ref={(ref) => {
                            thumbPositionRefs.current[index] =
                              ref as HTMLTableCellElement;
                          }}
                        ></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Custom;
