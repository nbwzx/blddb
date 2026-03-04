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
import {
  components,
  type DropdownIndicatorProps,
  type ClearIndicatorProps,
  type GroupBase,
  type OptionsOrGroups,
  type StylesConfig,
  IndicatorSeparatorProps,
} from "react-select";
import PageSection from "@/components/PageSection";

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

  const { fontSize } = useResponsiveTable(tableRef, divRef);

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
    value: readonly Option[],
    optionsInput: OptionsOrGroups<Option, GroupBase<Option>>,
  ) => {
    const expandValue = commutator.expand({ algorithm: inputValue });
    const hasValue = value.some((option) => option.label === inputValue);
    const flatOptions: Option[] = [];
    optionsInput.forEach((opt) => {
      if ("options" in opt && Array.isArray(opt.options)) {
        flatOptions.push(...opt.options);
      } else {
        flatOptions.push(opt as Option);
      }
    });
    const hasOption = flatOptions.some(
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
  const targetHeight = Math.trunc(fontSize * 2);
  const iconSize = targetHeight - 2;
  const customStyles: StylesConfig<Option, false> = {
    singleValue: (base) => ({
      ...base,
      color: theme === "light" ? "black" : "white",
      height: `${targetHeight - 1 - 1}px`,
      lineHeight: `${targetHeight - 1 - 1}px`,
      marginTop: "0px",
      marginBottom: "0px",
      paddingBottom: "0px",
      paddingTop: "0px",
      padding: "0px",
      display: "grid",
      gridTemplateRows: "1fr",
      gridTemplateColumns: "1fr auto", // first takes remaining space, second minimal
      margin: "0",
    }),
    input: (base) => ({
      ...base,
      color: theme === "light" ? "black" : "white",
      marginTop: "0px",
      marginBottom: "0px",
      paddingTop: "0px",
      paddingBottom: "0px",
    }),
    control: (base) => ({
      ...base,
      border: "0px",
      boxShadow: "none",
      backgroundColor: "transparent",
      minHeight: "initial",
      padding: "0px",
      display: "grid",
      gridTemplateRows: "1fr",
      gridTemplateColumns: "1fr auto", // first takes remaining space, second minimal
      margin: "0",
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: `${(targetHeight - iconSize - 1 - 1) / 30}px`,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: 0,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: `${(targetHeight - iconSize - 1 - 1) / 30}px`,
    }),
    menu: (base) => ({
      ...base,
      padding: 0,
      margin: "1px",
      outline: "none",
      backgroundColor: theme === "light" ? "#EEEEEE" : "#616161",
      lineHeight: 1,
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
    }),
    option: (base) => ({
      ...base,
      padding: `${fontSize / 2}px`,
    }),
  };

  interface IconProps extends React.SVGProps<SVGSVGElement> {
    path: string;
    size?: number;
  }

  const Icon: React.FC<IconProps> = ({ path, size = 20, ...rest }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
      style={{
        display: "inline-block",
        fill: "currentColor",
        lineHeight: 1,
        stroke: "currentColor",
        strokeWidth: 0,
      }}
      {...rest}
    >
      <path d={path} />
    </svg>
  );
  const DropdownIndicator: React.FC<DropdownIndicatorProps<Option, false>> = (
    props,
  ) => {
    return (
      <components.DropdownIndicator {...props}>
        <Icon
          path="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
          size={iconSize}
        />
      </components.DropdownIndicator>
    );
  };

  const ClearIndicator: React.FC<ClearIndicatorProps<Option, false>> = (
    props,
  ) => {
    return (
      <components.ClearIndicator {...props}>
        <Icon
          path="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
          size={iconSize}
        />
      </components.ClearIndicator>
    );
  };

  const IndicatorSeparator: React.FC<IndicatorSeparatorProps<Option, false>> = (
    props,
  ) => {
    return (
      <span
        style={{
          width: 1,
          marginTop: `${targetHeight * 0.2}px`,
          marginBottom: `${targetHeight * 0.2}px`,
          backgroundColor: "hsl(0, 0%, 80%)",
          alignSelf: "stretch",
        }}
        {...props.innerProps}
      />
    );
  };

  const commutatorRefs = useRef<Record<string, HTMLTableCellElement>>({});
  const thumbPositionRefs = useRef<Record<string, HTMLTableCellElement>>({});

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <PageSection title={t("custom.title")}>
      <div ref={divRef}>
        <table ref={tableRef}>
          <thead>
            <tr>
              <th style={{ width: "7.5%", minWidth: "4em" }}>Letters</th>
              <th style={{ width: "43%", minWidth: "32em", zIndex: 2 }}>
                Algorithm
              </th>
              <th style={{ width: "24.5%", minWidth: "20em" }}>Commutator</th>
              <th style={{ width: "25%", minWidth: "15em" }}>Thumb Position</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(defaultOptions).map(([index]) => (
              <tr key={index}>
                <td className="px-0 py-0">{index}</td>
                <td className="px-0 py-0">
                  <CreatableSelect
                    components={{
                      DropdownIndicator,
                      IndicatorSeparator,
                      ClearIndicator,
                    }}
                    instanceId={index}
                    isClearable={true}
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    onChange={(newValue) => updateValue(newValue, index)}
                    createOptionPosition="first"
                    onCreateOption={(newValue) => handleCreate(newValue, index)}
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
                        primary25: theme === "light" ? "#B2D4FF" : "#85C1E9",
                        primary50: theme === "light" ? "#B2D4FF" : "#85C1E9",
                      },
                    })}
                  />
                </td>
                <td
                  className="px-0 py-0"
                  ref={(ref) => {
                    commutatorRefs.current[index] = ref as HTMLTableCellElement;
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
    </PageSection>
  );
};

export default Custom;
