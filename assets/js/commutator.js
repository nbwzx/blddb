"use strict";

let result = [];
const order = 4,
    minAmount = -1,
    maxAmount = 2,
    commute = {
        "U": 1,
        "D": 1,
        "E": 1,
        "R": 2,
        "L": 2,
        "M": 2,
        "F": 3,
        "B": 3,
        "S": 3
    };

function isOperator(val) {
    const operatorString = "+:,[]";
    return operatorString.indexOf(val) > -1;
}

function initializeExperssion(expressionOrigin) {
    const expression = expressionOrigin.replace(/\s/gu, " "),
        inputStack = [];
    inputStack.push(expression[0]);
    for (let i = 1; i < expression.length; i++) {
        if (isOperator(expression[i]) || isOperator(inputStack.slice(-1))) {
            inputStack.push(expression[i]);
        } else {
            inputStack.push(inputStack.pop() + expression[i]);
        }
    }
    return inputStack;
}

function operatorLevel(operator) {
    if (operator === ",") {
        return 0;
    }
    if (operator === ":") {
        return 1;
    }
    if (operator === "+") {
        return 2;
    }
    if (operator === "[") {
        return 3;
    }
    if (operator === "]") {
        return 4;
    }
    return null;
}

function rpn(inputStack) {
    // Reverse Polish Notation
    const outputStack = [],
        operatorStack = [];
    let match = false,
        tempOperator = "";
    while (inputStack.length > 0) {
        const sign = inputStack.shift();
        if (!isOperator(sign)) {
            outputStack.push(sign);
        } else if (operatorLevel(sign) === 4) {
            match = false;
            while (operatorStack.length > 0) {
                tempOperator = operatorStack.pop();
                if (tempOperator === "[") {
                    match = true;
                    break;
                } else {
                    outputStack.push(tempOperator);
                }
            }
            if (match === false) {
                return "Lack left parenthesis.";
            }
        } else {
            while (operatorStack.length > 0 && operatorStack.slice(-1).toString() !== "[".toString() && operatorLevel(sign) <= operatorLevel(operatorStack.slice(-1))) {
                outputStack.push(operatorStack.pop());
            }
            operatorStack.push(sign);
        }
    }
    while (operatorStack.length > 0) {
        tempOperator = operatorStack.pop();
        if (tempOperator === "[") {
            return "Lack right parenthesis.";
        }
        outputStack.push(tempOperator);
    }
    return outputStack;
}

function score(algValueOrigin) {
    let i = 0,
        j = 0;
    let algValue = algValueOrigin.replace(/\(/gu, "[");
    algValue = algValue.replace(/\)/gu, "]");
    algValue = algValue.replace(/（/gu, "[");
    algValue = algValue.replace(/）/gu, "]");
    algValue = algValue.replace(/【/gu, "[");
    algValue = algValue.replace(/】/gu, "]");
    algValue = algValue.replace(/，/gu, ",");
    algValue = algValue.replace(/\]\[/gu, "]+[");
    const expression = rpn(initializeExperssion(algValue)),
        rpnExpression = [];
    while (expression.length > 0) {
        const sign = expression.shift();
        if (isOperator(sign)) {
            j = rpnExpression.pop();
            i = rpnExpression.pop();
            if (typeof i !== "undefined" && typeof j !== "undefined") {
                if (isNaN(i) === true) {
                    i = i.split(" ").length;
                }
                if (isNaN(j) === true) {
                    j = j.split(" ").length;
                }
            }
            rpnExpression.push(scoreTwo(i, j, sign));
        } else {
            rpnExpression.push(sign);
        }
    }
    return rpnExpression[0];
}

function scoreTwo(i, j, sign) {
    const abMaxScore = 2.5,
        abMinScore = 5,
        cScore = 1;
    switch (sign) {
    case "+":
        return i + j;
    case ":":
        return cScore * i + j;
    case ",":
        return abMaxScore * Math.max(i, j) + abMinScore * Math.min(i, j);
    default:
        return false;
    }
}

