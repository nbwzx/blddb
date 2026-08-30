"use client";

import Loading from "@/app/loading";
import PageSection from "@/components/PageSection";
import { useTranslation } from "@/i18n/client";
import codeConverter from "@/utils/codeConverter";
import commutator from "@/utils/commutator";
import finger from "@/utils/finger";
import tracer from "@/utils/tracer";
import useResponsiveTable from "@/utils/useResponsiveTable";
import { useTheme } from "next-themes";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  components,
  IndicatorSeparatorProps,
  type ClearIndicatorProps,
  type DropdownIndicatorProps,
  type GroupBase,
  type OptionsOrGroups,
  type StylesConfig,
} from "react-select";
import CreatableSelect from "react-select/creatable";
import * as XLSX from "xlsx";
import {
  loadSettings,
  saveSettings,
  loadCustomAlgorithms,
  saveCustomAlgorithms,
  type CustomAlgorithms,
} from "@/utils/settings";

import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ id }: { id: UniqueIdentifier }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: `1px solid ${isDark ? "#4a4a4a" : "#e5e7eb"}`,
    borderRadius: "0.375rem",
    padding: "0.75rem 0.5rem",
    textAlign: "center" as const,
    backgroundColor: isDark ? "#1f2937" : "white",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    cursor: "grab",
    color: isDark ? "#f9fafb" : "black",
  };
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {id}
    </div>
  );
};

