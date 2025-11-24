import rewrite from "./rewrite";
import commutator from "./commutator";

const finger = (function () {
  function fingerAvailable(alg: string, position: number) {
    // R' F R' S' R F R' S R F2 R
    // if (fingerback(alg, position) > 5) {
    //     return false;
    // }
    let fingerposition = position;
    const arr = alg.split(" ");
    for (let i = 0; i <= arr.length - 1; i++) {
      if (i > 0 && arr[i][0] === "E") {
        if (arr[i - 1] === "U2") {
          return false;
        }
        if (arr[i - 1][0] === "U" && arr[i] === "E2") {
          return false;
        }
      }
      if (i < arr.length - 1 && arr[i][0] === "E") {
        if (arr[i + 1][0] === "D") {
          return false;
        }
      }
      if (i > 0 && arr[i][0] === "S") {
        if (arr[i - 1] === "F2") {
          return false;
        }
      }
      if (i < arr.length - 1 && arr[i][0] === "S") {
        if (arr[i + 1][0] === "B") {
          return false;
        }
      }
      if (i > 0 && arr[i] === "S2") {
        if (arr[i - 1][0] === "F") {
          return false;
        }
      }
      if (i < arr.length - 1 && arr[i] === "S2") {
        if (arr[i + 1][0] === "B") {
          return false;
        }
      }
      if (i > 0 && arr[i][0] === "B") {
        if (arr[i - 1][0] === "F") {
          if (arr[i - 1] === "F2" || arr[i] === "B2") {
            return false;
          }
        }
      }
      if (i > 0 && arr[i][0] === "D") {
        if (arr[i - 1][0] === "u") {
          return false;
        }
      }
      if (i > 0 && i < arr.length - 1) {
        if (arr[i][0] === "E" || arr[i][0] === "M" || arr[i][0] === "S") {
          if (
            arr[i - 1][0] === "E" ||
            arr[i - 1][0] === "M" ||
            arr[i - 1][0] === "S"
          ) {
            if (
              arr[i + 1][0] === "E" ||
              arr[i + 1][0] === "M" ||
              arr[i + 1][0] === "S"
            ) {
              return false;
            }
          }
        }
      }
      if (
        fingerposition === 4 &&
        (arr[i][0] === "B" ||
          arr[i][0] === "F" ||
          arr[i] === "D2" ||
          arr[i] === "S2" ||
          arr[i] === "E2" ||
          arr[i] === "M2")
      ) {
        return false;
      }
      if (fingerposition === 3 && arr[i] === "f2") {
        return false;
      }
      if (
        fingerposition === 2 &&
        (arr[i][0] === "B" || arr[i] === "F2" || arr[i] === "S2")
      ) {
        return false;
      }
      if (
        fingerposition === 0 &&
        (arr[i][0] === "B" ||
          arr[i][0] === "F" ||
          arr[i] === "D2" ||
          arr[i] === "S2" ||
          arr[i] === "E2")
      ) {
        return false;
      }
      if (arr[i] === "R" || arr[i] === "r") {
        fingerposition = fingerposition + 1;
      }
      if (arr[i] === "R'" || arr[i] === "r'") {
        fingerposition = fingerposition - 1;
      }
      if (arr[i] === "R2" || arr[i] === "r2") {
        if (fingerposition === 2) {
          fingerposition = 0;
          for (let j = i + 1; j <= arr.length - 1; j++) {
            if (
              arr[j] === "R" ||
              arr[j] === "r" ||
              arr[j] === "R2" ||
              arr[j] === "r2"
            ) {
              fingerposition = 0;
              break;
            }
            if (arr[j] === "R'" || arr[j] === "r'") {
              fingerposition = 4;
              break;
            }
          }
        } else {
          fingerposition = (fingerposition + 2) % 4;
        }
      }
      if (fingerposition === 5 || fingerposition === -1) {
        return false;
      }
    }
    if (fingerposition === 4 || fingerposition === 0) {
      return false;
    }
    return true;
  }

  function fingerpain(alg: string, position: number) {
    let pain = 0;
    let fingerposition = position;
    const arr = alg.split(" ");
    pain = pain + Math.min(Math.floor(fingerback(alg, position) / 2), 2);
    for (let i = 0; i <= arr.length - 1; i++) {
      if (
        fingerposition === 4 &&
        (arr[i] === "U2" || arr[i][0] === "M" || arr[i][0] === "E")
      ) {
        pain = pain + 1;
      }
      if (fingerposition === 3 && (arr[i] === "U2" || arr[i][0] === "M")) {
        pain = pain + 1;
      }
      if (fingerposition === 2 && (arr[i][0] === "E" || arr[i][0] === "F")) {
        pain = pain + 1;
      }
      if (fingerposition === 2 && arr[i] === "E2") {
        pain = pain + 1;
      }
      if (fingerposition === 1 && (arr[i] === "U2" || arr[i][0] === "M")) {
        pain = pain + 1;
      }
      if (
        fingerposition === 0 &&
        (arr[i] === "U2" || arr[i][0] === "M" || arr[i][0] === "E")
      ) {
        pain = pain + 1;
      }
      if (fingerposition === 3 && arr[i] === "F2") {
        pain = pain + 1;
      }
      if (arr[i][0] === "S" && fingerposition !== 2) {
        if (
          (i > 0 && arr[i - 1][0] === "U") ||
          (i < arr.length - 1 && arr[i + 1][0] === "U")
        ) {
          pain = pain + 1;
        }
      }
      // U E R S' R' U' R S R' E'
      if (i > 0 && arr[i][0] === "E") {
        if (arr[i - 1][0] === "U") {
          if (fingerposition !== 2) {
            pain = pain + 2;
          }
        }
      }
      if (arr[i] === "R" || arr[i] === "r") {
        fingerposition = fingerposition + 1;
      }
      if (arr[i] === "R'" || arr[i] === "r'") {
        fingerposition = fingerposition - 1;
      }
      if (arr[i] === "R2" || arr[i] === "r2") {
        if (fingerposition === 2) {
          fingerposition = 0;
          for (let j = i + 1; j <= arr.length - 1; j++) {
            if (
              arr[j] === "R" ||
              arr[j] === "r" ||
              arr[j] === "R2" ||
              arr[j] === "r2"
            ) {
              fingerposition = 0;
              break;
            }
            if (arr[j] === "R'" || arr[j] === "r'") {
              fingerposition = 4;
              break;
            }
          }
        } else {
          fingerposition = (fingerposition + 2) % 4;
        }
      }
    }
    return pain;
  }

  function fingerback(alg: string, position: number) {
    let fingerposition = position;
    const arr = alg.split(" ");
    let sum = 0;
    for (let i = 0; i <= arr.length - 1; i++) {
      if (arr[i] === "R" || arr[i] === "r") {
        fingerposition = fingerposition + 1;
      }
      if (arr[i] === "R'" || arr[i] === "r'") {
        fingerposition = fingerposition - 1;
      }
      if (arr[i] === "R2" || arr[i] === "r2") {
        if (fingerposition === 2) {
          fingerposition = 0;
          for (let j = i + 1; j <= arr.length - 1; j++) {
            if (
              arr[j] === "R" ||
              arr[j] === "r" ||
              arr[j] === "R2" ||
              arr[j] === "r2"
            ) {
              fingerposition = 0;
              break;
            }
            if (arr[j] === "R'" || arr[j] === "r'") {
              fingerposition = 4;
              break;
            }
          }
        } else {
          fingerposition = (fingerposition + 2) % 4;
        }
      }
      if (fingerposition === 0 || fingerposition === 4) {
        // U R' U' S R2 S' R2 U R U'
        let isBad = true;
        if (i > 0) {
          if (
            ((arr[i - 1] === "S" || arr[i - 1] === "S'") &&
              (arr[i] === "R2" || arr[i] === "r2")) ||
            ((arr[i] === "S" || arr[i] === "S'") &&
              (arr[i - 1] === "R2" || arr[i - 1] === "r2"))
          ) {
            isBad = false;
          }
        }
        if (i < arr.length - 1) {
          if (
            ((arr[i + 1] === "S" || arr[i + 1] === "S'") &&
              (arr[i] === "R2" || arr[i] === "r2")) ||
            ((arr[i] === "S" || arr[i] === "S'") &&
              (arr[i + 1] === "R2" || arr[i + 1] === "r2"))
          ) {
            isBad = false;
          }
        }
        if (isBad) {
          sum = sum + 1;
        }
      }
    }
    return sum;
  }

  function fingerbeginfrom(alg: string, depth: number = 0) {
    if (alg === "") {
      return ["finger.homegrip"];
    }
    if (alg === "L2 U S U2 S' U L2" || alg === "L2 U' S U2 S' U' L2") {
      return ["finger.lefthomegrip"];
    }
    if (alg === "R2 U S' U2 S U R2" || alg === "R2 U' S' U2 S U' R2") {
      return ["finger.homegrip"];
    }
    if (depth === 0) {
      let fingerbeginNew: string[] = [];
      const patterns = [
        { prefix: "L", suffix: "L'", expected: "leftthumbdown" },
        { prefix: "l", suffix: "l'", expected: "leftthumbdown" },
        { prefix: "L'", suffix: "L", expected: "leftthumbup" },
        { prefix: "l'", suffix: "l", expected: "leftthumbup" },
        { prefix: "L U", suffix: "U' L'", expected: "leftthumbdown" },
        { prefix: "l U", suffix: "U' l'", expected: "leftthumbdown" },
        { prefix: "L' U", suffix: "U' L", expected: "leftthumbup" },
        { prefix: "l' U", suffix: "U' l", expected: "leftthumbup" },
        { prefix: "L U'", suffix: "U L'", expected: "leftthumbdown" },
        { prefix: "l U'", suffix: "U l'", expected: "leftthumbdown" },
        { prefix: "L' U'", suffix: "U L", expected: "leftthumbup" },
        { prefix: "l' U'", suffix: "U l", expected: "leftthumbup" },
        { prefix: "L U2", suffix: "U2 L'", expected: "leftthumbdown" },
        { prefix: "l U2", suffix: "U2 l'", expected: "leftthumbdown" },
        { prefix: "L' U2", suffix: "U2 L", expected: "leftthumbup" },
        { prefix: "l' U2", suffix: "U2 l", expected: "leftthumbup" },
      ];
      for (const { prefix, suffix, expected } of patterns) {
        const algNew = commutator.expand({
          algorithm: `${prefix} ${alg} ${suffix}`,
        });
        if (!algNew.includes("L") && !algNew.includes("l")) {
          fingerbeginNew = fingerbeginfrom(algNew, 1);
          if (
            fingerbeginNew.includes("finger.homegrip") ||
            fingerbeginNew.includes("finger.lefthomegrip")
          ) {
            return [`finger.${expected}`];
          }
        }
      }
    }
    const isLefty =
      !alg.includes("R") &&
      !alg.includes("r") &&
      (alg.includes("L") || alg.includes("l"));
    const algRighty = isLefty
      ? rewrite.mirrorAxis(alg, "M")
      : rewrite.righty(alg);
    let fingerbegin: string[] = [],
      count = 0;
    for (let i = -1; i <= 10; i++) {
      if (
        fingerAvailable(algRighty, 2) &&
        (fingerpain(algRighty, 2) === i || fingerpain(algRighty, 2) === i + 1)
      ) {
        count = count + 1;
        fingerbegin.push("finger.homegrip");
      }
      if (fingerAvailable(algRighty, 1) && fingerpain(algRighty, 1) === i) {
        count = count + 1;
        fingerbegin.push("finger.thumbdown");
      }
      if (fingerAvailable(algRighty, 3) && fingerpain(algRighty, 3) === i) {
        count = count + 1;
        fingerbegin.push("finger.thumbup");
      }
      if (fingerbegin.length > 0) {
        break;
      }
    }
    if (count === 3) {
      fingerbegin = ["finger.homegrip"];
    }
    if (isLefty) {
      fingerbegin = fingerbegin.map((x) => {
        return x.replace("finger.", "finger.left");
      });
    }
    if (count === 0) {
      fingerbegin = ["/"];
    }
    return fingerbegin;
  }

  return {
    fingerbeginfrom,
  };
})();

export default finger;
