"use strict";

function finger(s1, position) {
    if (fingerback(s1, position) > 2) {
        return 0;
    }
    let fingerposition = position;
    const arr = s1.split(" ");
    for (let i = 0; i <= arr.length - 1; i++) {
        if (fingerposition === 3 && (arr[i] === "F2" || arr[i] === "U2")) {
            return 0;
        }
        if (fingerposition === 2 && (arr[i][0] === "B" || arr[i][0] === "F")) {
            return 0;
        }
        if (fingerposition === 1 && (arr[i] === "U2" || arr[i] === "B2")) {
            return 0;
        }
        if (fingerposition === 0 && (arr[i] === "U2" || arr[i][0] === "B" || arr[i][0] === "F" || arr[i] === "D2")) {
            return 0;
        }
        if (arr[i] === "R") {
            fingerposition = fingerposition + 1;
        }
        if (arr[i] === "R'") {
            fingerposition = fingerposition - 1;
        }
        if (arr[i] === "R2") {
            fingerposition = (fingerposition + 2) % 4;
        }
        if (fingerposition === 4 || fingerposition === -1) {
            return 0;
        }
    }
    if (fingerposition !== position) {
        return 0;
    }
    return 1;
}


function fingerback(s1, position) {
    let fingerposition = position;
    const arr = s1.split(" ");
    let sum = 0;
    for (let i = 0; i <= arr.length - 1; i++) {
        if (arr[i] === "R") {
            fingerposition = fingerposition + 1;
        }
        if (arr[i] === "R'") {
            fingerposition = fingerposition - 1;
        }
        if (arr[i] === "R2") {
            fingerposition = (fingerposition + 2) % 4;
        }
        if (fingerposition === 0) {
            sum = sum + 1;
        }
    }
    return sum;
}


function fingerbeginfrom(s1) {
    let fingerbegin = "",
        count = 0;
    if (finger(s1, 2) === 1 && fingerback(s1, 2) === 0) {
        count = count + 1;
        fingerbegin = `${fingerbegin}${arrLang[lang]["homegrip"]}/`;
    }
    if (finger(s1, 1) === 1 && fingerback(s1, 1) === 0) {
        count = count + 1;
        fingerbegin = `${fingerbegin}${arrLang[lang]["thumbdown"]}/`;
    }
    if (finger(s1, 3) === 1 && fingerback(s1, 3) === 0) {
        count = count + 1;
        fingerbegin = `${fingerbegin}${arrLang[lang]["thumbup"]}/`;
    }
    if (finger(s1, 2) === 1 && fingerback(s1, 2) === 2) {
        count = count + 1;
        fingerbegin = `${fingerbegin}${arrLang[lang]["homegrip"]}/`;
    }
    if (finger(s1, 1) === 1 && fingerback(s1, 1) === 2) {
        count = count + 1;
        fingerbegin = `${fingerbegin}${arrLang[lang]["thumbdown"]}/`;
    }
    if (finger(s1, 3) === 1 && fingerback(s1, 3) === 2) {
        count = count + 1;
        fingerbegin = `${fingerbegin}${arrLang[lang]["thumbup"]}/`;
    }
    if (count === 3) {
        return `${arrLang[lang]["all"]}`;
    }
    return fingerbegin.substring(0, fingerbegin.length - 1);
}