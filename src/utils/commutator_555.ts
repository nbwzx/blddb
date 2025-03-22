// Revised from the following repository:
/*!
 * Commutator (https://github.com/nbwzx/commutator)
 * Copyright (c) 2022-2023 Zixing Wang
 * Licensed under MIT (https://github.com/nbwzx/commutator/blob/main/LICENSE)
 */

import commutator from "./commutator";
const commutator_555 = (function () {
  const commuteInit = {
    U: { class: 1, priority: 1 },
    u: { class: 1, priority: 1 },
    e: { class: 1, priority: 1 },
    d: { class: 1, priority: 1 },
    D: { class: 1, priority: 1 },
    E: { class: 1, priority: 1 },
    壹: { class: 1, priority: 1 },
    一: { class: 1, priority: 1 },
    咦: { class: 1, priority: 1 },
    伍: { class: 1, priority: 1 },
    五: { class: 1, priority: 1 },
    无: { class: 1, priority: 1 },
    R: { class: 2, priority: 1 },
    r: { class: 2, priority: 1 },
    m: { class: 2, priority: 1 },
    l: { class: 2, priority: 1 },
    L: { class: 2, priority: 1 },
    M: { class: 2, priority: 1 },
    贰: { class: 2, priority: 1 },
    二: { class: 2, priority: 1 },
    而: { class: 2, priority: 1 },
    肆: { class: 2, priority: 1 },
    四: { class: 2, priority: 1 },
    私: { class: 2, priority: 1 },
    F: { class: 3, priority: 1 },
    f: { class: 3, priority: 1 },
    s: { class: 3, priority: 1 },
    b: { class: 3, priority: 1 },
    B: { class: 3, priority: 1 },
    S: { class: 3, priority: 1 },
    叁: { class: 3, priority: 1 },
    三: { class: 3, priority: 1 },
    散: { class: 3, priority: 1 },
    陆: { class: 3, priority: 1 },
    六: { class: 3, priority: 1 },
    流: { class: 3, priority: 1 },
  };

  const initialReplaceInit = {
    "4Uw": "咦",
    "4Lw": "而",
    "4Fw": "散",
    "4Rw": "私",
    "4Dw": "无",
    "4Bw": "流",
    "3Uw": "一",
    "3Lw": "二",
    "3Fw": "三",
    "3Rw": "四",
    "3Dw": "五",
    "3Bw": "六",
    Uw: "壹",
    Lw: "贰",
    Fw: "叁",
    Rw: "肆",
    Dw: "伍",
    Bw: "陆",
  };

  const finalReplaceInit = {
    咦2: "4Uw2",
    而2: "4Lw2",
    散2: "4Fw2",
    私2: "4Rw2",
    无2: "4Dw2",
    流2: "4Bw2",
    一2: "3Uw2",
    二2: "3Lw2",
    三2: "3Fw2",
    四2: "3Rw2",
    五2: "3Dw2",
    六2: "3Bw2",
    壹2: "Uw2",
    贰2: "Lw2",
    叁2: "Fw2",
    肆2: "Rw2",
    伍2: "Dw2",
    陆2: "Bw2",
    "咦'": "4Uw'",
    "而'": "4Lw'",
    "散'": "4Fw'",
    "私'": "4Rw'",
    "无'": "4Dw'",
    "流'": "4Bw'",
    "一'": "3Uw'",
    "二'": "3Lw'",
    "三'": "3Fw'",
    "四'": "3Rw'",
    "五'": "3Dw'",
    "六'": "3Bw'",
    "壹'": "Uw'",
    "贰'": "Lw'",
    "叁'": "Fw'",
    "肆'": "Rw'",
    "伍'": "Dw'",
    "陆'": "Bw'",
    咦: "4Uw",
    而: "4Lw",
    散: "4Fw",
    私: "4Rw",
    无: "4Dw",
    流: "4Bw",
    一: "3Uw",
    二: "3Lw",
    三: "3Fw",
    四: "3Rw",
    五: "3Dw",
    六: "3Bw",
    壹: "Uw",
    贰: "Lw",
    叁: "Fw",
    肆: "Rw",
    伍: "Dw",
    陆: "Bw",
  };

  function expand(algorithm: string): string {
    return commutator.expand({
      algorithm,
      initialReplace: initialReplaceInit,
      finalReplace: finalReplaceInit,
      commute: commuteInit,
    });
  }

  return {
    expand,
  };
})();

export default commutator_555;
