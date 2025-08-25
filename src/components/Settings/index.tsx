"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/client";
import Loading from "@/app/loading";
import codeConverter from "@/utils/codeConverter";
import PageSection from "@/components/PageSection";

const Settings = () => {
  const { t } = useTranslation();
  const floatRegex = /^\d{0,4}(\.\d{0,2})?$/u;

  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Record<string, any>>({});

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
        id: "showInverseAlgs",
        type: "checkbox",
        default: false,
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
    <PageSection title={t("settings.title")} widthClass="lg:w-6/12">
      {Object.keys(settingsGroups).map((moduleId, index) => (
        <div key={moduleId} className="mb-8">
          <div className="mb-4 text-lg text-black dark:text-white">
            <h3 className="text-2xl font-semibold">
              {t(`settings.${moduleId}.title`)}
            </h3>
          </div>
          <div className="flex flex-col">
            {settingsGroups[moduleId as keyof typeof settingsGroups].map(
              (setting) => (
                <div key={setting.id} className="mb-4 flex w-full items-center">
                  <div className="flex-1">
                    <div className="text-lg text-black dark:text-white">
                      {t(`settings.${moduleId}.${setting.id}`)}
                    </div>
                  </div>
                  {setting.type === "select" && (
                    <select
                      className="focus:border-primary dark:focus:border-primary mr-2 ml-4 rounded-md border border-2 border-gray-400 p-2 pr-8 text-black transition-all duration-300 focus:outline-hidden dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      value={settings[setting.id] || ""}
                      onChange={(e) =>
                        handleChange(setting.id, "select", e.target.value)
                      }
                    >
                      {(setting as { options: { id: string }[] }).options.map(
                        (option: { id: string }) => (
                          <option key={option.id} value={option.id}>
                            {`${modeToEmoji[option.id as keyof typeof modeToEmoji] || ""} ${t(`settings.${moduleId}.${option.id}`)}`}
                          </option>
                        ),
                      )}
                    </select>
                  )}
                  {setting.type === "checkbox" && (
                    <input
                      type="checkbox"
                      id={setting.id}
                      checked={settings[setting.id] || false}
                      onChange={(e) =>
                        handleChange(setting.id, "checkbox", e.target.checked)
                      }
                      className="mr-2 ml-4 h-5 w-5 text-gray-400 dark:text-white"
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
                      className="focus:border-primary dark:focus:border-primary mr-2 ml-4 w-20 rounded-md border border-2 border-gray-400 p-2 text-right text-black transition-all duration-300 focus:outline-hidden dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  )}
                </div>
              ),
            )}
          </div>
          {index < Object.keys(settingsGroups).length - 1 && (
            <hr className="my-8 border-t-2 border-gray-300 dark:border-gray-600" />
          )}
        </div>
      ))}
    </PageSection>
  );
};

export default Settings;
