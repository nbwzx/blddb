import { useEffect, RefObject } from "react";

interface OptionalRefs {
  inputRef?: RefObject<HTMLInputElement | null>;
  selectRefs?: RefObject<Array<HTMLSelectElement> | null>;
  modeRef?: RefObject<HTMLSelectElement | null>;
}

function useResponsiveTable(
  tableRef: RefObject<HTMLTableElement | null>,
  divRef: RefObject<HTMLDivElement | null>,
  { inputRef, selectRefs, modeRef }: OptionalRefs = {},
) {
  const adjustTableFontSize = () => {
    if (tableRef.current && divRef.current) {
      const width = document.body.clientWidth;
      const tableCols = tableRef.current.rows[0].cells.length;
      const tableWidth0 = Math.round(
        tableCols * (width * 0.01) + (tableCols + 1) * (2 / 3),
      );
      tableRef.current.style.fontSize = "18px";
      const tableWidth = tableRef.current.offsetWidth;
      const divWidth = divRef.current.offsetWidth;
      if (tableWidth > divWidth) {
        const newFontSize =
          (18 * (divWidth - tableWidth0)) / (tableWidth - tableWidth0);
        tableRef.current.style.fontSize = `${newFontSize}px`;
      }
    }
  };

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      if (mutationsList && tableRef.current) {
        inputRef?.current?.blur();
        selectRefs?.current?.forEach((selectRef) => selectRef.blur());
        modeRef?.current?.blur();
        adjustTableFontSize();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("resize", adjustTableFontSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", adjustTableFontSize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableRef, divRef, inputRef, selectRefs, modeRef]);

  return { adjustTableFontSize };
}

export default useResponsiveTable;
