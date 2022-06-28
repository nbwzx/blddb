"use strict";

const cornerCodeToCustom = {
    "a11": "D",
    "a12": "E",
    "a13": "G",
    "a14": "C",
    "a16": "G",
    "a17": "A",
    "a18": "A",
    "a19": "J",
    "a21": "W",
    "a22": "I",
    "a23": "X",
    "a24": "K",
    "a26": "O",
    "a27": "O",
    "a28": "M",
    "a29": "R",
    "a31": "E",
    "a32": "D",
    "a33": "C",
    "a34": "X",
    "a36": "T",
    "a37": "Q",
    "a38": "L",
    "a39": "M",
    "a41": "K",
    "a42": "H",
    "a43": "I",
    "a44": "R",
    "a46": "Z",
    "a47": "Z",
    "a48": "P",
    "a49": "S",
    "a51": "B",
    "a52": "B",
    "a53": "L",
    "a54": "S",
    "a56": "Q",
    "a57": "N",
    "a58": "J",
    "a59": "Y",
    "a61": "H",
    "a62": "F",
    "a63": "F",
    "a64": "Y",
    "a66": "W",
    "a67": "T",
    "a68": "N",
    "a69": "P"
};

const cornerCodeToSpeffz = {
    "a11": "A",
    "a12": "A",
    "a13": "B",
    "a14": "D",
    "a16": "B",
    "a17": "D",
    "a18": "C",
    "a19": "C",
    "a21": "U",
    "a22": "U",
    "a23": "V",
    "a24": "X",
    "a26": "V",
    "a27": "X",
    "a28": "W",
    "a29": "W",
    "a31": "E",
    "a32": "E",
    "a33": "F",
    "a34": "H",
    "a36": "F",
    "a37": "H",
    "a38": "G",
    "a39": "G",
    "a41": "M",
    "a42": "M",
    "a43": "N",
    "a44": "P",
    "a46": "N",
    "a47": "P",
    "a48": "O",
    "a49": "O",
    "a51": "I",
    "a52": "I",
    "a53": "J",
    "a54": "L",
    "a56": "J",
    "a57": "L",
    "a58": "K",
    "a59": "K",
    "a61": "Q",
    "a62": "Q",
    "a63": "R",
    "a64": "T",
    "a66": "R",
    "a67": "T",
    "a68": "S",
    "a69": "S"
};

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toGMTString()}`;
    document.cookie = `${cname}=${cvalue};${expires};`;
}

function getCookie(cname) {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

window.onload = function onload() {
    for (const i in cornerCodeToCustom) {
        if (byid(i) === null){
            setCookie(i, cornerCodeToCustom[i], 30);
            continue;
        }
        if (byid(i).value === ""){
            byid(i).value = cornerCodeToCustom[i];
        }
        if (getCookie(i) === ""){
            setCookie(i, byid(i).value, 30);
        } else {
            byid(i).value = getCookie(i);
        }
    }
};

function byid(id) {
    return document.getElementById(id);
}

function setAll() {
    for (const i in cornerCodeToCustom) {
        setCookie(i, byid(i).value, 30);
    }
}

function setChichu() {
    for (const i in cornerCodeToCustom) {
        byid(i).value = cornerCodeToCustom[i];
        setCookie(i, byid(i).value, 30);
    }
}

function setSpeffz() {
    for (const i in cornerCodeToSpeffz) {
        byid(i).value = cornerCodeToSpeffz[i];
        setCookie(i, byid(i).value, 30);
    }
}