const SortableList: React.FC<{
  items: UniqueIdentifier[];
  setItems: React.Dispatch<React.SetStateAction<UniqueIdentifier[]>>;
}> = ({ items, setItems }) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.indexOf(active.id);
        const newIndex = prevItems.indexOf(over?.id ?? active.id);
        const updatedItems = arrayMove(prevItems, oldIndex, newIndex);
        return updatedItems;
      });
    }
  };
  return (
    <DndContext onDragEnd={handleDragEnd} id="unique-dnd-context-id">
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:flex md:flex-row md:flex-wrap md:gap-3">
          {items.map((item) => (
            <SortableItem key={item as string} id={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

const transformManmadeData = (
  data: Record<string, [alg: string[], source: string[]][]>,
): Record<string, string[]> => {
  const result: Record<string, string[]> = {};
  for (const [key, tuples] of Object.entries(data)) {
    result[key] = tuples.flatMap((tuple) => tuple[0]);
  }
  return result;
};

interface State {
  options: Record<string, Option[]>;
  values: Record<string, Option | null>;
  displayCodes: Record<string, string>;
}

const cornerPositions = [
  "UFR",
  "UBR",
  "UFL",
  "UBL",
  "DFR",
  "DBR",
  "DFL",
  "DBL",
];

const edgePositions = [
  "UF",
  "UR",
  "UB",
  "UL",
  "DF",
  "DR",
  "DB",
  "DL",
  "FR",
  "FL",
  "BR",
  "BL",
];

const computeState = (
  rawData: Record<string, string[]>,
  codeType: string,
  buffer: string,
  items: UniqueIdentifier[],
): State => {
  const newOptions: Record<string, Option[]> = {};
  const displayCodes: Record<string, string> = {};
  const orderPositions = items.map(String);
  const positionToCustomCode = new Map(
    orderPositions.map((pos) => [
      pos,
      codeConverter.positionToCustomCode([pos]),
    ]),
  );
  for (const [key, values] of Object.entries(rawData)) {
    let displayCode: string | null = null;

    if (buffer) {
      const bufferCode = codeConverter.positionToCustomCode([buffer]);
      const variants = codeConverter.initCodeToVariantCustomCode(key, codeType);
      const matchingVariant = variants.find((v) => v[0] === bufferCode);
      if (!matchingVariant) {
        continue;
      }
      const bufferIndex = orderPositions.indexOf(buffer);
      const positionsBeforeBuffer = orderPositions.slice(0, bufferIndex);
      const hasVariantBeforeBuffer = positionsBeforeBuffer.some((pos) =>
        variants.some((v) => v[0] === positionToCustomCode.get(pos)),
      );
      if (hasVariantBeforeBuffer) {
        continue;
      }
      displayCode = matchingVariant;
    } else {
      displayCode = codeConverter.initCodeToCustomCode(key, codeType);
    }

    const posKey = codeConverter
      .customCodeToPosition(displayCode, codeType)
      .filter((pos) => pos !== " ")
      .join("-");
    newOptions[posKey] = values.map(createOption);
    displayCodes[posKey] = displayCode;
  }

  const initialValues: Record<string, Option | null> = {};
  for (const key of Object.keys(newOptions)) {
    initialValues[key] = null;
  }

  return { options: newOptions, values: initialValues, displayCodes };
};

/* eslint-disable no-unused-vars */
interface RowProps {
  index: string;
  displayCode: string;
  value: Option | null;
  options: Option[];
  updateValue: (value: Option | null, index: string) => void;
  handleCreate: (inputValue: string, index: string) => void;
  isValidNewOption: (
    inputValue: string,
    value: readonly Option[],
    optionsInput: OptionsOrGroups<Option, GroupBase<Option>>,
    index: string,
  ) => boolean;
  filterOption: (option: Option, inputValue: string) => boolean;
  styles: StylesConfig<Option, false>;
  theme: string | undefined;
  isLoading: boolean;
  isDisabled: boolean;
  registerCommutatorRef: (
    index: string,
    el: HTMLTableCellElement | null,
  ) => void;
  registerThumbRef: (index: string, el: HTMLTableCellElement | null) => void;
}
/* eslint-enable no-unused-vars */

const Row = React.memo((props: RowProps) => {
  const {
    index,
    displayCode,
    value,
    options,
    updateValue,
    handleCreate,
    isValidNewOption,
    filterOption,
    styles,
    theme,
    isLoading,
    isDisabled,
    registerCommutatorRef,
    registerThumbRef,
  } = props;

  const onChange = useCallback(
    (newValue: Option | null) => updateValue(newValue, index),
    [updateValue, index],
  );

  const onCreate = useCallback(
    (inputValue: string) => handleCreate(inputValue, index),
    [handleCreate, index],
  );

  const isValid = useCallback(
    (
      inputValue: string,
      selectValue: readonly Option[],
      optionsInput: OptionsOrGroups<Option, GroupBase<Option>>,
    ) => isValidNewOption(inputValue, selectValue, optionsInput, index),
    [isValidNewOption, index],
  );

  return (
    <tr>
      <td className="px-0 py-0">{displayCode}</td>
      <td className="px-0 py-0">
        <CreatableSelect
          components={{
            DropdownIndicator,
            IndicatorSeparator,
            ClearIndicator,
          }}
          instanceId={index}
          isClearable={true}
          isDisabled={isDisabled}
          isLoading={isLoading}
          onChange={onChange}
          onCreateOption={onCreate}
          options={options}
          value={value}
          isValidNewOption={isValid}
          filterOption={filterOption}
          styles={styles}
          formatCreateLabel={(inputValue: string) => `Create ${inputValue}`}
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
        ref={(el) => registerCommutatorRef(index, el)}
      ></td>
      <td className="px-0 py-0" ref={(el) => registerThumbRef(index, el)}></td>
    </tr>
  );
});

Row.displayName = "Row";

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
  const { selectProps } = props;
  const size = (selectProps as { iconSize?: number }).iconSize || 18;
  return (
    <components.DropdownIndicator {...props}>
      <Icon
        path="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
        size={size}
      />
    </components.DropdownIndicator>
  );
};

const ClearIndicator: React.FC<ClearIndicatorProps<Option, false>> = (
  props,
) => {
  const { selectProps } = props;
  const size = (selectProps as { iconSize?: number }).iconSize || 18;
  return (
    <components.ClearIndicator {...props}>
      <Icon
        path="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
        size={size}
      />
    </components.ClearIndicator>
  );
};

const IndicatorSeparator: React.FC<IndicatorSeparatorProps<Option, false>> = (
  props,
) => {
  const { selectProps } = props;
  const height = (selectProps as { targetHeight?: number }).targetHeight || 30;
  return (
    <span
      style={{
        width: 1,
        marginTop: `${height * 0.2}px`,
        marginBottom: `${height * 0.2}px`,
        backgroundColor: "hsl(0, 0%, 80%)",
        alignSelf: "stretch",
      }}
      {...props.innerProps}
    />
  );
};

const Custom = ({ codeType = "corner" }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loadingRow, setLoadingRow] = useState<string | null>(null);

  const bigbldCodeTypes = ["wing", "xcenter", "tcenter", "midge"];
  const is3bld = !bigbldCodeTypes.includes(codeType);
  const availableModes = is3bld ? ["nightmare", "manmade"] : ["manmade"];
  const defaultMode = availableModes[0] as "nightmare" | "manmade";

  const piecePositions = codeType === "edge" ? edgePositions : cornerPositions;
  const bufferOptions = ["", ...piecePositions];
  const bufferKey = `buffer${codeType[0].toUpperCase()}${codeType.slice(1)}`;
  const orderKey = `order${codeType[0].toUpperCase()}${codeType.slice(1)}`;
  const buildAlgorithms = (values: State["values"]): CustomAlgorithms => {
    const algorithms: CustomAlgorithms = {};
    for (const [key, option] of Object.entries(values)) {
      if (option) {
        algorithms[key] = option.label;
      }
    }
    return algorithms;
  };

  const [items, setItems] = useState<UniqueIdentifier[]>(piecePositions);
  const [mode, setMode] = useState<"nightmare" | "manmade">(defaultMode);
  const [buffer, setBuffer] = useState<string>(
    codeType === "edge" ? "UF" : "UFR",
  );

  const [state, setState] = useState<State>({
    options: {},
    values: {},
    displayCodes: {},
  });
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const { theme } = useTheme();
  const tableRef = useRef<HTMLTableElement>(
    null as unknown as HTMLTableElement,
  );
  const divRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const restoredRef = useRef(false);

  const { fontSize } = useResponsiveTable(tableRef, divRef);

  const commutatorRefs = useRef<Record<string, HTMLTableCellElement>>({});
  const thumbPositionRefs = useRef<Record<string, HTMLTableCellElement>>({});

  const [nightmareData, setNightmareData] = useState<Record<string, string[]>>(
    {},
  );
  const [manmadeData, setManmadeData] = useState<Record<string, string[]>>({});

  const modeToEmoji = {
    nightmare: "\u{1F480}",
    manmade: "\u{2009}\u{F2BD}\u{2009}",
  };

  const displayCache = useRef<
    Map<string, { commutator: string; thumb: string }>
  >(new Map());
  const lastChangedIndexRef = useRef<string | null>(null);

  const useRegisterRef = (
    refs: React.RefObject<Record<string, HTMLTableCellElement>>,
  ) => {
    return useCallback(
      (index: string, el: HTMLTableCellElement | null) => {
        if (el) {
          refs.current[index] = el;
        } else {
          Reflect.deleteProperty(refs.current, index);
        }
      },
      [refs],
    );
  };
  const registerCommutatorRef = useRegisterRef(commutatorRefs);
  const registerThumbRef = useRegisterRef(thumbPositionRefs);

  const updateValue = useCallback(
    (value: Option | null, index: string) => {
      setState((prev) => {
        const nextValues = { ...prev.values, [index]: value };
        saveCustomAlgorithms(codeType, buildAlgorithms(nextValues));
        return { ...prev, values: nextValues };
      });
      lastChangedIndexRef.current = index;
    },
    [codeType],
  );

  useEffect(() => {
    const modes = is3bld ? ["nightmare", "manmade"] : ["manmade"];
    const currentDefault = modes[0] as "nightmare" | "manmade";
    if (!modes.includes(mode)) {
      setMode(currentDefault);
    }
  }, [is3bld, mode]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const manmadeModule = is3bld
          ? await import(`public/data/${codeType}Manmade.json`)
          : await import(`public/data/bigbld/${codeType}Manmade.json`);
        const manmade = transformManmadeData(manmadeModule.default);
        let nightmare: Record<string, string[]> = {};
        if (is3bld) {
          const nightmareModule = await import(
            `public/data/${codeType}Nightmare.json`
          );
          nightmare = nightmareModule.default as Record<string, string[]>;
        }
        if (isMounted) {
          setManmadeData(manmade);
          setNightmareData(nightmare);
          const restorePositions =
            codeType === "edge" ? edgePositions : cornerPositions;
          const restoreModes = is3bld ? ["nightmare", "manmade"] : ["manmade"];
          const stored = loadSettings();
          const storedMode = stored["mode"];
          if (
            typeof storedMode === "string" &&
            restoreModes.includes(storedMode as "nightmare" | "manmade")
          ) {
            setMode(storedMode as "nightmare" | "manmade");
          }
          const storedBuffer = stored[bufferKey];
          if (typeof storedBuffer === "string") {
            setBuffer(storedBuffer);
          }
          const storedOrder = stored[orderKey];
          if (
            Array.isArray(storedOrder) &&
            storedOrder.length > 0 &&
            storedOrder.every((id) => restorePositions.includes(String(id)))
          ) {
            setItems(storedOrder);
          }

          restoredRef.current = true;
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          restoredRef.current = true;
          setLoading(false);
        }
      }
    };
    setLoading(true);
    load();
    return () => {
      isMounted = false;
    };
  }, [codeType, is3bld, bufferKey, orderKey]);

  useEffect(() => {
    const rawData = mode === "nightmare" ? nightmareData : manmadeData;
    const computed = computeState(rawData, codeType, buffer, items);
    const stored = loadCustomAlgorithms(codeType);
    const values: State["values"] = { ...computed.values };
    for (const key of Object.keys(computed.options)) {
      const label = stored[key];
      if (label) {
        const existing = computed.options[key].find((o) => o.label === label);
        values[key] = existing ?? createOption(label);
      }
    }
    setState({
      options: computed.options,
      values,
      displayCodes: computed.displayCodes,
    });
    setImportStatus(null);
  }, [nightmareData, manmadeData, mode, buffer, items, codeType]);

  const handleModeChange = (newType: "nightmare" | "manmade") => {
    setMode(newType);
    setImportStatus(null);
    saveSettings({ ...loadSettings(), mode: newType });
  };

  const handleBufferChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setBuffer(value);
    saveSettings({ ...loadSettings(), [bufferKey]: value });
  };

  useEffect(() => {
    if (!restoredRef.current) {
      return;
    }
    saveSettings({
      ...loadSettings(),
      [orderKey]: items.map(String),
    });
  }, [items, codeType, orderKey]);

  const handleCreate = useCallback(
    (inputValue: string, index: string) => {
      setLoadingRow(index);
      setTimeout(() => {
        try {
          const newOption = createOption(
            commutator.expand({ algorithm: inputValue }),
          );
          setState((prev) => ({
            ...prev,
            options: {
              ...prev.options,
              [index]: [newOption, ...(prev.options[index] ?? [])],
            },
          }));
          updateValue(newOption, index);
        } finally {
          setLoadingRow(null);
        }
      }, 100);
    },
    [updateValue],
  );

  const customIsValidNewOption = useCallback(
    (
      inputValue: string,
      value: readonly Option[],
      optionsInput: OptionsOrGroups<Option, GroupBase<Option>>,
      index: string,
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
      const codeAuto = tracer.getCodeAuto(expandValue);
      if (codeAuto[0] !== codeType) {
        return false;
      }
      return !(
        expandValue === "" ||
        hasValue ||
        hasOption ||
        codeConverter.customCodeToInitCode(
          codeConverter.positionToCustomCode(index.split("-")),
          codeType,
        ) !== codeAuto[1]
      );
    },
    [codeType],
  );

  const customFilterOption = useCallback(
    (option: Option, inputValue: string) => {
      const expandValue = commutator.expand({ algorithm: inputValue });
      return (
        option.label.startsWith(expandValue) ||
        option.label.startsWith("Create ")
      );
    },
    [],
  );

  const computeDisplay = useCallback(
    (label: string): { commutator: string; thumb: string } => {
      if (!label) {
        return { commutator: "", thumb: "" };
      }
      const cached = displayCache.current.get(label);
      if (cached) {
        return cached;
      }
      const commutatorText = commutator.search({ algorithm: label })[0] || "";
      const thumbText = finger
        .fingerbeginfrom(label)
        .map((word) => t(word))
        .join("/");
      const result = { commutator: commutatorText, thumb: thumbText };
      displayCache.current.set(label, result);
      return result;
    },
    [t],
  );

  useEffect(() => {
    const targetIndex = lastChangedIndexRef.current;
    const indices =
      targetIndex && state.values[targetIndex] !== undefined
        ? [targetIndex]
        : Object.keys(state.values);

    for (const index of indices) {
      const value = state.values[index];
      const { commutator: commutatorText, thumb: thumbText } = computeDisplay(
        value ? value.label : "",
      );
      const cell = commutatorRefs.current[index];
      if (cell) {
        cell.textContent = commutatorText;
      }
      const thumbCell = thumbPositionRefs.current[index];
      if (thumbCell) {
        thumbCell.textContent = thumbText;
      }
    }

    if (targetIndex && state.values[targetIndex] !== undefined) {
      lastChangedIndexRef.current = null;
    }
  }, [state.values, computeDisplay]);

  const targetHeight = Math.trunc(fontSize * 2);
  const iconSize = targetHeight - 2;
  const customStyles = useMemo<StylesConfig<Option, false>>(
    () => ({
      singleValue: (base) => ({
        ...base,
        color: theme === "light" ? "black" : "white",
        height: `${targetHeight - 2}px`,
        lineHeight: `${targetHeight - 2}px`,
        marginTop: "0px",
        marginBottom: "0px",
        padding: "0px",
        display: "grid",
        gridTemplateRows: "1fr",
        gridTemplateColumns: "1fr auto",
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
        gridTemplateColumns: "1fr auto",
        margin: "0",
      }),
      clearIndicator: (base) => ({
        ...base,
        padding: `${(targetHeight - iconSize - 2) / 30}px`,
      }),
      valueContainer: (base) => ({
        ...base,
        padding: 0,
      }),
      dropdownIndicator: (base) => ({
        ...base,
        padding: `${(targetHeight - iconSize - 2) / 30}px`,
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
    }),
    [fontSize, iconSize, targetHeight, theme],
  );

  const allowedOrders = ["Chichu", "Speffz", "Alphabetical"] as const;
  type OrderOfAlgsType = (typeof allowedOrders)[number];
  const storedOrder = loadSettings().orderOfAlgs as string;
  const currentOrder: OrderOfAlgsType = (
    allowedOrders as readonly string[]
  ).includes(storedOrder)
    ? (storedOrder as OrderOfAlgsType)
    : (codeConverter.getDefaultOrderOfAlgs() as OrderOfAlgsType);

  const compareKeys = useCallback(
    (posA: string, posB: string): number => {
      if (currentOrder === "Alphabetical") {
        const codeA = state.displayCodes[posA] ?? posA;
        const codeB = state.displayCodes[posB] ?? posB;
        return codeA.localeCompare(codeB);
      }
      const order = items.map((id) => String(id));
      return (
        order.indexOf(posA.split("-")[0]) - order.indexOf(posB.split("-")[0])
      );
    },
    [currentOrder, state.displayCodes, items],
  );

  const rowKeys = useMemo(() => {
    return Object.keys(state.options).sort(compareKeys);
  }, [state.options, compareKeys]);

  const exportToExcel = () => {
    const headers = [
      t("table.letters"),
      t("table.algorithm"),
      t("table.commutator"),
      t("table.thumbPosition"),
    ];
    const rows: string[][] = [];
    for (const index of rowKeys) {
      const algorithm = state.values[index]?.label || "";
      const { commutator: commutatorText, thumb: thumbText } =
        computeDisplay(algorithm);
      rows.push([
        state.displayCodes[index] ?? index,
        algorithm,
        commutatorText,
        thumbText,
      ]);
    }
    const sheetData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    ws["!cols"] = [{ wch: 10 }, { wch: 40 }, { wch: 30 }, { wch: 25 }];

    const wb = XLSX.utils.book_new();
    const exportName = t("custom.exportName", {
      type: t(codeType === "corner" ? "custom.corner" : "custom.edge"),
    });
    XLSX.utils.book_append_sheet(wb, ws, exportName);
    XLSX.writeFile(wb, `${exportName}.xlsx`);
  };

  const processWorkbook = (workbook: XLSX.WorkBook): string => {
    const algMap: Record<string, Set<string>> = {};
    let totalRows = 0;

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows: (string | number | boolean | null | undefined)[][] =
        XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
        });

      if (rows.length === 0) {
        continue;
      }

      for (let r = 0; r < rows.length; r++) {
        totalRows++;
        const row = rows[r];
        for (const cell of row) {
          if (!cell) {
            continue;
          }
          const str = String(cell).trim();
          if (!str) {
            continue;
          }

          const expanded = commutator.expand({ algorithm: str });
          if (!expanded) {
            continue;
          }

          const [type, key] = tracer.getCodeAuto(expanded);
          if (type !== codeType) {
            continue;
          }

          const variants = codeConverter.initCodeToVariantCustomCode(
            key,
            codeType,
          );
          for (const variant of variants) {
            const positions = codeConverter
              .customCodeToPosition(variant, codeType)
              .filter((pos) => pos !== " ");
            if (positions.length === 0 || positions.length !== variant.length) {
              continue;
            }
            const posKey = positions.join("-");
            algMap[posKey] = algMap[posKey] || new Set();
            algMap[posKey].add(expanded);
          }
        }
      }
    }

    const newOptions = { ...state.options };
    const newValues = { ...state.values };
    let selectedCount = 0;

    for (const [posKey, algSet] of Object.entries(algMap)) {
      if (!Object.hasOwn(newOptions, posKey)) {
        continue;
      }

      const firstAlg = Array.from(algSet)[0];

      const existingLabels = new Set(
        newOptions[posKey].map((opt) => opt.label),
      );
      const newAlgs = Array.from(algSet).filter(
        (alg) => !existingLabels.has(alg),
      );
      if (newAlgs.length > 0) {
        const newOpts = newAlgs.map(createOption);
        newOptions[posKey] = [...newOptions[posKey], ...newOpts];
      }

      const selectedOption = newOptions[posKey].find(
        (opt) => opt.label === firstAlg,
      );
      if (selectedOption) {
        newValues[posKey] = selectedOption;
        selectedCount++;
      }
    }

    setState((prev) => ({
      ...prev,
      options: newOptions,
      values: newValues,
    }));
    saveCustomAlgorithms(codeType, buildAlgorithms(newValues));

    return t("custom.importStatus", {
      totalRows,
      selectedCount,
      letter: t("custom.letter"),
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImportStatus("❌ No file selected.");
      return;
    }

    setImportStatus("⏳ Reading file...");

    const reader = new FileReader();
    const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
    const isCSV = file.name.endsWith(".csv") || file.name.endsWith(".tsv");

    if (!isExcel && !isCSV) {
      setImportStatus(
        "❌ Unsupported file type. Please use .xlsx, .xls, .csv, or .tsv",
      );
      event.target.value = "";
      return;
    }

    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (!result) {
          setImportStatus("❌ No data read from file.");
          return;
        }
        const workbook = isExcel
          ? XLSX.read(new Uint8Array(result as ArrayBuffer), { type: "array" })
          : XLSX.read(result as string, { type: "string", raw: true });
        const status = processWorkbook(workbook);
        setImportStatus(status);
      } catch (err) {
        setImportStatus(`❌ Error processing file: ${(err as Error).message}`);
      }
    };

    reader.onerror = () => {
      setImportStatus("❌ Failed to read file (reader error).");
    };

    if (isExcel) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }

    event.target.value = "";
  };

  const handleClear = () => {
    const clearedValues: State["values"] = {};
    for (const key of Object.keys(state.options)) {
      clearedValues[key] = null;
    }
    setState((prev) => ({ ...prev, values: clearedValues }));
    saveCustomAlgorithms(codeType, {});
    setImportStatus(null);
    lastChangedIndexRef.current = null;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <PageSection
      title={t(codeType === "edge" ? "custom.edge" : "custom.corner")}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="mode" className="font-medium">
            {t("common.mode")}
          </label>
          <select
            id="mode"
            value={mode}
            onChange={(e) =>
              handleModeChange(e.target.value as "nightmare" | "manmade")
            }
            className="text-dark focus:border-primary dark:bg-gray-dark dark:focus:border-primary inline-block border-b-[3px] border-gray-500 bg-inherit py-1 pr-5 text-base font-medium outline-hidden transition-all duration-300 dark:border-gray-100 dark:text-white dark:shadow-none dark:focus:shadow-none"
          >
            {availableModes.map((modeKey) => (
              <option key={modeKey} value={modeKey}>
                {modeToEmoji[modeKey as keyof typeof modeToEmoji] || ""}
                {t(`common.${modeKey}`)}
              </option>
            ))}
          </select>
          <span className="mx-2">|</span>

          <label htmlFor="buffer" className="font-medium">
            {t("custom.buffer")}：
          </label>
          <select
            id="buffer"
            value={buffer}
            onChange={handleBufferChange}
            className="text-dark focus:border-primary dark:bg-gray-dark dark:focus:border-primary inline-block border-b-[3px] border-gray-500 bg-inherit py-1 pr-5 text-base font-medium outline-hidden transition-all duration-300 dark:border-gray-100 dark:text-white dark:shadow-none dark:focus:shadow-none"
          >
            {bufferOptions.map((pos) => (
              <option key={pos} value={pos}>
                {pos === "" ? t("custom.all") : pos}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            {t("custom.upfile")}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx,.xls,.csv,.tsv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={exportToExcel}
            className="flex cursor-pointer items-center gap-2 rounded-md bg-green-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-green-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {t("custom.downfile")}
          </button>
          <button
            onClick={handleClear}
            className="flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-red-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {t("custom.clear")}
          </button>
        </div>
      </div>

      <div className="mt-8 mb-6 w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 shadow-inner md:w-fit md:max-w-fit md:p-6 dark:border-gray-600 dark:bg-gray-800/50">
        <h3 className="mb-4 text-center text-lg font-semibold tracking-wide text-gray-700 dark:text-gray-300">
          {t("custom.floatingOrder")}
          <span className="font-normal text-gray-400 lowercase dark:text-gray-400">
            &nbsp;{t("custom.dragHint")}
          </span>
        </h3>
        <SortableList items={items} setItems={setItems} />
      </div>
      {importStatus && (
        <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">
          {importStatus}
        </div>
      )}
      <div ref={divRef}>
        <table ref={tableRef}>
          <thead>
            <tr>
              <th style={{ width: "7.5%", minWidth: "4em" }}>
                {t("table.letters")}
              </th>
              <th style={{ width: "43%", minWidth: "32em", zIndex: 2 }}>
                {t("table.algorithm")}
              </th>
              <th style={{ width: "24.5%", minWidth: "20em" }}>
                {t("table.commutator")}
              </th>
              <th style={{ width: "25%", minWidth: "15em" }}>
                {t("table.thumbPosition")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rowKeys.map((index) => (
              <Row
                key={index}
                index={index}
                displayCode={state.displayCodes[index] ?? index}
                value={state.values[index]}
                options={state.options[index]}
                updateValue={updateValue}
                handleCreate={handleCreate}
                isValidNewOption={customIsValidNewOption}
                filterOption={customFilterOption}
                styles={customStyles}
                theme={theme}
                isLoading={loadingRow === index}
                isDisabled={loadingRow === index}
                registerCommutatorRef={registerCommutatorRef}
                registerThumbRef={registerThumbRef}
              />
            ))}
          </tbody>
        </table>
      </div>
    </PageSection>
  );
};

export default Custom;