function sortRule(a, b) {
    return score(a) - score(b);
}

function commutator(x) {
    result = [];
    if (x.length === 0) {
        return "Empty input.";
    }
    let arr = preprocessing(x);
    // // See https://github.com/cubing/cubing.js/blob/main/src/cubing/alg/traversal.ts
    // // Examples:
    // // • order 4 → min -1 (e.g. cube)
    // // • order 5 → min -2 (e.g. Megaminx)
    // // • order 3 → min -1 (e.g. Pyraminx)
    arr = simplify(arr);
    const len = arr.length;
    if (len === 0) {
        return "Empty input.";
    }
    let sum = 0;
    for (let i = 0; i <= len - 1; i++) {
        sum = 0;
        for (let j = 0; j <= len - 1; j++) {
            if (arr[i][0] === arr[j][0]) {
                sum = sum + arr[j][1];
            }
        }
        if (sum % order !== 0) {
            return "Not found.";
        }
    }
    let count = 0,
        arrex = [];
    const locationud = [];
    for (let i = 0; i < arr.length - 1; i++) {
        if (commute[arr[i][0]] === commute[arr[i + 1][0]] && arr[i][0] in commute && arr[i + 1][0] in commute) {
            locationud[count] = i;
            count += 1;
        }
    }
    const number = 2 ** count;
    let commutatorResult = "Not found.",
        flag = false;
    for (let ii = 1; ii <= 1; ii++) { // (len - 1) / 3
        for (let i = 0; i <= number - 1; i++) {
            const text = String(i.toString(2));
            arrex = arr.concat();
            for (let j = 0; j < text.length; j++) {
                if (text[text.length - 1 - j] === "1") {
                    arrex = swaparr(arrex, locationud[j], locationud[j] + 1);
                }
            }
            commutatorResult = commutatormain(arrex, ii, ii);
            if (commutatorResult !== "Not found.") {
                flag = true;
            }
        }
        if (flag) {
            result.sort(sortRule);
            return result[0];
        }
    }
    return "Not found.";
}

