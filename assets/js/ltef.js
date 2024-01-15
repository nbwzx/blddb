"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["edgeChichuToNumber", "ltefAlgToInfo", "edgePosToCode", "edgeCodeToPos"];
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`assets/json/${name}.json`, (json) => {
    window[`${name}`] = json;
}));

function sortByCode(inputCode) {
    const edgeCodeToNumber2 = ["G", "H", "A", "B", "C", "D", "E", "F", "O", "P", "K", "L", "Q", "R", "S", "T", "Y", "Z", "I", "J", "W", "X", "M", "N"];
    let outputCode = "";
    if (edgeCodeToNumber2.indexOf(inputCode[0]) < edgeCodeToNumber2.indexOf(inputCode[1]) && edgeCodeToNumber2.indexOf(inputCode[0]) < edgeCodeToNumber2.indexOf(inputCode[2])) {
        outputCode = inputCode[0] + inputCode[1] + inputCode[2];
    }
    if (edgeCodeToNumber2.indexOf(inputCode[1]) < edgeCodeToNumber2.indexOf(inputCode[0]) && edgeCodeToNumber2.indexOf(inputCode[1]) < edgeCodeToNumber2.indexOf(inputCode[2])) {
        outputCode = flipCode(inputCode[1]) + flipCode(inputCode[2]) + inputCode[0];
    }
    if (edgeCodeToNumber2.indexOf(inputCode[2]) < edgeCodeToNumber2.indexOf(inputCode[0]) && edgeCodeToNumber2.indexOf(inputCode[2]) < edgeCodeToNumber2.indexOf(inputCode[1])) {
        outputCode = flipCode(inputCode[2]) + inputCode[0] + inputCode[1];
    }
    if (edgeCodeToNumber2.indexOf(outputCode[0]) % 2 === 1) {
        outputCode = flipCode(outputCode.slice(0, 3));
    }
    return outputCode;
}

function flipCode(inputCode) {
    if (typeof inputCode === "undefined") {
        return "";
    }
    const edgeCodeToFlip = {"A": "B", "B": "A", "C": "D", "D": "C", "E": "F", "F": "E", "G": "H", "H": "G", "I": "J", "J": "I", "K": "L", "L": "K", "M": "N", "N": "M", "O": "P", "P": "O", "Q": "R", "R": "Q", "S": "T", "T": "S", "W": "X", "X": "W", "Y": "Z", "Z": "Y"};
    let outputCode = "";
    for (let i = 0; i < inputCode.length; i++) {
        outputCode = outputCode + edgeCodeToFlip[inputCode[i]];
    }
    return outputCode;
}

function algSearch() {
    const edgeCodeToNumber2 = ["G", "H", "A", "B", "C", "D", "E", "F", "O", "P", "K", "L", "Q", "R", "S", "T", "Y", "Z", "I", "J", "W", "X", "M", "N"];
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
    if (edgeCodeToNumber2.indexOf(id[3]) % 2 === 1) {
        id[3] = flipCode(id[3]);
    }
    document.getElementById("edgeinput1").value = edgeCodeToPos[id[0]];
    document.getElementById("edgeinput2").value = edgeCodeToPos[id[1]];
    document.getElementById("edgeinput3").value = edgeCodeToPos[id[2]];
    document.getElementById("edgeinput4").value = edgeCodeToPos[id[3]];
    if (edgeCodeToNumber2.indexOf(id[3]) % 2 === 0) {
        id[3] = flipCode(id[3]);
    }
    const idValue = sortByCode(`${id[0]}${id[1]}${id[2]}`) + id[3];
    algSearchMain(idValue);
}

function algSearchByPos() {
    const id = [];
    id[0] = edgePosToCode[document.getElementById("edgeinput1").value];
    id[1] = edgePosToCode[document.getElementById("edgeinput2").value];
    id[2] = edgePosToCode[document.getElementById("edgeinput3").value];
    id[3] = flipCode(edgePosToCode[document.getElementById("edgeinput4").value]);
    const idValue = sortByCode(`${id[0]}${id[1]}${id[2]}`) + id[3];
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
    algSearchMain(idValue);
}

function algSearchMain(idValue) {
    const div1 = document.getElementById("div1");
    if (ltefAlgToInfo.hasOwnProperty(idValue)) {
        if (document.getElementById("edgeinput") === document.activeElement) {
            document.getElementById("edgeinput").blur();
        }
        const rows = ltefAlgToInfo[idValue].length;
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        for (let i = 0; i < rows; i++) {
            tab += "<tr>";
            tab += `<td>${i + 1}</td>`;
            tab += `<td>${ltefAlgToInfo[idValue][i]}</td>`;
            tab += `<td>${commutator(ltefAlgToInfo[idValue][i])}</td>`;
            tab += `<td>${fingerbeginfrom(ltefAlgToInfo[idValue][i])}</td>`;
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