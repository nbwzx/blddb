"use client";

import React, { CSSProperties, useEffect, useState, useRef } from "react";
import { useTranslation } from "@/i18n/client";
import Loading from "@/app/loading";
import PageSection from "@/components/PageSection";
import commutator from "@/utils/commutator";
import * as XLSX from "xlsx";

const Commutator = () => {
  const { t } = useTranslation();
  const intRegex = /^\d{0,4}$/u;
  const floatRegex = /^\d{0,4}(\.\d{0,2})?$/u;
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const settingsGroups = {
    commutator: [
      {
        id: "order",
        type: "text",
        regex: intRegex,
        default: "4",
      },
      {
        id: "noBrackets",
        type: "checkbox",
      },
      {
        id: "outerBracket",
        type: "checkbox",
      },
      {
        id: "slashNotation",
        type: "checkbox",
      },
      {
        id: "spaceAfterColon",
        type: "checkbox",
      },
      {
        id: "spaceAfterComma",
        type: "checkbox",
      },
      {
        id: "initialReplace",
        type: "checkbox",
        default: true,
      },
      {
        id: "finalReplace",
        type: "checkbox",
        default: true,
      },
      {
        id: "commute",
        type: "checkbox",
        default: true,
      },
      {
        id: "outerBrackets",
        type: "checkbox",
        default: true,
      },
      {
        id: "maxDepth",
        type: "text",
        regex: intRegex,
        default: "0",
      },
      {
        id: "abMaxScore",
        type: "text",
        regex: floatRegex,
        default: "2.5",
      },
      {
        id: "abMinScore",
        type: "text",
        regex: floatRegex,
        default: "5",
      },
      {
        id: "addScore",
        type: "text",
        regex: floatRegex,
        default: "1",
      },
      {
        id: "fast",
        type: "checkbox",
      },
    ],
  };
  const [inputAlg, setInputAlg] = useState("");
  const [outputAlg, setOutput] = useState("");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [mode, setMode] = useState("single");
  const buttons = ["decompose", "expand"];

  const createCommutatorConfig = (algorithm: string, type: string) => {
    const baseConfig = {
      algorithm,
      order: Number(settings.order),
      initialReplace: settings.initialReplace ? undefined : {},
      finalReplace: settings.finalReplace ? undefined : {},
      commute: settings.commute ? undefined : {},
    };

    if (type === "search") {
      return {
        ...baseConfig,
        noBrackets: settings.noBrackets,
        outerBracket: settings.outerBracket,
        slashNotation: settings.slashNotation,
        spaceAfterColon: settings.spaceAfterColon,
        spaceAfterComma: settings.spaceAfterComma,
        outerBrackets: settings.outerBrackets,
        maxDepth: Number(settings.maxDepth),
        abMaxScore: Number(settings.abMaxScore),
        abMinScore: Number(settings.abMinScore),
        addScore: Number(settings.addScore),
        fast: settings.fast,
      };
    }
    return {
      ...baseConfig,
    };
  };

  const [progress, setProgress] = useState<{
    currentIndex: number;
    totalCount: number;
    currentAlgorithm: string;
    timeTaken: number;
  }>({
    currentIndex: 0,
    totalCount: 0,
    currentAlgorithm: "",
    timeTaken: 0,
  });

  const handleChange = (id: any, value: any) => {
    const newSettings = { ...settings, [id]: value };
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  const handleInputChange = (id: string, value: string) => {
    const setting = Object.values(settingsGroups)
      .flat()
      .find((s) => s.id === id);
    if (
      setting &&
      "regex" in setting &&
      setting.regex &&
      !setting.regex.test(value as string)
    ) {
      return;
    }
    handleChange(id, value);
  };

  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowSettingsModal(false);
      }
    };

    if (showSettingsModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (showSettingsModal) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [showSettingsModal]);

  const loadSettings = () => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("settings");
      let newSettings: Record<string, any> = {};
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        newSettings = { ...parsedSettings };
      }
      Object.keys(settingsGroups).forEach((moduleId) => {
        settingsGroups[moduleId as keyof typeof settingsGroups].forEach(
          (setting) => {
            if (
              "default" in setting &&
              typeof newSettings[setting.id] === "undefined"
            ) {
              newSettings[setting.id] = setting.default;
            }
          },
        );
      });
      return newSettings;
    }
    return {};
  };

  useEffect(() => {
    const initialSettings = loadSettings();
    setSettings(initialSettings);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const settingsItems = [
    {
      label: t("settings.commutator.order"),
      id: "order",
      type: "text",
      placeholder: "4",
      style: { textAlign: "center", width: "2.5em" },
      tooltip: t("commutator.orderTip"),
    },
    {
      label: t("settings.commutator.outerBrackets"),
      id: "outerBrackets",
      type: "checkbox",
    },
    {
      label: t("settings.commutator.noBrackets"),
      id: "noBrackets",
      type: "checkbox",
    },
    {
      label: t("settings.commutator.outerBracket"),
      id: "outerBracket",
      type: "checkbox",
    },
    {
      label: t("settings.commutator.slashNotation"),
      id: "slashNotation",
      type: "checkbox",
    },
    {
      label: t("settings.commutator.spaceAfterColon"),
      id: "spaceAfterColon",
      type: "checkbox",
    },
    {
      label: t("settings.commutator.spaceAfterComma"),
      id: "spaceAfterComma",
      type: "checkbox",
    },
    {
      label: t("settings.commutator.initialReplace"),
      id: "initialReplace",
      type: "checkbox",
      tooltip: t("commutator.initialReplaceTip"),
    },
    {
      label: t("settings.commutator.finalReplace"),
      id: "finalReplace",
      type: "checkbox",
      tooltip: t("commutator.finalReplaceTip"),
    },
    {
      label: t("settings.commutator.commute"),
      id: "commute",
      type: "checkbox",
      tooltip: t("commutator.commuteTip"),
    },
    {
      label: t("settings.commutator.maxDepth"),
      id: "maxDepth",
      type: "text",
      placeholder: "0",
      style: { textAlign: "center", width: "2.5em" },
      tooltip: t("commutator.maxDepthTip"),
    },
    {
      label: t("settings.commutator.sortingRules"),
      id: "sortingRules",
      type: "custom",
      content: () => (
        <div>
          <div className="mt-1 flex max-w-[500px] flex-wrap items-center whitespace-normal">
            <span className="whitespace-nowrap">
              {t("settings.commutator.scoreHint")}
            </span>
            <input
              type="text"
              placeholder="2.5"
              value={settings.abMaxScore}
              onChange={(e) => handleInputChange("abMaxScore", e.target.value)}
              style={{ textAlign: "center", width: "2.5em" }}
              className="mx-2 rounded border border-gray-400 p-1"
            />
            <span className="whitespace-nowrap">*</span>
            <span className="whitespace-nowrap">&nbsp;stm(A)</span>
            <span className="whitespace-nowrap">&nbsp;+</span>
            <input
              type="text"
              placeholder="5"
              value={settings.abMinScore}
              onChange={(e) => handleInputChange("abMinScore", e.target.value)}
              style={{ textAlign: "center", width: "2.5em" }}
              className="mx-2 rounded border border-gray-400 p-1"
            />
            <span className="whitespace-nowrap">&nbsp;*</span>
            <span className="whitespace-nowrap">&nbsp;stm(B)</span>
            <span className="whitespace-nowrap">&nbsp;+</span>
            <span className="whitespace-nowrap">&nbsp;stm(C)</span>
            <span className="whitespace-nowrap">
              &nbsp;{t("commutator.for")} stm(A) ≥ stm(B)
            </span>
          </div>
        </div>
      ),
    },
    {
      label: t("settings.commutator.addScore"),
      id: "addScore",
      type: "text",
      placeholder: "1",
      style: { textAlign: "center", width: "2.5em" },
      tooltip: t("commutator.addScoreTip"),
    },
    {
      label: t("settings.commutator.fast"),
      id: "fast",
      type: "checkbox",
      tooltip: t("commutator.fastTip"),
    },
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleButtonClick = (action: string) => {
    if (action === "decompose") {
      const config = createCommutatorConfig(inputAlg, "search");
      const result = commutator.search(config);
      setOutput(result.join("\n"));
    } else if (action === "expand") {
      const config = createCommutatorConfig(inputAlg, "expand");
      setOutput(commutator.expand(config));
    }
  };

  const handleFileImport = async (
    e: React.ChangeEvent<HTMLInputElement>,
    method: string,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData: (string | null)[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });
    const algorithms: string[] = [];
    for (const row of jsonData) {
      for (const cell of row) {
        if (typeof cell === "string" && cell.trim().length > 0) {
          algorithms.push(cell);
        }
      }
    }

    setProgress({
      currentIndex: 0,
      totalCount: algorithms.length,
      currentAlgorithm: "",
      timeTaken: 0,
    });
    const results: { input: string; output: string; duration: number }[] = [];

    let duration = 0;
    const startTime = performance.now();
    for (let i = 0; i < algorithms.length; i++) {
      const alg = algorithms[i];
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        setProgress({
          currentIndex: i + 1,
          totalCount: algorithms.length,
          currentAlgorithm: alg,
          timeTaken: duration,
        });
        setTimeout(resolve, 0);
      });

      let resultStr = "";
      if (method === "decompose") {
        const config = createCommutatorConfig(alg, "search");
        resultStr = commutator.search(config)[0];
      } else {
        const config = createCommutatorConfig(alg, "expand");
        resultStr = commutator.expand(config);
      }

      const endTime = performance.now();
      duration = endTime - startTime;
      results.push({ input: alg, output: resultStr, duration });
    }

    setProgress({
      currentIndex: algorithms.length,
      totalCount: algorithms.length,
      currentAlgorithm: "",
      timeTaken: duration,
    });

    const wb = XLSX.utils.book_new();
    const wsData = results.map((r) => [r.input, r.output]);
    const ws = XLSX.utils.aoa_to_sheet([["Input", "Output"], ...wsData]);
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, `results_${Date.now()}.xlsx`);

    // eslint-disable-next-line require-atomic-updates
    e.target.value = "";
  };

  return (
    <PageSection title={t("commutator.title")} widthClass="lg:w-8/12">
      <p className="text-black dark:text-white">{t("commutator.heading")}</p>
      <div className="flex items-center justify-between">
        <div>
          <div
            className={
              "text-dark mt-4 mr-2 mb-3 inline-block font-bold dark:text-white"
            }
          >
            {t("common.mode")}
          </div>
          <select
            className="text-dark focus:border-primary dark:bg-gray-dark dark:focus:border-primary border-b-[3px] border-gray-500 bg-inherit py-1 pr-4 text-base font-medium outline-hidden transition-all duration-300 dark:border-gray-100 dark:text-white dark:shadow-none dark:focus:shadow-none"
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="single">{t("commutator.single")}</option>
            <option value="excel">{t("commutator.excel")}</option>
          </select>
        </div>
        <div className="py-[6px]">
          <button
            className="hover:text-primary dark:bg-dark dark:hover:text-primary mt-1 mb-1 inline-block cursor-pointer rounded-sm border-2 border-black bg-white px-4 py-2 text-base font-semibold text-black duration-300 ease-in-out dark:border-white dark:text-white"
            onClick={() => setShowSettingsModal(true)}
          >
            {t("commutator.openSettings")}
          </button>
        </div>
      </div>
      {showSettingsModal && (
        <div
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          ref={modalRef}
        >
          <div className="pointer-events-auto max-h-full max-w-3xl overflow-y-auto rounded border border-2 border-gray-400 bg-white p-4 shadow-lg dark:border-gray-600 dark:bg-gray-700">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t("commutator.settings")}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500"
                onClick={() => setShowSettingsModal(false)}
              >
                ✕
              </button>
            </div>
            {settingsItems.map((item, index) => (
              <div key={index} className="mb-2 flex items-center">
                {item.type !== "custom" && (
                  <>
                    <label className="mr-2">{item.label}</label>
                    {item.type === "text" && (
                      <input
                        type={item.type}
                        placeholder={item.placeholder}
                        value={(
                          settings[item.id as keyof typeof settings] ?? ""
                        ).toString()}
                        onChange={(e) =>
                          handleInputChange(item.id, e.target.value)
                        }
                        style={item.style as CSSProperties}
                        className="rounded border border-gray-400 bg-white p-1 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                      />
                    )}
                    {item.type === "checkbox" && (
                      <input
                        type="checkbox"
                        checked={settings[item.id] || false}
                        onChange={(e) =>
                          handleChange(item.id, e.target.checked)
                        }
                        className="mr-2"
                      />
                    )}
                    {item.tooltip && (
                      <div className="help group relative ml-2 inline-block cursor-pointer">
                        <i className="fas fa-question-circle mr-2 text-blue-600 dark:text-blue-400"></i>
                        <div className="absolute top-1/2 left-full ml-2 hidden w-64 -translate-y-1/2 rounded bg-gray-800 p-2 whitespace-normal text-white shadow-lg group-hover:block">
                          {item.tooltip.split("\n").map((line, idx) => (
                            <React.Fragment key={idx}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {item.type === "custom" && item.content && item.content()}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-dark mt-4 mr-2 mb-3 inline-block text-lg dark:text-white">
        {t(`commutator.${mode}Hint`)}
      </div>

      {mode === "single" && (
        <>
          <div className="mb-4">
            <input
              id="alg"
              type="text"
              className="text-dark focus:border-primary dark:focus:border-primary w-full border-b-[3px] border-gray-500 bg-inherit px-2 py-1 text-xl font-medium outline-hidden transition-all duration-300 dark:border-gray-100 dark:bg-inherit dark:text-white dark:shadow-none dark:focus:shadow-none"
              value={inputAlg}
              onChange={(e) => setInputAlg(e.target.value)}
              autoComplete="off"
            />
          </div>
        </>
      )}

      {mode === "excel" && (
        <div className="text-dark mt-3 mr-2 mb-[15px] block text-lg dark:text-white">
          {t("commutator.excelHint1")}
        </div>
      )}
      {mode === "single" && (
        <>
          <div className="mb-4 flex flex-row space-x-4">
            <div
              className={
                "hover:text-primary dark:bg-dark dark:hover:text-primary mt-1 mb-1 inline-block cursor-pointer rounded-sm border-2 border-black bg-white px-4 py-2 text-base font-semibold text-black duration-300 ease-in-out dark:border-white dark:text-white"
              }
              onClick={() => handleButtonClick("decompose")}
            >
              {t("commutator.decompose")}
            </div>
            <div
              className={
                "hover:text-primary dark:bg-dark dark:hover:text-primary mt-1 mb-1 inline-block cursor-pointer rounded-sm border-2 border-black bg-white px-4 py-2 text-base font-semibold text-black duration-300 ease-in-out dark:border-white dark:text-white"
              }
              onClick={() => handleButtonClick("expand")}
            >
              {t("commutator.expand")}
            </div>
          </div>
        </>
      )}

      {mode === "excel" && (
        <div className="mb-4 flex flex-row space-x-4">
          {buttons.map((id) => (
            <div key={id} className="flex items-center">
              <label
                htmlFor={id}
                className="hover:text-primary dark:bg-dark dark:hover:text-primary mt-1 mb-1 inline-block cursor-pointer rounded-sm border-2 border-black bg-white px-4 py-2 text-base font-semibold text-black duration-300 ease-in-out dark:border-white dark:text-white"
              >
                {t(`commutator.${id}`)}
              </label>
              <input
                id={id}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => handleFileImport(e, id)}
                className="hidden"
              />
            </div>
          ))}
        </div>
      )}

      <div className="text-dark mt-4 mr-2 mb-3 inline-block text-lg dark:text-white">
        {t("commutator.output")}
      </div>
      <div className="w-full rounded border border-gray-300 p-2 text-xl whitespace-pre-wrap dark:border-gray-600 dark:bg-gray-800 dark:text-white">
        {mode === "single" &&
          (outputAlg ? <div>{outputAlg}</div> : <div className="h-20"></div>)}
        {mode === "excel" &&
          (progress.totalCount > 0 ? (
            <div>
              <p>
                {`${t("commutator.processing")} ${progress.currentIndex} / ${progress.totalCount}`}
                {progress.currentAlgorithm && (
                  <span>
                    {" "}
                    - {t("commutator.current")}: {progress.currentAlgorithm}
                  </span>
                )}
              </p>
              <p>
                {t("commutator.time")}: {(progress.timeTaken / 1000).toFixed(2)}{" "}
                s
              </p>
            </div>
          ) : (
            <div className="h-20"></div>
          ))}
      </div>
    </PageSection>
  );
};

export default Commutator;
