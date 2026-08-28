import { useState } from "react";

export function useCopyToClipboard(timeout = 2000) {
  const [copySuccess, setCopySuccess] = useState(false);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, timeout);
    });
  };

  return { copySuccess, copy };
}
