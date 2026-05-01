"use client";

import { useRouter } from "next/navigation";
import { useMount } from "react-use";
import { Paragraph, theme } from "@gilbarbara/components";
import { useAppContext } from "./context";
import { useTranslation } from "@/i18n/client";
import { Joyride, EventData, EVENTS } from "react-joyride";
import React from "react";

export default function MultiRouteWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    setState,
    state: { run, stepIndex, steps },
  } = useAppContext();
  const router = useRouter();
  const { t } = useTranslation();
  const joyrideLocale = {
    back: t("tour.back"),
    last: t("tour.last"),
    next: t("tour.next"),
  };

  useMount(() => {
    setState({
      steps: [
        {
          target: "#home1",
          content: (
            <>
              <Paragraph bold size="lg">
                {t("tour.welcome")}
              </Paragraph>
              <Paragraph>{t("tour.start")}</Paragraph>{" "}
            </>
          ),
          data: { current: "/" },
        },
        {
          target: "#scheme",
          content: (
            <>
              <Paragraph size="lg">{t("tour.chooseScheme")}</Paragraph>
            </>
          ),
          data: { current: "/code" },
        },
        {
          target: "#mode",
          content: (
            <>
              <Paragraph size="lg">{t("tour.chooseMode")}</Paragraph>
            </>
          ),
          data: { current: "/edge?position=UF-UB-RU&mode=manmade" },
        },
        {
          target: "#inputText",
          content: (
            <>
              <Paragraph size="lg">{t("tour.enterLetterPairs")}</Paragraph>
            </>
          ),
          data: { current: "/edge?position=UF-UB-RU&mode=manmade" },
        },
        {
          target: "#alg",
          content: (
            <>
              <Paragraph size="lg">{t("tour.copyAlgs")}</Paragraph>
            </>
          ),
          data: { current: "/edge?position=UF-UB-RU&mode=manmade" },
        },
        {
          target: "#video",
          content: (
            <>
              <Paragraph size="lg">{t("tour.watchVideo")}</Paragraph>
            </>
          ),
          data: { current: "/edge?position=UF-UB-RU&mode=manmade" },
        },
      ],
    });
  });

  const handleEvent = (data: EventData) => {
    const { action, index, type } = data;
    // console.log("Joyride event:", data.type, data);
    if (
      action === "close" ||
      type === EVENTS.ERROR ||
      type === EVENTS.TARGET_NOT_FOUND
    ) {
      setState({ run: false, stepIndex: 0, tourActive: false });
      return;
    }

    const nextIndex = action === "prev" ? index - 1 : index + 1;
    if (type === EVENTS.STEP_AFTER) {
      if (nextIndex === steps.length) {
        setState({ run: false, stepIndex: 0, tourActive: false });
        router.push("/");
        return;
      }
      if (steps[index].data.current === steps[nextIndex].data.current) {
        setState({ run: true, stepIndex: nextIndex });
      } else {
        setState({ run: false });
        router.push(steps[nextIndex].data.current);
      }
    }
  };

  return (
    <>
      {children}
      <Joyride
        onEvent={handleEvent}
        locale={joyrideLocale}
        continuous
        run={run}
        stepIndex={stepIndex}
        steps={steps}
        options={{
          arrowColor: theme.grayScale[700],
          backgroundColor: theme.grayScale[700],
          primaryColor: theme.colors.purple,
          textColor: theme.white,
          skipBeacon: true,
          scrollOffset: 400,
          overlayClickAction: false,
        }}
      />
    </>
  );
}
