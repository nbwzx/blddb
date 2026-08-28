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
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { loadSettings } from "@/utils/settings";

import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
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
    padding: "1rem",
    marginRight: "1rem",
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
      <SortableContext
        items={items}
        strategy={
          typeof window !== "undefined" && window.innerWidth >= 768
            ? horizontalListSortingStrategy
            : verticalListSortingStrategy
        }
      >
        <div className="flex flex-col items-center md:flex-row">
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

const bufferOptions = ["", ...cornerPositions];

const computeState = (
  rawData: Record<string, string[]>,
  codeType: string,
  buffer: string,
  items: UniqueIdentifier[],
): State => {
  const newOptions: Record<string, Option[]> = {};
  const orderPositions = items.map(String);
  const positionToCustomCode = new Map(
    orderPositions.map((pos) => [
      pos,
      codeConverter.positionToCustomCode([pos]),
    ]),
  );
  for (const [key, values] of Object.entries(rawData)) {
    let customKey: string | null = null;

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
      customKey = matchingVariant;
    } else {
      customKey = codeConverter.initCodeToCustomCode(key, codeType);
    }
    newOptions[customKey] = values.map(createOption);
  }

  const initialValues: Record<string, Option | null> = {};
  for (const key of Object.keys(newOptions)) {
    initialValues[key] = null;
  }

  return { options: newOptions, values: initialValues };
};

