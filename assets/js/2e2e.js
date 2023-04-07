"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["edgeNumberToChichu", "edgeChichuToNumber", "twoetwoeAlgToInfo", "twoetwoeAlgToInfo2", "edgePosToCode", "edgeCodeToPos"];
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`assets/json/${name}.json`, (json) => {
    window[`${name}`] = json;
}));

function sortByCode(inputCode) {
    const edgeCodeToNumber2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];
    const isFlipped = document.getElementById("isFlipped").value === "2e2eyes";
    let outputCode = "";
    if (edgeCodeToNumber2.indexOf(inputCode[0]) > edgeCodeToNumber2.indexOf(inputCode[1])) {
        if (isFlipped) {
            outputCode = inputCode[1] + flipCode(inputCode[0]);
        } else {
            outputCode = inputCode[1] + inputCode[0];
        }
    } else {
        outputCode = inputCode[0] + inputCode[1];
    }
    if (edgeCodeToNumber2.indexOf(inputCode[2]) > edgeCodeToNumber2.indexOf(inputCode[3])) {
        if (isFlipped) {
            outputCode = outputCode + inputCode[3] + flipCode(inputCode[2]);
        } else {
            outputCode = outputCode + inputCode[3] + inputCode[2];
        }
    } else {
        outputCode = outputCode + inputCode[2] + inputCode[3];
    }
    if (edgeCodeToNumber2.indexOf(outputCode[0]) % 2 === 1) {
        outputCode = flipCode(outputCode.slice(0, 2)) + outputCode.slice(2, 4);
    }
    if (edgeCodeToNumber2.indexOf(outputCode[2]) % 2 === 1) {
        outputCode = outputCode.slice(0, 2) + flipCode(outputCode.slice(2, 4));
    }
    if (edgeCodeToNumber2.indexOf(outputCode[2]) > edgeCodeToNumber2.indexOf(outputCode[0])) {
        return outputCode;
    }
    if (edgeCodeToNumber2.indexOf(outputCode[0]) > edgeCodeToNumber2.indexOf(outputCode[2])) {
        return outputCode.slice(2, 4) + outputCode.slice(0, 2);
    }
    return "";
}

function flipCode(inputCode) {
    const edgeCodeToFlip = {"A": "B", "B": "A", "C": "D", "D": "C", "E": "F", "F": "E", "G": "H", "H": "G", "I": "J", "J": "I", "K": "L", "L": "K", "M": "N", "N": "M", "O": "P", "P": "O", "Q": "R", "R": "Q", "S": "T", "T": "S", "W": "X", "X": "W", "Y": "Z", "Z": "Y"};
    let outputCode = "";
    for (let i = 0; i < inputCode.length; i++) {
        outputCode = outputCode + edgeCodeToFlip[inputCode[i]];
    }
    return outputCode;
}

