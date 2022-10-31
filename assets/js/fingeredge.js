"use strict";

function finger(s1, position) {
    // R' F R' S' R F R' S R F2 R
    if (fingerback(s1, position) > 5) {
        return 0;
    }
    let fingerposition = position;
    const arr = s1.split(" ");
    for (let i = 0; i <= arr.length - 1; i++) {
        if (i > 0 && arr[i][0] === "E") {
            if (arr[i - 1][0] === "D") {
                return 0;
            }
            if (arr[i - 1] === "U2") {
                return 0;
            }
            if (arr[i - 1][0] === "U" && arr[i] === "E2") {
                return 0;
            }
        }
        if (i > 0 && arr[i][0] === "S") {
            if (arr[i - 1] === "F2" || arr[i - 1][0] === "B") {
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
        if (i > 0 && i < arr.length - 1) {
            if (arr[i][0] === "E" || arr[i][0] === "M" || arr[i][0] === "S") {
                if (arr[i - 1][0] === "E" || arr[i - 1][0] === "M" || arr[i - 1][0] === "S") {
                    if (arr[i + 1][0] === "E" || arr[i + 1][0] === "M" || arr[i + 1][0] === "S") {
                        return 0;
                    }
                }
            }
        }
        if (fingerposition === 4 && (arr[i][0] === "B" || arr[i][0] === "F" || arr[i] === "D2" || arr[i] === "S2" || arr[i] === "M2")) {
            return 0;
        }
        // R2 U2 R S R2 S' R U2 R2
        if (fingerposition === 3 && arr[i] === "F2") {
            return 0;
        }
        if (fingerposition === 2 && (arr[i][0] === "B" || arr[i] === "F2" || arr[i] === "S2" || arr[i] === "E2")) {
            return 0;
        }
        // R U2 R2 F' R S R' F R S' R U2 R'
        if (fingerposition === 1 && arr[i] === "B2") {
            return 0;
        }
        if (fingerposition === 0 && (arr[i][0] === "B" || arr[i][0] === "F" || arr[i] === "D2" || arr[i] === "S2" || arr[i] === "M2")) {
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
                    if (arr[j] === "R" || arr[i] === "r" || arr[j] === "R2" || arr[i] === "r2") {
                        fingerposition = 0;
                        break;
                    }
                    if (arr[j] === "R'" || arr[i] === "r'") {
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

function fingerpain(s1, position) {
    let pain = 0;
    let fingerposition = position;
    const arr = s1.split(" ");
    pain = pain + Math.floor(fingerback(s1, position) / 2);
    for (let i = 0; i <= arr.length - 1; i++) {
        if (fingerposition === 4 && (arr[i] === "U2" || arr[i][0] === "M" || arr[i][0] === "E")) {
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
        if (fingerposition === 0 && (arr[i] === "U2" || arr[i][0] === "M" || arr[i][0] === "E")) {
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
                    if (arr[j] === "R" || arr[i] === "r" || arr[j] === "R2" || arr[i] === "r2") {
                        fingerposition = 0;
                        break;
                    }
                    if (arr[j] === "R'" || arr[i] === "r'") {
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

function fingerback(s1, position) {
    let fingerposition = position;
    const arr = s1.split(" ");
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
                    if (arr[j] === "R" || arr[i] === "r" || arr[j] === "R2" || arr[i] === "r2") {
                        fingerposition = 0;
                        break;
                    }
                    if (arr[j] === "R'" || arr[i] === "r'") {
                        fingerposition = 4;
                        break;
                    }
                }
            } else {
                fingerposition = (fingerposition + 2) % 4;
            }
        }
        if (fingerposition === 0 || fingerposition === 4) {
            sum = sum + 1;
        }
    }
    return sum;
}


function fingerbeginfrom(s1) {
    let fingerbegin = "",
        count = 0;
    for (let i = 0; i <= 3; i++) {
        if (finger(s1, 2) === 1 && (fingerpain(s1, 2) === i || fingerpain(s1, 2) === i + 1)) {
            count = count + 1;
            fingerbegin = `${fingerbegin}${arrLang[lang]["homegrip"]}/`;
        }
        if (finger(s1, 1) === 1 && fingerpain(s1, 1) === i) {
            count = count + 1;
            fingerbegin = `${fingerbegin}${arrLang[lang]["thumbdown"]}/`;
        }
        if (finger(s1, 3) === 1 && fingerpain(s1, 3) === i) {
            count = count + 1;
            fingerbegin = `${fingerbegin}${arrLang[lang]["thumbup"]}/`;
        }
        if (fingerbegin.length > 0) {
            break;
        }
    }
    if (count === 3) {
        return `${arrLang[lang]["all"]}`;
    }
    return fingerbegin.substring(0, fingerbegin.length - 1);
}