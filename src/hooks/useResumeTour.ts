import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/components/context";

export function useResumeTour() {
  const { state, setState } = useAppContext();
  const pathname = usePathname();
  const { tourActive, steps } = state;

  const stepIndex = steps.findIndex(
    (step) => step.route.split("?")[0] === pathname,
  );

  useEffect(() => {
    const sameRoute = steps
      .map((step, i) => ({ step, i }))
      .filter(({ step }) => step.route.split("?")[0] === pathname);

    let rafId = 0;
    const deadline = Date.now() + 10000;
    const startTour = () => {
      const target = steps[stepIndex]?.target;
      const selector = typeof target === "string" ? target : null;
      if (!selector || document.querySelector(selector)) {
        setState({ run: true, stepIndex });
        return;
      }
      if (Date.now() < deadline) {
        rafId = requestAnimationFrame(startTour);
        return;
      }
      const fallback = sameRoute.find(
        ({ i, step }) =>
          i !== stepIndex &&
          typeof step.target === "string" &&
          document.querySelector(step.target),
      );
      if (fallback) {
        setState({ run: true, stepIndex: fallback.i });
      }
    };
    if (tourActive && stepIndex >= 0) {
      rafId = requestAnimationFrame(startTour);
    }
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [tourActive, setState, stepIndex, steps, pathname]);
}
