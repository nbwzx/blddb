"use client";

import { useRouter } from "next/navigation";
import { useMount } from "react-use";
import { useAppContext } from "./context";
import { useTranslation } from "@/i18n/client";
import { Joyride, EventData, EVENTS, type Styles } from "react-joyride";
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
  const className = [
    "tour-paragraph",
    bold ? "tour-paragraph--bold" : "",
    size === "lg" ? "tour-paragraph--lg" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return <p className={className}>{children}</p>;
}

const tourColors = {
  background: "var(--tour-surface)",
  primary: "var(--color-primary)",
  text: "var(--tour-on-surface)",
};

const tourStyles: Partial<Styles> = {
  tooltip: {
    borderRadius: "12px",
    padding: "4px",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.28)",
  },
  tooltipContent: {
    padding: "16px 18px",
    textAlign: "left",
  },
  tooltipFooter: {
    padding: "0 18px 16px",
    gap: "8px",
  },
  buttonPrimary: {
    backgroundColor: "var(--color-primary)",
    borderRadius: "8px",
    padding: "8px 14px",
    fontWeight: 600,
    fontSize: "14px",
    color: "var(--color-white)",
  },
  buttonBack: {
    color: "var(--tour-on-surface)",
    marginRight: "auto",
    fontSize: "14px",
    fontWeight: 500,
    opacity: 0.85,
  },
  buttonClose: {
    color: "var(--tour-on-surface)",
  },
  buttonSkip: {
    color: "var(--tour-on-surface)",
    opacity: 0.7,
    fontSize: "14px",
  },
  arrow: {
    color: "var(--tour-surface)",
  },
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
        styles={tourStyles}
        options={{
          arrowColor: tourColors.background,
          backgroundColor: tourColors.background,
          primaryColor: tourColors.primary,
          textColor: tourColors.text,
          skipBeacon: true,
          scrollOffset: 400,
          overlayClickAction: false,
          zIndex: 10000,
        }}
      />
    </>
  );
}
