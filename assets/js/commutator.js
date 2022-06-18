"use strict";

let result = [];
const order = 4,
    minAmount = -1,
    maxAmount = 2;

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
            document.getElementById("out").innerHTML = "Not found.";
            return "Not found.";
        }
    }
    let count = 0,
        arrex = [];
    const locationud = [];
    for (let i = 0; i < arr.length - 1; i++) {
        const similarstr = "UD DU UE EU DE ED RM MR RL LR LM ML FS SF FB BF SB BS";
        if (similarstr.indexOf(arr[i][0] + arr[i + 1][0]) > -1) {
            locationud[count] = i;
            count += 1;
        }
    }
    const number = 2 ** count;
    let commutatorResult = "Not found.",
        flag = false;
    for (let ii = 1; ii <= 1; ii++) { //(len - 1) / 3
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
    let x = algValue.trim();
    x = x.replace(/\s+/igu, " ");
    x = x.replace(/[‘]/gu, "'");
    x = x.replace(/[’]/gu, "'");
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
        const similarstr = "UD DU UE EU DE ED RM MR RL LR LM ML FS SF FB BF SB BS";
        if (similarstr.indexOf(arr1[i][0] + arr1[i + 1][0]) > -1) {
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
    const arr0 = array.concat(),
        partc = conjugate(arr0);
    let arr1 = simplify(invert(partc).concat(arr0, partc)),
        text1 = "",
        text0 = "";
    const arrbak = arr1.concat(),
        len = arr1.length;
    if (len < 3 * depth + 1) {
        return "Not found.";
    }
    for (let d = 0; d <= len - 1; d++) {
        let drmin = 0,
            drmax = 0;
        if (d > 0) {
            if (arrbak[d - 1][1] > 0) {
                drmin = 1;
                drmax = arrbak[d - 1][1];
            }
            if (arrbak[d - 1][1] < 0) {
                drmin = arrbak[d - 1][1];
                drmax = -1;
            }
        }
        for (let dr = drmin; dr <= drmax; dr++) {
            arr1 = displace(arrbak, d, dr);
            // For a b c b' a' d c' d' = a b:[c,b' a' d]
            // To check
            // For M U2 D' S U' S' D' S' U' S D2 M' = M U2 D' S U' S':[D' S' U',S U D]
            let maxi = 0;
            if (depth === 1) {
                maxi = len / 2 - 1;
            } else {
                maxi = len / 2 - 1;
            }
            for (let i = 1; i <= maxi; i++) {
                let minj = 0;
                if (depth === 1) {
                    minj = Math.max(1, Math.ceil(len / 2 - i));
                } else {
                    minj = 1;
                }
                for (let j = minj; j <= len / 2 - 1; j++) {
                    let irList = [];
                    if (arr1[i - 1][0] === arr1[i + j - 1][0]) {
                        // (a bx,by c bz)
                        irList = [];
                        for (let irValue = minAmount; irValue <= maxAmount; irValue++) {
                            irList.push(irValue);
                        }
                    } else {
                        if (depth === 1 && arr1[i][0] !== arr1[len - 1][0]) {
                            continue;
                        }
                        irList = [""];
                    }
                    for (const irKey in irList) {
                        const ir = irList[irKey];
                        let part1x = [],
                            part2x = [];
                        if (ir === "") {
                            part1x = simplify(arr1.slice(0, i));
                            part2x = simplify(invert(part1x).concat(arr1.slice(0, i + j)));
                        } else {
                            const jr = normalize(arr1[i + j - 1][1] + ir);
                            part1x = simplify(repeatEnd(arr1.slice(0, i), ir));
                            part2x = simplify(invert(part1x).concat(repeatEnd(arr1.slice(0, i + j), jr)));
                        }
                        const arra = simplify(part2x.concat(part1x, invert(part2x), invert(part1x))),
                            arrb = simplify(arra.concat(arr1));
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
                            // For a b c b' a' d c' d' = a b:[c,b' a' d] = d:[d' a b,c] (Temporarily deprecated)
                            const part0 = simplify(partc.concat(repeatEnd(arrbak.slice(0, d), dr))),
                                part1 = part1y,
                                part2 = part2y;
                            // if (part0.length > 0 && maxdepth === 1) {
                            //     const partz = simplify(part0.concat(part2y));
                            //     if (partz.length < part0.length) {
                            //         part0 = partz;
                            //         part1 = invert(part2y);
                            //         part2 = part1y;
                            //     }
                            // }
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
                            if (score(text1) < score(text0)){
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
    if (array.length === 0) {
        return [];
    }
    const arr = array.slice(0, array.length - 1);
    if (attempt === 0) {
        return arr;
    }
    const x = [];
    x[0] = array[array.length - 1][0];
    x[1] = attempt;
    return arr.concat([x]);
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

function conjugate(array) {
    const arr = array.concat();
    let minlen = arr.length,
        t = 0;
    for (let i = 1; i < array.length; i++) {
        const arr1 = arr.slice(0, i),
            arr2 = invert(arr1),
            len = simplify(arr2.concat(arr, arr1)).length;
        if (len < minlen) {
            t = i;
            minlen = len;
        }
    }
    // Need to generlize
    // For  R' U2 R' D R U R' D' R U R, output R' U':[U',R' D R] instead of R' U2:[R' D R,U]
    if (t > 0) {
        if (arr[t - 1][1] === 2 || arr[t - 1][1] === -2) {
            const output0 = simplify(arr.slice(0, t)),
                output1 = simplify(repeatEnd(arr.slice(0, t), 1)),
                output2 = simplify(repeatEnd(arr.slice(0, t), -1)),
                len0 = simplify(invert(output0).concat(arr, output0)).length,
                len1 = simplify(invert(output1).concat(arr, output1)).length,
                len2 = simplify(invert(output2).concat(arr, output2)).length;
            if (len0 < len1 && len0 < len2) {
                return output0;
            }
            if (len1 <= len2) {
                return output1;
            }
            return output2;
        }
    }
    return arr.slice(0, t);
}

function invert(array) {
    const arr = array.concat();
    for (let i = 0; i < arr.length; i++) {
        arr[i] = [array[i][0], normalize(-array[i][1])];
    }
    return arr.map((x) => x).reverse();
}

function simplifyfinal(array) {
    let arr = array.concat();
    arr = simplify(arr);
    if (arr.length === 0) {
        return "";
    }
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
        if (arr[i][0] === "D" && arr[i + 1][0] === "E") {
            arr = swaparr(arr, i, i + 1);
        }
        if (arr[i][0] === "B" && arr[i + 1][0] === "S") {
            arr = swaparr(arr, i, i + 1);
        }
        if (arr[i][0] === "L" && arr[i + 1][0] === "M") {
            arr = swaparr(arr, i, i + 1);
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
    let i = 0;
    while (i < array.length) {
        const arrayAdd = [array[i][0], normalize(array[i][1])],
            len = arr.length;
        if (normalize(arrayAdd[1]) === 0) {
            i += 1;
            continue;
        }
        if (arr.length >= 1) {
            if (arr[len - 1][0] === arrayAdd[0]) {
                const x = [];
                x[0] = arr[len - 1][0];
                x[1] = normalize(arr[len - 1][1] + arrayAdd[1]);
                if (x[1] === 0) {
                    arr.splice(-1, 1);
                    i += 1;
                    continue;
                } else {
                    arr.splice(-1, 1, x);
                    i += 1;
                    continue;
                }
            }
        }
        if (arr.length >= 2) {
            const similarstr1 = "UD DU UE EU DE ED RM MR RL LR LM ML FS SF FB BF SB BS";
            if (arr[len - 2][0] === arrayAdd[0]) {
                if (similarstr1.indexOf(arr[len - 2][0] + arr[len - 1][0]) > -1) {
                    const x = [];
                    x[0] = arr[len - 2][0];
                    x[1] = normalize(arr[len - 2][1] + arrayAdd[1]);
                    if (x[1] === 0) {
                        arr.splice(-2, 1);
                        i += 1;
                        continue;
                    } else {
                        arr.splice(-2, 1, x);
                        i += 1;
                        continue;
                    }
                }
            }
        }
        if (arr.length >= 3) {
            const similarstr2 = "UDE DUE UED EUD DEU EDU RML MRL RLM LRM LMR MLR FSB SFB FBS BFS SBF BSF";
            if (arr[len - 3][0] === arrayAdd[0]) {
                if (similarstr2.indexOf(arr[len - 3][0] + arr[len - 2][0] + arr[len - 1][0]) > -1) {
                    const x = [];
                    x[0] = arr[len - 3][0];
                    x[1] = normalize(arr[len - 3][1] + arrayAdd[1]);
                    if (x[1] === 0) {
                        arr.splice(-3, 1);
                        i += 1;
                        continue;
                    } else {
                        arr.splice(-3, 1, x);
                        i += 1;
                        continue;
                    }
                }
            }
        }
        arr[len] = arrayAdd;
        i += 1;
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