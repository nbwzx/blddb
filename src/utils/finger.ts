"use strict";
import rewrite from "./rewrite";
const finger = (function () {
  function finger(alg: string, position: number) {
    // R' F R' S' R F R' S R F2 R
    // if (fingerback(alg, position) > 5) {
    //     return 0;
    // }
    let fingerposition = position;
    const arr = alg.split(" ");
    for (let i = 0; i <= arr.length - 1; i++) {
      if (i > 0 && arr[i][0] === "E") {
        if (arr[i - 1] === "U2") {
          return 0;
        }
        if (arr[i - 1][0] === "U" && arr[i] === "E2") {
          return 0;
        }
      }
      if (i < arr.length - 1 && arr[i][0] === "E") {
        if (arr[i + 1][0] === "D") {
          return 0;
        }
      }
      if (i > 0 && arr[i][0] === "S") {
        if (arr[i - 1] === "F2") {
          return 0;
        }
      }
      if (i < arr.length - 1 && arr[i][0] === "S") {
        if (arr[i + 1][0] === "B") {
          return 0;
        }
      }
      if (i > 0 && arr[i] === "S2") {
        if (arr[i - 1][0] === "F") {
          return 0;
        }
      }
      if (i < arr.length - 1 && arr[i] === "S2") {
        if (arr[i + 1][0] === "B") {
          return 0;
        }
      }
      if (i > 0 && arr[i][0] === "B") {
        if (arr[i - 1][0] === "F") {
          if (arr[i - 1] === "F2" || arr[i] === "B2") {
            return 0;
          }
        }
      }
      if (i > 0 && arr[i][0] === "D") {
        if (arr[i - 1][0] === "u") {
          return 0;
        }
      }
      // U E R S' R' U' R S R' E'
      if (i > 0 && arr[i][0] === "E") {
        if (arr[i - 1][0] === "U") {
          if (fingerposition !== 2) {
            return 0;
          }
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
              return 0;
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
          arr[i] === "M2")
      ) {
        return 0;
      }
      if (
        fingerposition === 2 &&
        (arr[i][0] === "B" ||
          arr[i] === "F2" ||
          arr[i] === "S2" ||
          arr[i] === "E2")
      ) {
        return 0;
      }
      // R U2 R2 F' R S R' F R S' R U2 R'
      if (fingerposition === 1 && arr[i] === "B2") {
        return 0;
      }
      if (
        fingerposition === 0 &&
        (arr[i][0] === "B" ||
          arr[i][0] === "F" ||
          arr[i] === "D2" ||
          arr[i] === "S2" ||
          arr[i] === "M2")
      ) {
        return 0;
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
        return 0;
      }
    }
    if (fingerposition === 4 || fingerposition === 0) {
      return 0;
    }
    return 1;
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

  function fingerbeginfrom(alg: string) {
    if (alg === "") {
      return ["finger.homegrip"];
    }
    const algRighty = rewrite.righty(alg);
    let fingerbegin: string[] = [],
      count = 0;
    for (let i = 0; i <= 10; i++) {
      if (
        finger(algRighty, 2) === 1 &&
        (fingerpain(algRighty, 2) === i || fingerpain(algRighty, 2) === i + 1)
      ) {
        count = count + 1;
        fingerbegin.push("finger.homegrip");
      }
      if (finger(algRighty, 1) === 1 && fingerpain(algRighty, 1) === i) {
        count = count + 1;
        fingerbegin.push("finger.thumbdown");
      }
      if (finger(algRighty, 3) === 1 && fingerpain(algRighty, 3) === i) {
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
    return fingerbegin;
  }

  return {
    fingerbeginfrom,
  };
})();

export default finger;
