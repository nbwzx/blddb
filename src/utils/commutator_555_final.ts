// Revised from the following repository:
/*!
 * Commutator (https://github.com/nbwzx/commutator)
 * Copyright (c) 2022-2025 Zixing Wang <zixingwang.cn@gmail.com>
 * Licensed under MIT (https://github.com/nbwzx/commutator/blob/main/LICENSE)
 */

import commutator from "./commutator";
import commutator_555 from "./commutator_555";
const commutator_555_final = (function () {
  const commuteInit = {
    U: { class: 1, priority: 1 },
    u: { class: 1, priority: 2 },
    e: { class: 1, priority: 3 },
    d: { class: 1, priority: 4 },
    D: { class: 1, priority: 5 },
    R: { class: 2, priority: 1 },
    r: { class: 2, priority: 2 },
    m: { class: 2, priority: 3 },
    l: { class: 2, priority: 4 },
    L: { class: 2, priority: 5 },
    F: { class: 3, priority: 1 },
    f: { class: 3, priority: 2 },
    s: { class: 3, priority: 3 },
    b: { class: 3, priority: 4 },
    B: { class: 3, priority: 5 },
  };

  const initialReplaceInit = {
    y2: "U2 u2 e2 d2 D2",
    x2: "R2 r2 m2 l2 L2",
    z2: "F2 f2 s2 b2 B2",
    "4Uw2": "U2 u2 e2 d2",
    "4Lw2": "r2 m2 l2 L2",
    "4Fw2": "F2 f2 s2 b2",
    "4Rw2": "R2 r2 m2 l2",
    "4Dw2": "u2 e2 d2 D2",
    "4Bw2": "f2 s2 b2 B2",
    "3Uw2": "U2 u2 e2",
    "3Lw2": "m2 l2 L2",
    "3Fw2": "F2 f2 s2",
    "3Rw2": "R2 r2 m2",
    "3Dw2": "e2 d2 D2",
    "3Bw2": "s2 b2 B2",
    Uw2: "U2 u2",
    Lw2: "l2 L2",
    Fw2: "F2 f2",
    Rw2: "R2 r2",
    Dw2: "d2 D2",
    Bw2: "b2 B2",
    "x'": "R' r' m l L",
    "y'": "U' u' e d D",
    "z'": "F' f' s' b B",
    "4Uw'": "U' u' e d",
    "4Lw'": "r m' l' L'",
    "4Fw'": "F' f' s' b",
    "4Rw'": "R' r' m l",
    "4Dw'": "u e' d' D'",
    "4Bw'": "f s b' B'",
    "3Uw'": "U' u' e",
    "3Lw'": "m' l' L'",
    "3Fw'": "F' f' s'",
    "3Rw'": "R' r' m",
    "3Dw'": "e' d' D'",
    "3Bw'": "s b' B'",
    "Uw'": "U' u'",
    "Lw'": "l' L'",
    "Fw'": "F' f'",
    "Rw'": "R' r'",
    "Dw'": "d' D'",
    "Bw'": "b' B'",
    x: "R r m' l' L'",
    y: "U u e' d' D'",
    z: "F f s b' B'",
    "4Uw": "U u e' d'",
    "4Lw": "r' m l L",
    "4Fw": "F f s b'",
    "4Rw": "R r m' l'",
    "4Dw": "u' e d D",
    "4Bw": "f' s' b B",
    "3Uw": "U u e'",
    "3Lw": "m l L",
    "3Fw": "F f s",
    "3Rw": "R r m'",
    "3Dw": "e d D",
    "3Bw": "s' b B",
    Uw: "U u",
    Lw: "l L",
    Fw: "F f",
    Rw: "R r",
    Dw: "d D",
    Bw: "b B",
    E2: "u2 e2 d2",
    M2: "r2 m2 l2",
    S2: "f2 s2 b2",
    "E'": "u e' d'",
    "M'": "r m' l'",
    "S'": "f' s' b",
    E: "u' e d",
    M: "r' m l",
    S: "f s b'",
  };

  const finalReplaceInit = {};
  function search(algorithm: string): string[] {
    return commutator.search({
      algorithm,
      initialReplace: initialReplaceInit,
      finalReplace: finalReplaceInit,
      commute: commuteInit,
    });
  }

  function expand(algorithm: string): string {
    return commutator.expand({
      algorithm,
      initialReplace: initialReplaceInit,
      finalReplace: finalReplaceInit,
      commute: commuteInit,
    });
  }

  function finalReplaceAlg(algInput: string): string {
    let alg = algInput;
    alg = commutator_555.expand(alg);
    let newAlg = "";
    while (alg !== newAlg) {
      if (newAlg !== "") {
        alg = newAlg;
      }
      const arr = alg.split(" ");
      let i = 0;
      while (i < arr.length - 1) {
        const expanded = expand(`${arr[i]} ${arr[i + 1]}`);
        if (expanded.indexOf(" ") === -1) {
          arr[i] = expanded;
          arr.splice(i + 1, 1);
          i -= 1;
        } else {
          const keys = Object.keys(initialReplaceInit) as Array<
            keyof typeof initialReplaceInit
          >;
          for (const j of keys) {
            if (expanded === initialReplaceInit[j]) {
              arr[i] = j;
              arr.splice(i + 1, 1);
              i -= 1;
              break;
            }
          }
        }
        i += 1;
      }
      newAlg = arr.join(" ");
      newAlg = commutator_555.expand(newAlg);
    }

    alg = newAlg;
    newAlg = "";
    while (alg !== newAlg) {
      if (newAlg !== "") {
        alg = newAlg;
      }
      const arr = alg.split(" ");
      let i = 0;
      while (i < arr.length - 2) {
        const expanded = expand(`${arr[i]} ${arr[i + 1]} ${arr[i + 2]}`);
        if (expanded.indexOf(" ") === -1) {
          arr[i] = expanded;
          arr.splice(i + 2, 1);
          arr.splice(i + 1, 1);
          i -= 1;
        } else {
          const keys = Object.keys(initialReplaceInit) as Array<
            keyof typeof initialReplaceInit
          >;
          for (const j of keys) {
            if (expanded === initialReplaceInit[j]) {
              arr[i] = j;
              arr.splice(i + 2, 1);
              arr.splice(i + 1, 1);
              i -= 1;
              break;
            }
          }
        }
        i += 1;
      }
      newAlg = arr.join(" ");
      newAlg = commutator_555.expand(newAlg);
    }
    return newAlg;
  }

  function finalReplaceCommutator(alg: string): string {
    if (!alg.includes("[") || !alg.includes("]") || !alg.includes(",")) {
      return alg;
    }
    if (alg.includes(":")) {
      const part0 = finalReplaceAlg(alg.split(":")[0]);
      const inside = alg.split("[")[1];
      const part1 = finalReplaceAlg(inside.split(",")[0]);
      const part2 = finalReplaceAlg(inside.split(",")[1].split("]")[0]);
      return `${part0}:[${part1},${part2}]`;
    }
    const inside = alg.split("[")[1];
    const part1 = finalReplaceAlg(inside.split(",")[0]);
    const part2 = finalReplaceAlg(inside.split(",")[1].split("]")[0]);
    return `[${part1},${part2}]`;
  }

  return {
    search,
    expand,
    finalReplaceAlg,
    finalReplaceCommutator,
  };
})();

export default commutator_555_final;
