"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/i18n/client";
import useResponsiveTable from "@/utils/useResponsiveTable";
import Loading from "@/app/loading";

interface UserUrls {
  [key: string]: string;
}

interface UserTime {
  wca_id: string;
  "3bld": number;
  "4bld": number;
}

interface Users {
  [key: string]: {
    urls: { [key: string]: string };
    time: UserTime;
  };
}

const Sheets = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<Users>({});
  const divRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
  const tableRef = useRef<HTMLTableElement>(
    null as unknown as HTMLTableElement,
  );

  useResponsiveTable(tableRef, divRef);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const response = await import("public/data/sourceToUrl.json");
      const timeData = (await import("public/data/sourceToResult.json")) as {
        default: {
          [key: string]: { wca_id?: string; "3bld"?: number; "4bld"?: number };
        };
      };

      const userEntries = Object.entries(response.default).map(
        ([user, urls]) => ({
          [user]: {
            urls,
            time: {
              "3bld": timeData.default[user]?.["3bld"] || 0,
              "4bld": timeData.default[user]?.["4bld"] || 0,
              wca_id: timeData.default[user]?.["wca_id"] || 0,
            },
          },
        }),
      );
      setUsers(Object.assign({}, ...userEntries));
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const getLink = (key: string, value?: string) => {
    if (!value) {
      return <span className="text-gray-500"></span>;
    }
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="dashed-link"
      >
        {key}
      </a>
    );
  };
  const formatTime = (time: number) => {
    const seconds = time / 100;
    if (seconds < 60) {
      return seconds.toFixed(2);
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(2);
    return `${minutes}:${remainingSeconds.padStart(5, "0")}`;
  };

  const renderLinks = (urls: UserUrls) => {
    const linkKeys = [
      "bld",
      "3bld",
      "bigbld",
      "edge",
      "corner",
      "parity",
      "ltct",
      "twists",
    ];
    const validLinks = linkKeys.filter((key) => Boolean(urls[key]));

    return (
      <td>
        {validLinks.map((key, index) => (
          <span key={key}>
            {getLink(t(`sheets.key.${key}`), urls[key])}
            {index < validLinks.length - 1 && ", "}
          </span>
        ))}
      </td>
    );
  };

  const requestSort = (key: string) => {
    const sortedUsers = Object.entries(users).sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      if (key === "3bld") {
        aValue = a[1].time["3bld"];
        bValue = b[1].time["3bld"];
      } else if (key === "4bld") {
        aValue = a[1].time["4bld"];
        bValue = b[1].time["4bld"];
      } else if (key === "name") {
        aValue = a[0];
        bValue = b[0];
      } else if (key === "wca_id") {
        aValue = a[1].time.wca_id;
        bValue = b[1].time.wca_id;
      } else {
        aValue = a[1].urls[key] || "";
        bValue = b[1].urls[key] || "";
      }

      // Check if aValue or bValue is an empty string
      if (aValue === 0 && bValue === 0) {
        return 0; // Both are empty, consider equal
      }
      if (aValue === 0) {
        return 1; // Empty value a should come after b
      }
      if (bValue === 0) {
        return -1; // Empty value b should come after a
      }

      // Normal comparison for non-empty values
      if (aValue < bValue) {
        return -1;
      }
      if (aValue > bValue) {
        return 1;
      }
      return 0;
    });

    setUsers(Object.fromEntries(sortedUsers));
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <section className="pt-[100px] pb-[120px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-10/12">
            <div>
              <h2 className="mb-8 text-center text-3xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight dark:text-white">
                {t("sheets.title")}
              </h2>
              <p className="mb-8 text-black dark:text-white">
                {t("sheets.hint")
                  .split("\n")
                  .map((line, index, array) => (
                    <span key={index}>
                      {line}
                      {index < array.length - 1 && <br />}
                    </span>
                  ))}
              </p>
              <div ref={divRef} className="overflow-x-auto">
                <table ref={tableRef}>
                  <thead className="bg-gray-100">
                    <tr>
                      <th>{t("sheets.no")}</th>
                      <th
                        onClick={() => requestSort("name")}
                        style={{ cursor: "pointer" }}
                      >
                        {t("sheets.name")}
                      </th>
                      <th
                        onClick={() => requestSort("wca_id")}
                        style={{ cursor: "pointer" }}
                      >
                        {t("sheets.wca_id")}
                      </th>
                      <th
                        onClick={() => requestSort("3bld")}
                        style={{ cursor: "pointer" }}
                      >
                        {t("sheets.3bld")}
                      </th>
                      <th
                        onClick={() => requestSort("4bld")}
                        style={{ cursor: "pointer" }}
                      >
                        {t("sheets.4bld")}
                      </th>
                      <th>{t("sheets.url")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(users).map(([name, { urls, time }]) => {
                      return (
                        <tr key={name}>
                          <td> {Object.keys(users).indexOf(name) + 1}</td>
                          <td>
                            {name.length > 25
                              ? `${name.split("(")[0].trim()}`
                              : name}
                          </td>
                          <td>
                            {time.wca_id ? (
                              <a
                                href={
                                  time.wca_id
                                    ? `https://www.worldcubeassociation.org/persons/${time.wca_id}`
                                    : "#"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dashed-link"
                              >
                                {time.wca_id}
                              </a>
                            ) : (
                              <span className="text-gray-500"></span>
                            )}
                          </td>
                          <td>
                            {time["3bld"] > 0 ? (
                              formatTime(time["3bld"])
                            ) : (
                              <span className="text-gray-500"></span>
                            )}
                          </td>
                          <td>
                            {time["4bld"] > 0 ? (
                              formatTime(time["4bld"])
                            ) : (
                              <span className="text-gray-500"></span>
                            )}
                          </td>
                          {renderLinks(urls)}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sheets;
