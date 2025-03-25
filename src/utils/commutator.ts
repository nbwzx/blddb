// Revised from the following repository:
/*!
 * Commutator (https://github.com/nbwzx/commutator)
 * Copyright (c) 2022-2025 Zixing Wang <zixingwang.cn@gmail.com>
 * Licensed under MIT (https://github.com/nbwzx/commutator/blob/main/LICENSE)
 */

const commutator = (function () {
  const MAX_INT = 4294967295;
  const orderInit = 4,
    outerBracketInit = false,
    abMaxScoreInit = 2.5,
    abMinScoreInit = 5,
    addScoreInit = 1,
    maxDepthInit = 0,
    limitInit = 0,
    fastInit = false,
    slashNotationInit = false,
    noBracketsInit = false,
    spaceAfterColonInit = false,
    spaceAfterCommaInit = false,
    outerBracketsInit = false;
  const commuteInit: { [id: string]: { class: number; priority: number } } = {
    U: { class: 1, priority: 1 },
    u: { class: 1, priority: 2 },
    E: { class: 1, priority: 3 },
    D: { class: 1, priority: 4 },
    d: { class: 1, priority: 5 },
    R: { class: 2, priority: 1 },
    r: { class: 2, priority: 2 },
    M: { class: 2, priority: 3 },
    L: { class: 2, priority: 4 },
    l: { class: 2, priority: 5 },
    F: { class: 3, priority: 1 },
    f: { class: 3, priority: 2 },
    S: { class: 3, priority: 3 },
    B: { class: 3, priority: 4 },
    b: { class: 3, priority: 5 },
  };
  const initialReplaceInit: { [id: string]: string } = {
    Rw2: "r2",
    "Rw'": "r'",
    Rw: "r",
    Lw2: "l2",
    "Lw'": "l'",
    Lw: "l",
    Fw2: "f2",
    "Fw'": "f'",
    Fw: "f",
    Bw2: "b2",
    "Bw'": "b'",
    Bw: "b",
    Uw2: "u2",
    "Uw'": "u'",
    Uw: "u",
    Dw2: "d2",
    "Dw'": "d'",
    Dw: "d",
    r2: "R2 M2",
    "r'": "R' M",
    r: "R M'",
    l2: "M2 L2",
    "l'": "M' L'",
    l: "M L",
    f2: "F2 S2",
    "f'": "F' S'",
    f: "F S",
    b2: "S2 B2",
    "b'": "S B'",
    b: "S' B",
    u2: "U2 E2",
    "u'": "U' E",
    u: "U E'",
    d2: "E2 D2",
    "d'": "E' D'",
    d: "E D",
  };
  const finalReplaceInit: { [id: string]: string } = {
    "R2 M2": "r2",
    "R' M": "r'",
    "R M'": "r",
    "M2 L2": "l2",
    "M' L'": "l'",
    "M L": "l",
    "F2 S2": "f2",
    "F' S'": "f'",
    "F S": "f",
    "S2 B2": "b2",
    "S B'": "b'",
    "S' B": "b",
    "U2 E2": "u2",
    "U' E": "u'",
    "U E'": "u",
    "E2 D2": "d2",
    "E' D'": "d'",
    "E D": "d",
    "M2 R2": "r2",
    "M R'": "r'",
    "M' R": "r",
    "L2 M2": "l2",
    "L' M'": "l'",
    "L M": "l",
    "S2 F2": "f2",
    "S' F'": "f'",
    "S F": "f",
    "B2 S2": "b2",
    "B' S": "b'",
    "B S'": "b",
    "E2 U2": "u2",
    "E U'": "u'",
    "E' U": "u",
    "D2 E2": "d2",
    "D' E'": "d'",
    "D E": "d",
    "R M2": "r M'",
    "R' M2": "r' M",
    "M2 R": "r M'",
    "M2 R'": "r' M",
    "U2 E": "U' u'",
    "U2 E'": "U u",
    "E U2": "U' u'",
    "E' U2": "U u",
    "U E2": "U' u2",
    "U' E2": "U u2",
    "E2 U": "U' u2",
    "E2 U'": "U u2",
  };
  type Move = { base: string; amount: number };
  let result: string[] = [],
    order = orderInit,
    minAmount = Math.floor(orderInit / 2) + 1 - orderInit,
    maxAmount = Math.floor(orderInit / 2),
    maxAlgAmount = 0,
    isOrderZero = false,
    outerBracket = outerBracketInit,
    abMaxScore = abMaxScoreInit,
    abMinScore = abMinScoreInit,
    addScore = addScoreInit,
    fast = fastInit,
    slashNotation = slashNotationInit,
    noBrackets = noBracketsInit,
    spaceAfterColon = spaceAfterColonInit,
    spaceAfterComma = spaceAfterCommaInit,
    outerBrackets = outerBracketsInit;
  let commute = commuteInit,
    initialReplace = initialReplaceInit,
    finalReplace = finalReplaceInit;

  function clean(input: string): string {
    // Implements the internationalized string preparation algorithm from RFC 4518
    let string = input;

    string = string.replace(
      /[\u00ad\u1806\u034f\u180b-\u180d\ufe0f-\uff00\ufffc]+/gu,
      "",
    );
    string = string.replace(/[\u0009\u000a\u000b\u000c\u000d\u0085]/gu, " ");
    string = string.replace(
      /[\u0000-\u0008\u000e-\u001f\u007f-\u0084\u0086-\u009f\u06dd\u070f\u180e\u200c-\u200f\u202a-\u202e\u2060-\u2063\u206a-\u206f\ufeff\ufff9-\ufffb]+/gu,
      "",
    );
    string = string.replace(/\u200b/gu, "");
    string = string.replace(
      /[\u00a0\u1680\u2000-\u200a\u2028-\u2029\u202f\u205f\u3000]/gu,
      " ",
    );
    string = string.replace(
      /[\u061c\u115f\u1160\u17b4\u17b5\u2064\u2800\u3164\uffa0]/gu,
      " ",
    );

    // Specifically for this project
    string = string.replace(/[!！]/gu, " ");
    string = string.replace(/\s+/gu, " ");
    string = string.trim();

    const non_standard_characters: { [key: string]: string } = {
      "'": "｀΄＇ˈˊᑊˋꞌᛌ‘’՚‛՝`′׳´ʹ˴ߴ‵ߵʻʼ᾽ʽ῾ʾ᾿ʿ",
      ",": "¸ꓹ‚؍٫，",
      "/": "⁄Ⳇ⟋ノ╱〳∕⧸",
      ":": "︰∶:᛬⁚܃：ꓽ׃։ː꞉܄˸;",
      "(": "（{",
      ")": "）}",
      "[": "【",
      "]": "】",
      "+": "𐊛+᛭",
      "*": "×",
    };

    for (const standard_char in non_standard_characters) {
      const chars = non_standard_characters[standard_char];
      for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        string = string.replace(char, standard_char);
      }
    }

    return string;
  }

  function expand(input: {
    algorithm: string;
    order?: number;
    initialReplace?: { [id: string]: string };
    finalReplace?: { [id: string]: string };
    commute?: { [id: string]: { class: number; priority: number } };
  }): string {
    order = input.order ?? orderInit;
    initialReplace = input.initialReplace ?? initialReplaceInit;
    finalReplace = input.finalReplace ?? finalReplaceInit;
    commute = input.commute ?? commuteInit;
    let algorithm = clean(input.algorithm);
    algorithm = algorithm
      .replace(/\*\s/gu, "*")
      .replace(/\s\*/gu, "*")
      .replace(/:\s/gu, ":")
      .replace(/\s:/gu, ":")
      .replace(/\[\s/gu, "[")
      .replace(/\s\[/gu, "[")
      .replace(/\]\s/gu, "]")
      .replace(/\s\]/gu, "]")
      .replace(/,\s/gu, ",")
      .replace(/\s,/gu, ",")
      .replace(/\+\s/gu, "+")
      .replace(/\s\+/gu, "+")
      .replace(/\*2/gu, "2");
    for (let i = algorithm.length - 1; i > 1; i--) {
      if (algorithm[i] === "2" && algorithm[i - 1] === ")") {
        let j = i - 1;
        while (algorithm[j] !== "(" && j >= 0) {
          j--;
        }
        if (j >= 0) {
          algorithm =
            algorithm.slice(0, j) +
            algorithm.slice(j + 1, i - 1) +
            algorithm.slice(j + 1, i - 1) +
            algorithm.slice(i + 1);
          break;
        }
      }
    }
    for (let i = algorithm.length - 1; i > 1; i--) {
      if (algorithm[i] === "2" && algorithm[i - 1] === "]") {
        let j = i - 1;
        while (algorithm[j] !== "[" && j >= 0) {
          j--;
        }
        if (j >= 0) {
          algorithm =
            algorithm.slice(0, j) +
            algorithm.slice(j + 1, i - 1) +
            algorithm.slice(j + 1, i - 1) +
            algorithm.slice(i + 1);
          break;
        }
      }
    }
    algorithm = algorithm.replace(/\(/gu, "");
    algorithm = algorithm.replace(/\)/gu, "");
    algorithm = `[${algorithm.replace(/\+/gu, "]+[")}]`;
    algorithm = algorithm.replace(/\]\[/gu, "]+[");
    if (order === 0) {
      isOrderZero = true;
      order = MAX_INT;
    } else {
      isOrderZero = false;
    }
    // Examples:
    // • order 4 → min -1 (e.g. cube)
    // • order 5 → min -2 (e.g. Megaminx)
    // • order 3 → min -1 (e.g. Pyraminx)
    minAmount = Math.floor(order / 2) + 1 - order;
    maxAmount = Math.floor(order / 2);
    const rpnStack = rpn(initStack(algorithm));
    if (
      rpnStack[0] === "Lack left parenthesis." ||
      rpnStack[0] === "Lack right parenthesis."
    ) {
      return rpnStack[0];
    }
    const calcTemp = calc(rpnStack);
    if (calcTemp === "") {
      return "";
    }
    const expandOutput = arrayToStr(algToArray(calcTemp));
    if (expandOutput === "") {
      return "";
    }
    return expandOutput;
  }

  function isOperator(sign: string): boolean {
    const operatorString = "+:,/[]";
    return operatorString.indexOf(sign) > -1;
  }

  function initStack(algorithm: string): string[] {
    const stack: string[] = [algorithm[0]];
    for (let i = 1; i < algorithm.length; i++) {
      if (isOperator(algorithm[i]) || isOperator(stack.slice(-1)[0])) {
        stack.push(algorithm[i]);
      } else {
        stack.push(stack.pop() + algorithm[i]);
      }
    }
    return stack;
  }

  function operatorLevel(operator: string): number {
    if (operator === ":") {
      return 0;
    }
    if (operator === ",") {
      return 1;
    }
    if (operator === "/") {
      return 2;
    }
    if (operator === "+") {
      return 3;
    }
    if (operator === "[") {
      return 4;
    }
    if (operator === "]") {
      return 5;
    }
    return -1;
  }

  function rpn(stackInput: string[]): string[] {
    // Reverse Polish Notation
    const stackOutput: string[] = [],
      operatorStack: string[] = [];
    let isMatch = false,
      operatorStackPop = "";
    while (stackInput.length > 0) {
      const sign = stackInput.shift() as string;
      if (!isOperator(sign)) {
        stackOutput.push(sign);
      } else if (sign === "]") {
        isMatch = false;
        while (operatorStack.length > 0) {
          operatorStackPop = operatorStack.pop() as string;
          if (operatorStackPop === "[") {
            isMatch = true;
            break;
          } else {
            stackOutput.push(operatorStackPop);
          }
        }
        if (!isMatch) {
          return ["Lack left parenthesis."];
        }
      } else {
        while (
          operatorStack.length > 0 &&
          operatorStack.slice(-1)[0] !== "[" &&
          operatorLevel(sign) <= operatorLevel(operatorStack.slice(-1)[0])
        ) {
          stackOutput.push(operatorStack.pop() as string);
        }
        operatorStack.push(sign);
      }
    }
    while (operatorStack.length > 0) {
      operatorStackPop = operatorStack.pop() as string;
      if (operatorStackPop === "[") {
        return ["Lack right parenthesis."];
      }
      stackOutput.push(operatorStackPop);
    }
    return stackOutput;
  }

  function calc(stack: string[]): string {
    const calcOutput: string[] = [];
    while (stack.length > 0) {
      const sign = stack.shift() as string;
      if (isOperator(sign)) {
        if (calcOutput.length >= 2) {
          const calcPop2 = calcOutput.pop() as string;
          const calcPop1 = calcOutput.pop() as string;
          calcOutput.push(calcTwo(calcPop1, calcPop2, sign));
        } else {
          return "";
        }
      } else {
        calcOutput.push(sign);
      }
    }
    return calcOutput[0] ?? "";
  }

  function calcTwo(
    algorithm1: string,
    algorithm2: string,
    sign: string,
  ): string {
    let array1: Move[] = [],
      array2: Move[] = [];
    array1 = algToArray(algorithm1);
    array2 = algToArray(algorithm2);
    switch (sign) {
      case "+":
        return arrayToStr(array1.concat(array2));
      case ":":
        return arrayToStr(array1.concat(array2, invert(array1)));
      case ",":
        return arrayToStr(
          array1.concat(array2, invert(array1), invert(array2)),
        );
      case "/":
        return arrayToStr(
          array1.concat(
            array2,
            invert(array1),
            invert(array1),
            invert(array2),
            array1,
          ),
        );
      default:
        return arrayToStr(array1.concat(array2));
    }
  }

  function score(algorithm: string): number {
    let alg = algorithm;
    alg = `[${alg.replace(/\+/gu, "]+[")}]`;
    alg = alg.replace(/\]\[/gu, "]+[");
    const rpnStack = rpn(initStack(alg)),
      scoreOutput: string[] = [];
    while (rpnStack.length > 0) {
      const sign = rpnStack.shift() as string;
      if (isOperator(sign)) {
        const scorePop2 = scoreOutput.pop() as string;
        const scorePop1 = scoreOutput.pop() as string;
        let score1 = Number(scorePop1),
          score2 = Number(scorePop2);
        if (isNaN(score1)) {
          score1 = scorePop1.split(" ").length;
        }
        if (isNaN(score2)) {
          score2 = scorePop2.split(" ").length;
        }
        scoreOutput.push(scoreTwo(score1, score2, sign).toString());
      } else {
        scoreOutput.push(sign);
      }
    }
    return Number(scoreOutput[0]);
  }

  function scoreTwo(score1: number, score2: number, sign: string): number {
    switch (sign) {
      case "+":
        return score1 + score2 + addScore;
      case ":":
        return score1 + score2;
      case ",":
        return (
          abMaxScore * Math.max(score1, score2) +
          abMinScore * Math.min(score1, score2)
        );
      default:
        return Infinity;
    }
  }

  function sortRule(algorithm1: string, algorithm2: string): number {
    return score(algorithm1) - score(algorithm2);
  }

  function search(input: {
    algorithm: string;
    order?: number;
    initialReplace?: { [id: string]: string };
    finalReplace?: { [id: string]: string };
    commute?: { [id: string]: { class: number; priority: number } };
    outerBracket?: boolean;
    abMaxScore?: number;
    abMinScore?: number;
    addScore?: number;
    maxDepth?: number;
    limit?: number;
    fast?: boolean;
    slashNotation?: boolean;
    noBrackets?: boolean;
    spaceAfterColon?: boolean;
    spaceAfterComma?: boolean;
    outerBrackets?: boolean;
  }): string[] {
    const algorithm = input.algorithm;
    order = input.order ?? orderInit;
    outerBracket = input.outerBracket ?? outerBracketInit;
    abMaxScore = input.abMaxScore ?? abMaxScoreInit;
    abMinScore = input.abMinScore ?? abMinScoreInit;
    addScore = input.addScore ?? addScoreInit;
    initialReplace = input.initialReplace ?? initialReplaceInit;
    finalReplace = input.finalReplace ?? finalReplaceInit;
    commute = input.commute ?? commuteInit;
    fast = input.fast ?? fastInit;
    slashNotation = input.slashNotation ?? slashNotationInit;
    noBrackets = input.noBrackets ?? noBracketsInit;
    spaceAfterColon = input.spaceAfterColon ?? spaceAfterColonInit;
    spaceAfterComma = input.spaceAfterComma ?? spaceAfterCommaInit;
    outerBrackets = input.outerBrackets ?? outerBracketsInit;
    const maxDepth = input.maxDepth ?? maxDepthInit,
      limit = input.limit ?? limitInit;
    result = [];
    if (algorithm === "") {
      return [""];
    }
    const expandAlg = expand({
      algorithm,
      order,
      initialReplace,
      finalReplace,
      commute,
    });
    if (
      expandAlg === "Lack left parenthesis." ||
      expandAlg === "Lack right parenthesis." ||
      expandAlg === ""
    ) {
      return [expandAlg];
    }
    const arr = algToArray(expandAlg);
    if (order === 0 || isOrderZero) {
      isOrderZero = true;
      order = 2 * (maxAlgAmount + 2);
    } else {
      isOrderZero = false;
    }
    // Examples:
    // • order 4 → min -1 (e.g. cube)
    // • order 5 → min -2 (e.g. Megaminx)
    // • order 3 → min -1 (e.g. Pyraminx)
    minAmount = Math.floor(order / 2) + 1 - order;
    maxAmount = Math.floor(order / 2);
    const arrLen = arr.length;
    for (let i = 0; i < arrLen; i++) {
      let amountCount = 0;
      for (let j = 0; j < arrLen; j++) {
        if (arr[i].base === arr[j].base) {
          amountCount = amountCount + arr[j].amount;
        }
      }
      if (amountCount % order !== 0) {
        return ["Not found."];
      }
    }
    let commuteCount = 0;
    const commuteIndex: number[] = [];
    for (let i = 0; i < arrLen - 1; i++) {
      if (isSameClass(arr[i], arr[i + 1])) {
        commuteIndex[commuteCount] = i;
        commuteCount += 1;
      }
    }
    const commuteTotal = 2 ** commuteCount;
    let commutatorOutput = ["Not found."],
      isFind = false;
    let searchDepth = 0;
    if (maxDepth === 0) {
      searchDepth = Math.floor((arrLen - 1) / 3);
    } else {
      searchDepth = maxDepth;
    }
    for (let depth = 1; depth <= searchDepth; depth++) {
      for (let i = 0; i < commuteTotal; i++) {
        let commuteArr = arr.concat();
        for (let j = 0; j < commuteCount; j++) {
          if ((i & (1 << j)) !== 0) {
            commuteArr = swapArray(
              commuteArr,
              commuteIndex[j],
              commuteIndex[j] + 1,
            );
          }
        }
        commutatorOutput = commutatorMain(commuteArr, depth, depth);
        if (commutatorOutput[0] !== "Not found.") {
          isFind = true;
        }
        if (fast && isFind) {
          return result;
        }
      }
      if (isFind && (depth === maxDepth || maxDepth === 0)) {
        result.sort(sortRule);
        result = result.map((alg) =>
          commutatorPost(
            alg,
            slashNotation,
            noBrackets,
            spaceAfterColon,
            spaceAfterComma,
            outerBrackets,
          ),
        );
        if (limit === 0) {
          return result;
        }
        return result.slice(0, limit);
      }
    }
    return ["Not found."];
  }

  function commutatorPost(
    algorithm: string,
    slashNotation1: boolean,
    noBrackets1: boolean,
    spaceAfterColon1: boolean,
    spaceAfterComma1: boolean,
    outerBrackets1: boolean,
  ): string {
    let alg = algorithm;
    if (alg.includes(".")) {
      return alg;
    }
    if (slashNotation1) {
      alg = applySlash(alg);
    }
    if (noBrackets1) {
      alg = alg.replace("[", "").replace("]", "");
    }
    if (spaceAfterColon1) {
      alg = alg.replace(":", ": ");
    }
    if (spaceAfterComma1) {
      alg = alg.replace(",", ", ");
    }
    if (outerBrackets1) {
      if (alg[0] !== "[") {
        alg = `[${alg}]`;
      }
    }
    return alg;
  }

  function applySlash(algorithm: string): string {
    if (!algorithm.includes("[")) {
      return algorithm;
    }
    let part0Output = "";
    if (algorithm.includes(":")) {
      part0Output = algorithm.split(":")[0];
    }
    const part1Output = algorithm.split("[")[1].split(",")[0];
    const part2Output = algorithm.split(",")[1].split("]")[0];
    const part0 = simplify(algToArray(part0Output));
    const part2 = simplify(algToArray(part2Output));
    if (part1Output === "" || part2Output === "") {
      return "";
    }
    if (part0Output === "") {
      return `[${part1Output},${part2Output}]`;
    }
    if (part2.length === 1) {
      for (const i of [-2, 2]) {
        if ((part2[0].amount + i) % order === 0) {
          const halfPart2: Move[] = [
            {
              base: part2[0].base,
              amount: -i / 2,
            },
          ];
          const part0New = simplify(part0.concat(halfPart2));
          const part0NewOutput = arrayToStr(part0New);
          const part1NewOutput = arrayToStr(invert(halfPart2));
          if (part0New.length < part0.length) {
            if (part0NewOutput === "") {
              return `[${part1NewOutput}/${part1Output}]`;
            }
            return `${part0NewOutput}:[${part1NewOutput}/${part1Output}]`;
          }
        }
      }
    }
    return algorithm;
  }

  function algToArray(algorithm: string): Move[] {
    let algTemp = clean(algorithm);
    for (const s in initialReplace) {
      const re = new RegExp(s, "gu");
      algTemp = algTemp.replace(re, initialReplace[s]);
    }
    algTemp = algTemp.replace(/\s+/giu, "");
    if (algTemp === "") {
      return [];
    }
    let alg = "";
    for (let i = 0; i < algTemp.length; i++) {
      if (
        (algTemp[i + 1] < "0" || algTemp[i + 1] > "9") &&
        algTemp[i + 1] !== "'"
      ) {
        alg = `${alg + algTemp[i]} `;
      } else {
        alg = alg + algTemp[i];
      }
    }
    const algSplit = alg.split(" ");
    const arr: Move[] = [];
    for (let i = 0; i < algSplit.length; i++) {
      arr[i] = { base: algSplit[i][0], amount: 0 };
      const algNumber = algSplit[i].replace(/[^0-9]/gu, "");
      if (algNumber === "") {
        arr[i].amount = 1;
      } else {
        arr[i].amount = Number(algNumber);
      }
      if (arr[i].amount > maxAlgAmount) {
        maxAlgAmount = arr[i].amount;
      }
      if (algSplit[i].indexOf("'") > -1) {
        arr[i].amount = -arr[i].amount;
      }
    }
    return arr;
  }

  function commutatorPre(
    array: Move[],
    depth: number,
    maxSubDepth: number,
  ): string[] {
    let commuteCount = 0;
    const commuteIndex: number[] = [];
    for (let i = 0; i < array.length - 1; i++) {
      if (isSameClass(array[i], array[i + 1])) {
        commuteIndex[commuteCount] = i;
        commuteCount += 1;
      }
    }
    const commuteTotal = 2 ** commuteCount;
    let commutatorResult = ["Not found."];
    for (let i = 0; i < commuteTotal; i++) {
      let commuteArr = array.concat();
      for (let j = 0; j < commuteCount; j++) {
        if ((i & (1 << j)) !== 0) {
          commuteArr = swapArray(
            commuteArr,
            commuteIndex[j],
            commuteIndex[j] + 1,
          );
        }
      }
      commutatorResult = commutatorMain(commuteArr, depth, maxSubDepth);
      if (commutatorResult[0] !== "Not found.") {
        return commutatorResult;
      }
    }
    return ["Not found."];
  }

  function commutatorMain(
    array: Move[],
    depth: number,
    maxSubDepth: number,
  ): string[] {
    let arr = simplify(array),
      commutatorOutput = "";
    const arrBak = arr.concat(),
      arrLen = arr.length;
    if (arr.length < 3 * depth + 1) {
      return ["Not found."];
    }
    for (let d = 0; d <= (arrLen + arr.length + 1) / 2 - 1; d++) {
      for (let drKey = 1; drKey < order; drKey++) {
        // 1, -1, 2, -2...
        const dr = ((drKey % 2) * 2 - 1) * Math.floor((drKey + 1) / 2);
        if (d === 0) {
          if (drKey > 1) {
            break;
          }
        } else {
          if (Math.abs(dr) > Math.abs(arrBak[d - 1].amount)) {
            break;
          }
          if (
            order % 2 === 1 ||
            arrBak[d - 1].amount !== Math.floor(order / 2)
          ) {
            if (
              (arrBak[d - 1].amount < 0 && dr > 0) ||
              (arrBak[d - 1].amount > 0 && dr < 0)
            ) {
              continue;
            }
          }
        }
        arr = displace(arrBak, d, dr);
        // For a b c b' a' d c' d' = a b:[c,b' a' d]
        for (let i = 1; i <= arr.length / 2 - 1; i++) {
          let minj = 0;
          if (depth === 1) {
            minj = Math.max(1, Math.floor((arr.length + 1) / 2 - i));
          } else {
            minj = 1;
          }
          for (let j = minj; j <= arr.length / 2 - 1; j++) {
            let part1x: Move[] = [],
              part2x: Move[] = [];
            const commuteAdd1: [Move[]] = [[]],
              commuteAdd2: [Move[]] = [[]];
            if (arr[i - 1].base === arr[i + j - 1].base) {
              // For [a bx,by c bz]
              for (let ir = minAmount; ir <= maxAmount; ir++) {
                if (ir === 0) {
                  continue;
                }
                const jr = normalize(arr[i + j - 1].amount + ir);
                part1x = simplify(repeatEnd(arr.slice(0, i), ir));
                commuteAdd1.push(part1x);
                part2x = simplify(
                  invert(part1x).concat(repeatEnd(arr.slice(0, i + j), jr)),
                );
                commuteAdd2.push(part2x);
              }
            } else {
              if (depth === 1 && arr[i].base !== arr[arr.length - 1].base) {
                continue;
              }
              part1x = simplify(arr.slice(0, i));
              commuteAdd1.push(part1x);
              part2x = simplify(arr.slice(i, i + j));
              commuteAdd2.push(part2x);
              let commuteCase: Move[] = [];
              if (isSameClass(arr[i - 1], arr[i + j - 1])) {
                // For L a R b L' a' R' b' = [L a R,b L' R]
                commuteAdd1.push(part1x);
                commuteCase = simplify(part2x.concat([arr[i - 1]]));
                commuteAdd2.push(commuteCase);
                // For L a R L b R L2' a' R2' b' = [L a R L,b R2 L']
                if (i >= 2) {
                  if (isSameClass(arr[i - 1], arr[i - 2])) {
                    commuteAdd1.push(part1x);
                    commuteCase = simplify(part2x.concat(arr.slice(i - 2, i)));
                    commuteAdd2.push(commuteCase);
                  }
                }
              }
              if (isSameClass(arr[i], arr[i + j])) {
                // For a R b L a' R' b' L' = [a R b R,R' L a'] = [a R L',L b R]
                commuteCase = simplify(part1x.concat(invert([arr[i + j]])));
                commuteAdd1.push(commuteCase);
                commuteCase = simplify([arr[i + j]].concat(part2x));
                commuteAdd2.push(commuteCase);
                // For a R2 b R' L2 a' R' L' b' L' = [a R2 b L R,R2' L a'] = [a R2 L',L b R L]
                if (arr.length >= i + j + 2) {
                  if (isSameClass(arr[i + j], arr[i + j + 1])) {
                    commuteCase = simplify(
                      part1x.concat(invert(arr.slice(i + j, i + j + 2))),
                    );
                    commuteAdd1.push(commuteCase);
                    commuteCase = simplify(
                      arr.slice(i + j, i + j + 2).concat(part2x),
                    );
                    commuteAdd2.push(commuteCase);
                  }
                }
              }
            }
            for (
              let commuteAddKey = 1;
              commuteAddKey < commuteAdd1.length;
              commuteAddKey++
            ) {
              part1x = commuteAdd1[commuteAddKey];
              part2x = commuteAdd2[commuteAddKey];
              const subArr = simplify(
                part2x.concat(part1x, invert(part2x), invert(part1x), arr),
              );
              let subPart = "";
              if (depth > 1) {
                subPart = commutatorPre(subArr, depth - 1, maxSubDepth)[0];
              } else if (subArr.length > 0) {
                continue;
              }

              if (subPart !== "Not found.") {
                let part1y = part1x,
                  part2y = part2x;
                const party = simplify(part2x.concat(part1x));
                if (party.length < Math.max(part1x.length, part2x.length)) {
                  if (part1x.length <= part2x.length) {
                    // For a b c d e b' a' c' e' d' = [a b c,d e b' a'] = [a b c,d e c]
                    part1y = part1x;
                    part2y = party;
                  } else {
                    // For a b c d e b' a' d' c' e' = [a b c,d e b' a'] = [a b c d,e b' a']
                    part1y = invert(part2x);
                    part2y = party;
                  }
                }
                // For a b c b' a' d c' d' = a b:[c,b' a' d] = d:[d' a b,c]
                let part0 = simplify(repeatEnd(arrBak.slice(0, d), dr)),
                  part1 = part1y,
                  part2 = part2y;
                if (part0.length > 0 && maxSubDepth === 1) {
                  const partz = simplify(part0.concat(part2y));
                  // Avoid a b c b' a' d c' d' = d:[d' a b,c], use a b:[c,b' a' d] instead.
                  if (partz.length < part0.length - 1) {
                    part0 = partz;
                    part1 = invert(part2y);
                    part2 = part1y;
                  }
                }
                const part1Output = arrayToStr(part1),
                  part2Output = arrayToStr(part2),
                  part0Output = arrayToStr(part0);
                if (part1Output === "" || part2Output === "") {
                  continue;
                }
                const commutatorStr = pairToStr(
                  part0Output,
                  part1Output,
                  part2Output,
                  subPart,
                );
                if (commutatorOutput === "") {
                  commutatorOutput = commutatorStr;
                }
                if (score(commutatorStr) < score(commutatorOutput)) {
                  commutatorOutput = commutatorStr;
                }
                if (
                  depth === maxSubDepth &&
                  result.indexOf(commutatorStr) === -1
                ) {
                  result.push(commutatorStr);
                }
                if (fast) {
                  return [commutatorOutput];
                }
              }
            }
          }
        }
      }
    }
    if (commutatorOutput === "") {
      return ["Not found."];
    }
    return [commutatorOutput];
  }

  function repeatEnd(array: Move[], attempt: number): Move[] {
    const arr = array.concat();
    if (arr.length === 0) {
      return [];
    }
    const arrPop = arr.pop() as Move;
    if (attempt === 0) {
      return arr;
    }
    arr.push({ base: arrPop.base, amount: attempt });
    return arr;
  }

  function pairToStr(
    part0: string,
    part1: string,
    part2: string,
    subPart: string,
  ): string {
    if (subPart === "") {
      if (!outerBracket) {
        if (part0 === "") {
          return `[${part1},${part2}]`;
        }
        return `${part0}:[${part1},${part2}]`;
      } else if (part0 === "") {
        return `[${part1},${part2}]`;
      }
      return `[${part0}:[${part1},${part2}]]`;
    }
    if (!outerBracket) {
      if (part0 === "") {
        return `[${part1},${part2}]+${subPart}`;
      }
      return `${part0}:[[${part1},${part2}]+${subPart}]`;
    } else if (part0 === "") {
      return `[${part1},${part2}]${subPart}`;
    }
    return `[${part0}:[${part1},${part2}]${subPart}]`;
  }

  function displace(array: Move[], d: number, dr: number): Move[] {
    const arr = array.concat(),
      arrEnd = repeatEnd(arr.slice(0, d), dr);
    return simplify(invert(arrEnd).concat(arr, arrEnd));
  }

  function invert(array: Move[]): Move[] {
    const arr: Move[] = [];
    for (let i = array.length - 1; i >= 0; i--) {
      arr.push({ base: array[i].base, amount: normalize(-array[i].amount) });
    }
    return arr;
  }

  function arrayToStr(array: Move[]): string {
    let arr = array.concat();
    arr = simplify(arr);
    if (arr.length === 0) {
      return "";
    }
    for (let times = 0; times <= 1; times++) {
      for (let i = 0; i < arr.length - 1; i++) {
        if (
          isSameClass(arr[i], arr[i + 1]) &&
          commute[arr[i].base].priority > commute[arr[i + 1].base].priority
        ) {
          arr = swapArray(arr, i, i + 1);
        }
      }
    }
    const arrTemp: string[] = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].amount < 0) {
        if (arr[i].amount === -1) {
          arrTemp[i] = `${arr[i].base}'`;
        } else {
          arrTemp[i] = `${arr[i].base + -arr[i].amount}'`;
        }
      } else if (arr[i].amount === 1) {
        arrTemp[i] = arr[i].base;
      } else {
        arrTemp[i] = arr[i].base + arr[i].amount;
      }
    }
    let arrOutput = `${arrTemp.join(" ")} `;
    for (const i in finalReplace) {
      const re = new RegExp(`${i} `, "gu");
      arrOutput = arrOutput.replace(re, `${finalReplace[i]} `);
    }
    arrOutput = arrOutput.substring(0, arrOutput.length - 1);
    return arrOutput;
  }

  function simplify(array: Move[]): Move[] {
    if (array.length === 0) {
      return [];
    }
    const arr: Move[] = [];
    for (let i = 0; i < array.length; i++) {
      const arrayAdd: Move = {
          base: array[i].base,
          amount: normalize(array[i].amount),
        },
        arrLen = arr.length;
      if (normalize(arrayAdd.amount) === 0) {
        continue;
      }
      let isChange = false;
      for (let j = 1; j <= 3; j++) {
        if (arr.length >= j) {
          if (arr[arrLen - j].base === arrayAdd.base) {
            let canCommute = true;
            if (j >= 2) {
              for (let k = 1; k <= j; k++) {
                if (!(arr[arrLen - k].base in commute)) {
                  canCommute = false;
                  break;
                }
              }
              for (let k = 2; k <= j; k++) {
                if (!isSameClass(arr[arrLen - k], arr[arrLen - (k - 1)])) {
                  canCommute = false;
                  break;
                }
              }
            }
            if (canCommute) {
              const moveAdd: Move = {
                base: arr[arrLen - j].base,
                amount: normalize(arr[arrLen - j].amount + arrayAdd.amount),
              };
              if (moveAdd.amount === 0) {
                arr.splice(-j, 1);
              } else {
                arr.splice(-j, 1, moveAdd);
              }
              isChange = true;
              break;
            }
          }
        }
      }
      if (!isChange) {
        arr[arrLen] = arrayAdd;
      }
    }
    return arr;
  }

  function isSameClass(move1: Move, move2: Move): boolean {
    if (move1.base in commute && move2.base in commute) {
      if (commute[move1.base].class === commute[move2.base].class) {
        return true;
      }
    }
    return false;
  }

  function swapArray(array: Move[], index1: number, index2: number): Move[] {
    array[index1] = array.splice(index2, 1, array[index1])[0];
    return array;
  }

  function normalize(amount: number): number {
    if (isOrderZero) {
      return amount;
    }
    return (((amount % order) + order - minAmount) % order) + minAmount;
  }

  return {
    search,
    expand,
    commutatorPost,
  };
})();

export default commutator;
