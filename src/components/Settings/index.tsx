"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/client";
import Loading from "@/app/loading";
import codeConverter from "@/utils/codeConverter";

const Settings = () => {
  const { t } = useTranslation();
  const floatRegex = /^\d{0,4}(\.\d{0,2})?$/u;

  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});

  const settingsGroups = {
    general: [
      {
        id: "mode",
        type: "select",
        options: [{ id: "nightmare" }, { id: "manmade" }],
      },
      {
        id: "showThumbPosition",
        type: "checkbox",
        default: true,
      },
      {
        id: "mirrorLR",
        type: "checkbox",
        default: false,
      },
      {
        id: "orderOfAlgs",
        type: "select",
        options: [{ id: "Chichu" }, { id: "Speffz" }],
        default: codeConverter.getDefaultOrderOfAlgs(),
      },
    ],
    manmade: [
      {
        id: "show3BldAlgsUnderSecs",
        type: "text",
        regex: floatRegex,
      },
      {
        id: "show4BldAlgsUnderSecs",
        type: "text",
        regex: floatRegex,
      },
    ],
    commutator: [
      {
        id: "noBrackets",
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
        id: "outerBrackets",
        type: "checkbox",
      },
    ],
  };

  const modeToEmoji = {
    nightmare: "\u{1F480}",
    manmade: "\u{2009}\u{F2BD}\u{2009}",
  };

  const loadSettings = () => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("settings");
      let newSettings = {};
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        newSettings = { ...parsedSettings };
      }
      Object.keys(settingsGroups).forEach((moduleId) => {
        settingsGroups[moduleId].forEach((setting) => {
          if (typeof newSettings[setting.id] === "undefined") {
            newSettings[setting.id] = setting.default;
          }
        });
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

  const handleChange = (id: string, _type: string, value: string | boolean) => {
    if (_type === "text") {
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
    }
    const newSettings = { ...settings, [id]: value };
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="pb-[120px] pt-[100px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-6/12">
            <div>
              <h2 className="mb-8 text-center text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                {t("settings.title")}
              </h2>
              {Object.keys(settingsGroups).map((moduleId, index) => (
                <div key={moduleId} className="mb-8">
                  <div className="mb-4 text-lg text-black dark:text-white">
                    <h3 className="text-2xl font-semibold">
                      {t(`settings.${moduleId}.title`)}
                    </h3>
                  </div>
                  <div className="flex flex-col">
                    {settingsGroups[moduleId].map((setting) => (
                      <div
                        key={setting.id}
                        className="mb-4 flex w-full items-center"
                      >
                        <div className="flex-1">
                          <div className="text-lg text-black dark:text-white">
                            {t(`settings.${moduleId}.${setting.id}`)}
                          </div>
                        </div>
                        {setting.type === "select" && (
                          <select
                            className="ml-4 mr-2 rounded-md border border-2 border-gray-400 p-2 pr-8 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            value={settings[setting.id] || ""}
                            onChange={(e) =>
                              handleChange(setting.id, "select", e.target.value)
                            }
                          >
                            {setting.options.map((option: { id: string }) => (
                              <option key={option.id} value={option.id}>
                                {`${modeToEmoji[option.id] || ""} ${t(`settings.${moduleId}.${option.id}`)}`}
                              </option>
                            ))}
                          </select>
                        )}
                        {setting.type === "checkbox" && (
                          <input
                            type="checkbox"
                            id={setting.id}
                            checked={settings[setting.id] || false}
                            onChange={(e) =>
                              handleChange(
                                setting.id,
                                "checkbox",
                                e.target.checked,
                              )
                            }
                            className="ml-4 mr-2 h-5 w-5 text-gray-400 dark:text-white"
                          />
                        )}
                        {setting.type === "text" && (
                          <input
                            type="text"
                            id={setting.id}
                            autoComplete="off"
                            value={settings[setting.id] || ""}
                            onChange={(e) =>
                              handleChange(setting.id, "text", e.target.value)
                            }
                            className="ml-4 mr-2 w-20 rounded-md border border-2 border-gray-400 p-2 text-right focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {index < Object.keys(settingsGroups).length - 1 && (
                    <hr className="my-8 border-t-2 border-gray-300 dark:border-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