function preprocessing(algValue) {
    let xold = algValue.trim();
    xold = xold.replace(/\s+/igu, "");
    xold = xold.replace(/[‘]/gu, "'");
    xold = xold.replace(/[’]/gu, "'");
    if (xold.length === 0) {
        return [];
    }
    let x = "";
    for (let i = 0; i < xold.length; i++) {
        if ((xold[i + 1] < "0" || xold[i + 1] > "9") && xold[i + 1] !== "'") {
            x = `${x + xold[i]} `;
        } else {
            x = x + xold[i];
        }
    }
    if (x.indexOf("R") > -1 || x.indexOf("M") > -1) {
        x = x.replace(/r2/gu, "R2 M2");
        x = x.replace(/r'/gu, "R' M");
        x = x.replace(/r/gu, "R M'");
    }
    if (x.indexOf("L") > -1 || x.indexOf("M") > -1) {
        x = x.replace(/l2/gu, "L2 M2");
        x = x.replace(/l'/gu, "L' M'");
        x = x.replace(/l/gu, "L M");
    }
    if (x.indexOf("F") > -1 || x.indexOf("S") > -1) {
        x = x.replace(/f2/gu, "F2 S2");
        x = x.replace(/f'/gu, "F' S'");
        x = x.replace(/f/gu, "F S");
    }
    if (x.indexOf("B") > -1 || x.indexOf("S") > -1) {
        x = x.replace(/b2/gu, "B2 S2");
        x = x.replace(/b'/gu, "B' S");
        x = x.replace(/b/gu, "B S'");
    }
    if (x.indexOf("U") > -1 || x.indexOf("E") > -1) {
        x = x.replace(/u2/gu, "U2 E2");
        x = x.replace(/u'/gu, "U' E");
        x = x.replace(/u/gu, "U E'");
    }
    if (x.indexOf("D") > -1 || x.indexOf("E") > -1) {
        x = x.replace(/d2/gu, "D2 E2");
        x = x.replace(/d'/gu, "D' E'");
        x = x.replace(/d/gu, "D E");
    }
    const arr1 = x.split(" ");
    const arr = [];
    for (let i = 0; i < arr1.length; i++) {
        arr[i] = [];
        arr[i][0] = arr1[i][0];
        let temp = arr1[i].replace(/[^0-9]/ug, "");
        if (temp === "") {
            temp = 1;
        }
        arr[i][1] = Number(temp);
        if (arr1[i].indexOf("'") > -1) {
            arr[i][1] = -arr[i][1];
        }
    }
    return arr;
}

function commutatorpre(arr1, depth, maxdepth) {
    let count = 0,
        arrex = [];
    const locationud = [];
    for (let i = 0; i < arr1.length - 1; i++) {
        if (commute[arr1[i][0]] === commute[arr1[i + 1][0]] && arr1[i][0] in commute && arr1[i + 1][0] in commute) {
            locationud[count] = i;
            count += 1;
        }
    }
    const number = 2 ** count;
    let commutatorResult = "Not found.";
    for (let i = 0; i <= number - 1; i++) {
        const text = String(i.toString(2));
        arrex = arr1.concat();
        for (let j = 0; j < text.length; j++) {
            if (text[text.length - 1 - j] === "1") {
                arrex = swaparr(arrex, locationud[j], locationud[j] + 1);
            }
        }
        commutatorResult = commutatormain(arrex, depth, maxdepth);
        if (commutatorResult !== "Not found.") {
            return commutatorResult;
        }
    }
    return "Not found.";
}

function commutatormain(array, depth, maxdepth) {
    let arr1 = simplify(array),
        text1 = "",
        text0 = "";
    const arrbak = arr1.concat(),
        len = arr1.length;
    if (arr1.length < 3 * depth + 1) {
        return "Not found.";
    }
    for (let d = 0; d <= (len + arr1.length + 1) / 2 - 1; d++) {
        for (let drKey = 1; drKey < order; drKey++) {
            // 1, -1, 2, -2...
            const dr = (drKey % 2 * 2 - 1) * Math.floor((drKey + 1) / 2);
            if (d === 0) {
                if (drKey > 1) {
                    break;
                }
            } else {
                if (Math.abs(dr) > Math.abs(arrbak[d - 1][1])) {
                    break;
                }
                if (order % 2 === 1 || arrbak[d - 1][1] !== Math.floor(order / 2)) {
                    if (arrbak[d - 1][1] < 0 && dr > 0 || arrbak[d - 1][1] > 0 && dr < 0) {
                        continue;
                    }
                }
            }
            arr1 = displace(arrbak, d, dr);
            // For a b c b' a' d c' d' = a b:[c,b' a' d]
            for (let i = 1; i <= arr1.length / 2 - 1; i++) {
                let minj = 0;
                if (depth === 1) {
                    minj = Math.max(1, Math.ceil(arr1.length / 2 - i));
                } else {
                    minj = 1;
                }
                for (let j = minj; j <= arr1.length / 2 - 1; j++) {
                    let part1x = [],
                        part2x = [];
                    const commuteAddList1 = [],
                        commuteAddList2 = [];
                    let commuteCase = [];
                    if (arr1[i - 1][0] === arr1[i + j - 1][0]) {
                        // For [a bx,by c bz]
                        for (let ir = minAmount; ir <= maxAmount; ir++) {
                            if (ir === 0) {
                                continue;
                            }
                            const jr = normalize(arr1[i + j - 1][1] + ir);
                            part1x = simplify(repeatEnd(arr1.slice(0, i), ir));
                            commuteAddList1.push(part1x);
                            part2x = simplify(invert(part1x).concat(repeatEnd(arr1.slice(0, i + j), jr)));
                            commuteAddList2.push(part2x);
                        }
                    } else {
                        if (depth === 1 && arr1[i][0] !== arr1[arr1.length - 1][0]) {
                            continue;
                        }
                        part1x = simplify(arr1.slice(0, i));
                        commuteAddList1.push(part1x);
                        part2x = simplify(arr1.slice(i, i + j));
                        commuteAddList2.push(part2x);
                        if (commute[arr1[i + j - 1][0]] === commute[arr1[i - 1][0]] && arr1[i - 1][0] in commute && arr1[i + j - 1][0] in commute && arr1[i + j - 1][0] !== arr1[i - 1][0]) {
                            // For L b R c L' b' R' c' = [L b R,c L' R]
                            commuteAddList1.push(part1x);
                            commuteCase = simplify(part2x.concat([arr1[i - 1]]));
                            commuteAddList2.push(commuteCase);
                            // For L b R L c R L2 b' R2 c' = [L b R L,c R2 L']
                            if (i >= 2) {
                                if (commute[arr1[i - 2][0]] === commute[arr1[i - 1][0]] && arr1[i - 1][0] in commute && arr1[i - 2][0] in commute) {
                                    commuteAddList1.push(part1x);
                                    commuteCase = simplify(part2x.concat(arr1.slice(i - 2, i)));
                                    commuteAddList2.push(commuteCase);
                                }
                            }
                        }
                        if (commute[arr1[i + j][0]] === commute[arr1[i][0]] && arr1[i][0] in commute && arr1[i + j][0] in commute && arr1[i + j][0] !== arr1[i][0]) {
                            // For c R b L c' R' b' L' = [c R b R, R' L c'] = [c R L',L b R]
                            commuteCase = simplify(part1x.concat(invert([arr1[i + j]])));
                            commuteAddList1.push(commuteCase);
                            commuteCase = simplify([arr1[i + j]].concat(part2x));
                            commuteAddList2.push(commuteCase);
                            // For c R2 b R' L2 c' R' L' b' L' = [c R2 b L R,R2 L c'] = [c R2 L', L b R L]
                            if (arr1.length >= i + j + 2) {
                                if (commute[arr1[i + j + 1][0]] === commute[arr1[i + j][0]] && arr1[i + j][0] in commute && arr1[i + j + 1][0] in commute) {
                                    commuteCase = simplify(part1x.concat(invert(arr1.slice(i + j, i + j + 2))));
                                    commuteAddList1.push(commuteCase);
                                    commuteCase = simplify(arr1.slice(i + j, i + j + 2).concat(part2x));
                                    commuteAddList2.push(commuteCase);
                                }
                            }
                        }
                    }
                    for (const commuteAddKey in commuteAddList1) {
                        part1x = commuteAddList1[commuteAddKey];
                        part2x = commuteAddList2[commuteAddKey];
                        const arrb = simplify(part2x.concat(part1x, invert(part2x), invert(part1x), arr1));
                        let partb = "";
                        if (depth > 1) {
                            partb = commutatorpre(arrb, depth - 1, maxdepth);
                        } else if (arrb.length > 0) {
                            continue;
                        }
                        if (partb !== "Not found.") {
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
                            let part0 = simplify(repeatEnd(arrbak.slice(0, d), dr)),
                                part1 = part1y,
                                part2 = part2y;
                            if (part0.length > 0 && maxdepth === 1) {
                                const partz = simplify(part0.concat(part2y));
                                // Avoid a b c b' a' b' c' b = b':[b a b,c], use a b:[c,b' a' b'] instead.
                                if (partz.length < part0.length - 1) {
                                    part0 = partz;
                                    part1 = invert(part2y);
                                    part2 = part1y;
                                }
                            }
                            const part1Output = simplifyfinal(part1),
                                part2Output = simplifyfinal(part2),
                                part0Output = simplifyfinal(part0);
                            if (depth === 1) {
                                text1 = singleOutput(part0Output, part1Output, part2Output);
                            } else {
                                text1 = multiOutput(part0Output, part1Output, part2Output, partb);
                            }
                            if (text0 === "") {
                                text0 = text1;
                            }
                            if (score(text1) < score(text0)) {
                                text0 = text1;
                            }
                            if (depth === maxdepth && result.indexOf(text1) === -1) {
                                result.push(text1);
                            }
                        }
                    }
                }
            }
        }
    }
    if (text0 === "") {
        return "Not found.";
    }
    return text0;
}

function repeatEnd(array, attempt) {
    const arr = array.concat();
    if (arr.length === 0) {
        return [];
    }
    const popped = arr.pop();
    if (attempt === 0) {
        return arr;
    }
    arr.push([popped[0], attempt]);
    return arr;
}

function multiOutput(setup, commutatora, commutatorb, partb) {
    if (setup === "") {
        return `[${commutatora},${commutatorb}]+${partb}`;
    }
    return `${setup}:[[${commutatora},${commutatorb}]+${partb}]`;
}

function singleOutput(setup, commutatora, commutatorb) {
    if (setup === "") {
        return `[${commutatora},${commutatorb}]`;
    }
    return `${setup}:[${commutatora},${commutatorb}]`;
}

function displace(array, d, dr) {
    const arr = array.concat(),
        arr1 = repeatEnd(arr.slice(0, d), dr);
    return simplify(invert(arr1).concat(arr, arr1));
}

function invert(array) {
    const arr = [];
    for (let i = array.length - 1; i >= 0; i--) {
        arr.push([array[i][0], normalize(-array[i][1])]);
    }
    return arr;
}

function simplifyfinal(array) {
    let arr = array.concat();
    arr = simplify(arr);
    if (arr.length === 0) {
        return "";
    }
    for (let times = 0; times <= 1; times++) {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i][0] === "D" && arr[i + 1][0] === "U") {
                arr = swaparr(arr, i, i + 1);
            }
            if (arr[i][0] === "B" && arr[i + 1][0] === "F") {
                arr = swaparr(arr, i, i + 1);
            }
            if (arr[i][0] === "L" && arr[i + 1][0] === "R") {
                arr = swaparr(arr, i, i + 1);
            }
            if (arr[i][0] === "E" && arr[i + 1][0] === "U") {
                arr = swaparr(arr, i, i + 1);
            }
            if (arr[i][0] === "S" && arr[i + 1][0] === "F") {
                arr = swaparr(arr, i, i + 1);
            }
            if (arr[i][0] === "M" && arr[i + 1][0] === "R") {
                arr = swaparr(arr, i, i + 1);
            }
            if (arr[i][0] === "E" && arr[i + 1][0] === "D") {
                arr = swaparr(arr, i, i + 1);
            }
            if (arr[i][0] === "S" && arr[i + 1][0] === "B") {
                arr = swaparr(arr, i, i + 1);
            }
            if (arr[i][0] === "M" && arr[i + 1][0] === "L") {
                arr = swaparr(arr, i, i + 1);
            }
        }
    }
    const arrOutput1 = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][1] < 0) {
            if (arr[i][1] === -1) {
                arrOutput1[i] = `${arr[i][0]}'`;
            } else {
                arrOutput1[i] = `${arr[i][0] + -arr[i][1]}'`;
            }
        } else if (arr[i][1] === 1) {
            arrOutput1[i] = arr[i][0];
        } else {
            arrOutput1[i] = arr[i][0] + arr[i][1];
        }
    }
    let arrOutput = `${arrOutput1.join(" ")} `;
    arrOutput = arrOutput.replace(/R2 M2 /gu, "r2 ");
    arrOutput = arrOutput.replace(/R' M /gu, "r' ");
    arrOutput = arrOutput.replace(/R M' /gu, "r ");
    arrOutput = arrOutput.replace(/L2 M2 /gu, "l2 ");
    arrOutput = arrOutput.replace(/L' M' /gu, "l' ");
    arrOutput = arrOutput.replace(/L M /gu, "l ");
    arrOutput = arrOutput.replace(/F2 S2 /gu, "f2 ");
    arrOutput = arrOutput.replace(/F' S' /gu, "f' ");
    arrOutput = arrOutput.replace(/F S /gu, "f ");
    arrOutput = arrOutput.replace(/B2 S2 /gu, "b2 ");
    arrOutput = arrOutput.replace(/B' S /gu, "b' ");
    arrOutput = arrOutput.replace(/B S' /gu, "b ");
    arrOutput = arrOutput.replace(/U2 E2 /gu, "u2 ");
    arrOutput = arrOutput.replace(/U' E /gu, "u' ");
    arrOutput = arrOutput.replace(/U E' /gu, "u ");
    arrOutput = arrOutput.replace(/D2 E2 /gu, "d2 ");
    arrOutput = arrOutput.replace(/D' E' /gu, "d' ");
    arrOutput = arrOutput.replace(/D E /gu, "d ");
    arrOutput = arrOutput.replace(/M2 R2 /gu, "r2 ");
    arrOutput = arrOutput.replace(/M R' /gu, "r' ");
    arrOutput = arrOutput.replace(/M' R /gu, "r ");
    arrOutput = arrOutput.replace(/M2 L2 /gu, "l2 ");
    arrOutput = arrOutput.replace(/M' L' /gu, "l' ");
    arrOutput = arrOutput.replace(/M L /gu, "l ");
    arrOutput = arrOutput.replace(/S2 F2 /gu, "f2 ");
    arrOutput = arrOutput.replace(/S' F' /gu, "f' ");
    arrOutput = arrOutput.replace(/S F /gu, "f ");
    arrOutput = arrOutput.replace(/S2 B2 /gu, "b2 ");
    arrOutput = arrOutput.replace(/S B' /gu, "b' ");
    arrOutput = arrOutput.replace(/S' B /gu, "b ");
    arrOutput = arrOutput.replace(/E2 U2 /gu, "u2 ");
    arrOutput = arrOutput.replace(/E U' /gu, "u' ");
    arrOutput = arrOutput.replace(/E' U /gu, "u ");
    arrOutput = arrOutput.replace(/E2 D2 /gu, "d2 ");
    arrOutput = arrOutput.replace(/E' D' /gu, "d' ");
    arrOutput = arrOutput.replace(/E D /gu, "d ");
    arrOutput = arrOutput.replace(/R M2 /gu, "r M' ");
    arrOutput = arrOutput.replace(/R' M2 /gu, "r' M ");
    arrOutput = arrOutput.replace(/M2 R /gu, "r M' ");
    arrOutput = arrOutput.replace(/M2 R' /gu, "r' M ");
    arrOutput = arrOutput.substring(0, arrOutput.length - 1);
    return arrOutput;
}

function simplify(array) {
    if (array.length === 0) {
        return [];
    }
    const arr = [];
    for (let i = 0; i < array.length; i++) {
        const arrayAdd = [array[i][0], normalize(array[i][1])],
            len = arr.length;
        if (normalize(arrayAdd[1]) === 0) {
            continue;
        }
        let hasChanged = false;
        for (let j = 1; j <= 3; j++) {
            if (arr.length >= j) {
                if (arr[len - j][0] === arrayAdd[0]) {
                    let canCommute = true;
                    if (j >= 2) {
                        for (let k = 1; k <= j; k++) {
                            if (arr[len - k][0] in commute === false) {
                                canCommute = false;
                                break;
                            }
                        }
                        for (let k = 2; k <= j; k++) {
                            if (commute[arr[len - k][0]] !== commute[arr[len - (k - 1)][0]]) {
                                canCommute = false;
                                break;
                            }
                        }
                    }
                    if (canCommute) {
                        const x = [arr[len - j][0], normalize(arr[len - j][1] + arrayAdd[1])];
                        if (x[1] === 0) {
                            arr.splice(-j, 1);
                        } else {
                            arr.splice(-j, 1, x);
                        }
                        hasChanged = true;
                        break;
                    }
                }
            }
        }
        if (hasChanged === false) {
            arr[len] = arrayAdd;
        }
    }
    return arr;
}

function swaparr(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
}

function normalize(num) {
    return (num % order + order - minAmount) % order + minAmount;
}