const Custom = ({ codeType = "corner" }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const bigbldCodeTypes = ["wing", "xcenter", "tcenter", "midge"];
  const is3bld = !bigbldCodeTypes.includes(codeType);
  const availableModes = is3bld ? ["nightmare", "manmade"] : ["manmade"];
  const defaultMode = availableModes[0] as "nightmare" | "manmade";

  const [items, setItems] = useState<UniqueIdentifier[]>(cornerPositions);
  const [mode, setMode] = useState<"nightmare" | "manmade">(defaultMode);
  const [buffer, setBuffer] = useState<string>("UFR");

  const [state, setState] = useState<State>({ options: {}, values: {} });
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const { theme } = useTheme();
  const tableRef = useRef<HTMLTableElement>(
    null as unknown as HTMLTableElement,
  );
  const divRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const modes = is3bld ? ["nightmare", "manmade"] : ["manmade"];
    const currentDefault = modes[0] as "nightmare" | "manmade";
    if (!modes.includes(mode)) {
      setMode(currentDefault);
    }
  }, [is3bld, mode]);

  const dataFetchedRef = useRef(false);
  const prevCodeTypeRef = useRef(codeType);

  useEffect(() => {
    let isMounted = true;

    const compute = () => {
      const rawData = mode === "nightmare" ? nightmareData : manmadeData;
      if (isMounted) {
        setState(computeState(rawData, codeType, buffer, items));
        setImportStatus(null);
      }
    };

    const loadAndCompute = async () => {
      try {
        const manmadeModule = is3bld
          ? await import(`public/data/${codeType}Manmade.json`)
          : await import(`public/data/bigbld/${codeType}Manmade.json`);
        const transformed = transformManmadeData(manmadeModule.default);
        if (isMounted) {
          setManmadeData(transformed);
        }

        let nightmare = {};
        if (is3bld) {
          const nightmareModule = await import(
            `public/data/${codeType}Nightmare.json`
          );
          nightmare = nightmareModule.default;
        }
        if (isMounted) {
          setNightmareData(nightmare);
        }

        dataFetchedRef.current = true;
        prevCodeTypeRef.current = codeType;
        setLoading(false);
        compute();
      } catch {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const needReload =
      !dataFetchedRef.current || prevCodeTypeRef.current !== codeType;

    if (needReload) {
      loadAndCompute();
    } else {
      compute();
    }

    return () => {
      isMounted = false;
    };
  }, [codeType, is3bld, mode, buffer, nightmareData, manmadeData, items]);

  const handleModeChange = (newType: "nightmare" | "manmade") => {
    setMode(newType);
    setImportStatus(null);
  };

  const handleBufferChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBuffer(e.target.value);
  };

  const handleCreate = (inputValue: string, index: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(
        commutator.expand({ algorithm: inputValue }),
      );
      setIsLoading(false);
      setState((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          [index]: [newOption, ...prev.options[index]],
        },
      }));
      updateValue(newOption, index);
    }, 100);
  };

  const customIsValidNewOption = (
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
      codeConverter.customCodeToInitCode(index, codeType) !== codeAuto[1]
    );
  };

  const customFilterOption = (option: Option, inputValue: string) => {
    const expandValue = commutator.expand({ algorithm: inputValue });
    return (
      option.label.startsWith(expandValue) || option.label.startsWith("Create ")
    );
  };

  const computeDisplay = useCallback(
    (label: string): { commutator: string; thumb: string } => {
      if (!label) {
        return { commutator: "", thumb: "" };
      }
      const commutatorText = commutator.search({ algorithm: label })[0] || "";
      const thumbText = finger
        .fingerbeginfrom(label)
        .map((word) => t(word))
        .join("/");
      return { commutator: commutatorText, thumb: thumbText };
    },
    [t],
  );

  useEffect(() => {
    for (const [index, value] of Object.entries(state.values)) {
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
  }, [state.values, t, computeDisplay]);

  const updateValue = (value: Option | null, index: string) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [index]: value },
    }));
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

  const allowedOrders = ["Chichu", "Speffz", "Alphabetical"] as const;
  type OrderOfAlgsType = (typeof allowedOrders)[number];
  const storedOrder = loadSettings().orderOfAlgs as string;
  const currentOrder: OrderOfAlgsType = (
    allowedOrders as readonly string[]
  ).includes(storedOrder)
    ? (storedOrder as OrderOfAlgsType)
    : (codeConverter.getDefaultOrderOfAlgs() as OrderOfAlgsType);

  const compareKeys = (codeA: string, codeB: string): number => {
    const keyA = codeConverter.customCodeToPosition(codeA, codeType);
    const keyB = codeConverter.customCodeToPosition(codeB, codeType);

    if (currentOrder === "Alphabetical") {
      return codeA.localeCompare(codeB);
    }

    const order = codeConverter.positionArrays[currentOrder];

    const orderBuffer = items.map((id) => String(id));
    const indexA = orderBuffer.indexOf(keyA[0]);
    const indexB = orderBuffer.indexOf(keyB[0]);

    const diff0 = indexA - indexB;
    if (diff0 !== 0) {
      return diff0;
    }

    const diff1 = order.indexOf(keyA[1]) - order.indexOf(keyB[1]);
    if (diff1 !== 0) {
      return diff1;
    }

    return order.indexOf(keyA[2]) - order.indexOf(keyB[2]);
  };

  const exportToExcel = () => {
    const headers = ["Letters", "Algorithm", "Commutator", "Thumb Position"];
    const rows: string[][] = [];
    for (const index of Object.keys(state.options).sort(compareKeys)) {
      const algorithm = state.values[index]?.label || "";
      const { commutator: commutatorText, thumb: thumbText } =
        computeDisplay(algorithm);
      rows.push([index, algorithm, commutatorText, thumbText]);
    }
    const sheetData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    ws["!cols"] = [{ wch: 10 }, { wch: 40 }, { wch: 30 }, { wch: 25 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Corner Nightmare");
    XLSX.writeFile(wb, "corner_nightmare_export.xlsx");
  };

  const processWorkbook = (workbook: XLSX.WorkBook): string => {
    const algMap: Record<string, Set<string>> = {};
    let totalRows = 0;
    let validAlgs = 0;

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

          validAlgs++;
          algMap[key] = algMap[key] || new Set();
          algMap[key].add(expanded);

          break;
        }
      }
    }

    const newOptions = { ...state.options };
    const newValues = { ...state.values };
    let importedCount = 0;
    let selectedCount = 0;

    for (const [key, algSet] of Object.entries(algMap)) {
      if (!Object.hasOwn(newOptions, key)) {
        newOptions[key] = [];
      }

      const firstAlg = Array.from(algSet)[0];

      const existingLabels = new Set(newOptions[key].map((opt) => opt.label));
      const newAlgs = Array.from(algSet).filter(
        (alg) => !existingLabels.has(alg),
      );
      if (newAlgs.length > 0) {
        const newOpts = newAlgs.map(createOption);
        newOptions[key] = [...newOptions[key], ...newOpts];
        importedCount += newAlgs.length;
      }

      const selectedOption = newOptions[key].find(
        (opt) => opt.label === firstAlg,
      );
      if (selectedOption) {
        newValues[key] = selectedOption;
        selectedCount++;
      }
    }

    setState((prev) => ({
      ...prev,
      options: newOptions,
      values: newValues,
    }));

    return `📊 Processed ${totalRows} rows. Found ${validAlgs} valid corner algorithm entries. Imported ${importedCount} new unique algorithm${importedCount === 1 ? "" : "s"}. Selected ${selectedCount} key${selectedCount === 1 ? "" : "s"} (first algorithm for each).`;
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

  if (loading) {
    return <Loading />;
  }

  return (
    <PageSection title={t("custom.title")}>
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
            Buffer:
          </label>
          <select
            id="buffer"
            value={buffer}
            onChange={handleBufferChange}
            className="text-dark focus:border-primary dark:bg-gray-dark dark:focus:border-primary inline-block border-b-[3px] border-gray-500 bg-inherit py-1 pr-5 text-base font-medium outline-hidden transition-all duration-300 dark:border-gray-100 dark:text-white dark:shadow-none dark:focus:shadow-none"
          >
            {bufferOptions.map((pos) => (
              <option key={pos} value={pos}>
                {pos === "" ? "All" : pos}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
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
            Upload
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
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-green-700"
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
            Export to Excel
          </button>
        </div>
      </div>

      <div className="mt-8 mb-6 max-w-fit rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 shadow-inner dark:border-gray-600 dark:bg-gray-800/50">
        <h3 className="mb-4 text-center text-lg font-semibold tracking-wide text-gray-700 dark:text-gray-300">
          Floating Order&nbsp;
          <span className="font-normal text-gray-400 lowercase dark:text-gray-400">
            (drag to reorder)
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
              <th style={{ width: "7.5%", minWidth: "4em" }}>Letters</th>
              <th style={{ width: "43%", minWidth: "32em", zIndex: 2 }}>
                Algorithm
              </th>
              <th style={{ width: "24.5%", minWidth: "20em" }}>Commutator</th>
              <th style={{ width: "25%", minWidth: "15em" }}>Thumb Position</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(state.options)
              .sort(([a], [b]) => compareKeys(a, b))
              .map(([index]) => (
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
                      onCreateOption={(newValue) =>
                        handleCreate(newValue, index)
                      }
                      options={state.options[index]}
                      value={state.values[index]}
                      isValidNewOption={(
                        inputValue,
                        selectValue,
                        optionsInput,
                      ) =>
                        customIsValidNewOption(
                          inputValue,
                          selectValue,
                          optionsInput,
                          index,
                        )
                      }
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
    </PageSection>
  );
};

export default Custom;
