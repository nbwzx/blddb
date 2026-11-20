import tracer from "@/utils/tracer";
import tracer_555 from "@/utils/tracer_555";
import commutator from "@/utils/commutator";
import commutator_555 from "@/utils/commutator_555";
import commutator_555_final from "@/utils/commutator_555_final";
import codeConverter from "@/utils/codeConverter";
import bigbldCodeConverter from "@/utils/bigbldCodeConverter";

// Fired after a search lands on the page already open, which stays mounted
// and would otherwise never re-read the address.
export const ALG_SEARCH_EVENT = "blddb:alg-search";

// The table page that holds an alg, with its position and highlight, or null
// when the alg is not a recognised 3BLD or BigBLD case.
export const algSearchUrl = (term: string): string | null => {
  if (!term.trim()) {
    return null;
  }
  let expanded = commutator.expand({ algorithm: term });
  let codeAuto = tracer.getCodeAuto(expanded);
  if (codeAuto[0] !== "") {
    const position = codeConverter
      .customCodeToPosition(codeAuto[1], codeAuto[0], false)
      .join("-");
    return `/${codeAuto[0]}?position=${position}&highlight=${encodeURIComponent(expanded)}`;
  }
  expanded = commutator_555_final.finalReplaceAlg(commutator_555.expand(term));
  codeAuto = tracer_555.getCodeAuto(expanded);
  if (codeAuto[0] !== "") {
    const position = bigbldCodeConverter
      .customCodeToPosition(codeAuto[1], codeAuto[0], false)
      .join("-");
    return `/bigbld/${codeAuto[0]}?position=${position}&highlight=${encodeURIComponent(expanded)}`;
  }
  return null;
};
