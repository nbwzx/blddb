"use client";

import { useRouter } from "next/navigation";
import { useMount } from "react-use";
import { useAppContext } from "./context";
import { useTranslation } from "@/i18n/client";
import { Joyride, EventData, EVENTS } from "react-joyride";
import React from "react";

function Paragraph({
  bold,
  size,
  children,
}: {
  bold?: boolean;
  size?: "lg";
  children: React.ReactNode;
}) {
  return (
    <p
      style={{
        margin: 0,
        fontWeight: bold ? 700 : 400,
        fontSize: size === "lg" ? 18 : 16,
        lineHeight: 1.2,
      }}
    >
      {children}
    </p>
  );
}

const tourColors = {
  background: "#4d4d4d",
  primary: "#ad7bff",
  text: "#fff",
};

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
          route: "/",
        },
        {
          target: "#scheme",
          content: (
            <>
              <Paragraph size="lg">{t("tour.chooseScheme")}</Paragraph>
            </>
          ),
          route: "/code",
        },
        {
          target: "#mode",
          content: (
            <>
              <Paragraph size="lg">{t("tour.chooseMode")}</Paragraph>
            </>
          ),
          route: "/edge?position=UF-UB-RU&mode=manmade",
        },
        {
          target: "#inputText",
          content: (
            <>
              <Paragraph size="lg">{t("tour.enterLetterPairs")}</Paragraph>
            </>
          ),
          route: "/edge?position=UF-UB-RU&mode=manmade",
        },
        {
          target: "#alg",
          content: (
            <>
              <Paragraph size="lg">{t("tour.copyAlgs")}</Paragraph>
            </>
          ),
          route: "/edge?position=UF-UB-RU&mode=manmade",
        },
        {
          target: "#video",
          content: (
            <>
              <Paragraph size="lg">{t("tour.watchVideo")}</Paragraph>
            </>
          ),
          route: "/edge?position=UF-UB-RU&mode=manmade",
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
      if (steps[index].route === steps[nextIndex].route) {
        setState({ run: true, stepIndex: nextIndex });
      } else {
        setState({ run: false });
        router.push(steps[nextIndex].route);
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
          arrowColor: tourColors.background,
          backgroundColor: tourColors.background,
          primaryColor: tourColors.primary,
          textColor: tourColors.text,
          skipBeacon: true,
          scrollOffset: 400,
          overlayClickAction: false,
        }}
      />
    </>
  );
}