function algSearch() {
    let idValueOrigin = document.getElementById("edgeinput").value;
    if (typeof idValueOrigin === "undefined") {
        return;
    }
    idValueOrigin = idValueOrigin.toUpperCase();
    const id = [idValueOrigin[0], idValueOrigin[1], idValueOrigin[2]];
    let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    if (getCookie("code") !== "") {
        codecookie = getCookie("code");
    }
    for (const i in edgeChichuToNumber) {
        for (let j = 0; j <= 3; j++) {
            if (codecookie[edgeChichuToNumber[i]] === idValueOrigin[j]) {
                id[j] = i;
            }
        }
    }
    document.getElementById("edgeinput1").value = edgeCodeToPos[id[0]];
    document.getElementById("edgeinput2").value = edgeCodeToPos[id[1]];
    document.getElementById("edgeinput3").value = edgeCodeToPos[id[2]];
    document.getElementById("edgeinput4").value = edgeCodeToPos[id[3]];
    const idValue = sortByCode(`${id[0]}${id[1]}${id[2]}${id[3]}`);
    const div1 = document.getElementById("div1");
    let twoetwoeAlgToInfoNew = {};
    if (document.getElementById("isFlipped").value === "2e2eyes") {
        twoetwoeAlgToInfoNew = twoetwoeAlgToInfo2;
    } else {
        twoetwoeAlgToInfoNew = twoetwoeAlgToInfo;
    }
    if (twoetwoeAlgToInfoNew.hasOwnProperty(idValue)) {
        if (document.getElementById("edgeinput") === document.activeElement) {
            document.getElementById("edgeinput").blur();
        }
        const rows = twoetwoeAlgToInfoNew[idValue].length;
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        for (let i = 0; i < rows; i++) {
            tab += "<tr>";
            tab += `<td>${i + 1}</td>`;
            tab += `<td>${twoetwoeAlgToInfoNew[idValue][i]}</td>`;
            tab += `<td>${commutator(twoetwoeAlgToInfoNew[idValue][i])}</td>`;
            tab += `<td>${fingerbeginfrom(twoetwoeAlgToInfoNew[idValue][i])}</td>`;
            tab += "</tr>";
        }
        tab += "</tbody></table>";
        div1.innerHTML = tab;
    } else {
        div1.innerHTML = "";
    }
    const r = $("#table").width() / $("#div1").width();
    if (r > 1) {
        $("#table").css("font-size", 16 / r);
    }
}

function algSearchByPos() {
    const id = [];
    id[0] = edgePosToCode[document.getElementById("edgeinput1").value];
    id[1] = edgePosToCode[document.getElementById("edgeinput2").value];
    id[2] = edgePosToCode[document.getElementById("edgeinput3").value];
    id[3] = edgePosToCode[document.getElementById("edgeinput4").value];
    const idValue = sortByCode(`${id[0]}${id[1]}${id[2]}${id[3]}`);
    const edgeinput = [];
    if (typeof id[0] === "undefined") {
        id[0] = "";
    }
    if (typeof id[1] === "undefined") {
        id[1] = "";
    }
    if (typeof id[2] === "undefined") {
        id[2] = "";
    }
    if (typeof id[3] === "undefined") {
        id[3] = "";
    }
    let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    if (getCookie("code") !== "") {
        codecookie = getCookie("code");
    }
    for (let i = 0; i <= 3; i++) {
        if (id[i] === "") {
            edgeinput[i] = "";
        } else if (codecookie[edgeChichuToNumber[id[i]]] === "") {
            edgeinput[i] = id[i];
        } else {
            edgeinput[i] = codecookie[edgeChichuToNumber[id[i]]];
        }
    }
    document.getElementById("edgeinput").value = `${edgeinput[0]}${edgeinput[1]}${edgeinput[2]}${edgeinput[3]}`;
    const div1 = document.getElementById("div1");
    let twoetwoeAlgToInfoNew = {};
    if (document.getElementById("isFlipped").value === "2e2eyes") {
        twoetwoeAlgToInfoNew = twoetwoeAlgToInfo2;
    } else {
        twoetwoeAlgToInfoNew = twoetwoeAlgToInfo;
    }
    if (twoetwoeAlgToInfoNew.hasOwnProperty(idValue)) {
        const rows = twoetwoeAlgToInfoNew[idValue].length;
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        for (let i = 0; i < rows; i++) {
            tab += "<tr>";
            tab += `<td>${i + 1}</td>`;
            tab += `<td>${twoetwoeAlgToInfoNew[idValue][i]}</td>`;
            tab += `<td>${commutator(twoetwoeAlgToInfoNew[idValue][i])}</td>`;
            tab += `<td>${fingerbeginfrom(twoetwoeAlgToInfoNew[idValue][i])}</td>`;
            tab += "</tr>";
        }
        tab += "</tbody></table>";
        div1.innerHTML = tab;
    } else {
        div1.innerHTML = "";
    }
    const r = $("#table").width() / $("#div1").width();
    if (r > 1) {
        $("#table").css("font-size", 16 / r);
    }
}