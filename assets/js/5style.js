"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["edgeChichuToNumber", "fiveStyleAlgToInfo1", "fiveStyleAlgToInfo2", "fiveStyleAlgToInfo3", "edgePosToCode", "edgeCodeToPos"];
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`assets/json/${name}.json`, (json) => {
    window[`${name}`] = json;
}));
const fiveStyleAlgToInfo = { ...fiveStyleAlgToInfo1, ...fiveStyleAlgToInfo2, ...fiveStyleAlgToInfo3};

function sortByCode(x) {
    const edgeCodeToNumber2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];
    for (let i = 0; i < edgeCodeToNumber2.length; i++) {
        const index = x.indexOf(edgeCodeToNumber2[i]);
        if (index > -1) {
            if (i % 2 === 0) {
                return x.slice(index, x.length) + x.slice(0, index);
            }
            return flipCode(x.slice(index, x.length) + x.slice(0, index));
        }
    }
    return "";
}

function flipCode(x) {
    const edgeCodeToFlip = {"A": "B", "B": "A", "C": "D", "D": "C", "E": "F", "F": "E", "G": "H", "H": "G", "I": "J", "J": "I", "K": "L", "L": "K", "M": "N", "N": "M", "O": "P", "P": "O", "Q": "R", "R": "Q", "S": "T", "T": "S", "W": "X", "X": "W", "Y": "Z", "Z": "Y"};
    let outCode = "";
    for (let i = 0; i < x.length; i++) {
        outCode = outCode + edgeCodeToFlip[x[i]];
    }
    return outCode;
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
        for (let j = 0; j <= 4; j++) {
            if (codecookie[edgeChichuToNumber[i]] === idValueOrigin[j]) {
                id[j] = i;
            }
        }
    }
    document.getElementById("edgeinput1").value = edgeCodeToPos[id[0]];
    document.getElementById("edgeinput2").value = edgeCodeToPos[id[1]];
    document.getElementById("edgeinput3").value = edgeCodeToPos[id[2]];
    document.getElementById("edgeinput4").value = edgeCodeToPos[id[3]];
    document.getElementById("edgeinput5").value = edgeCodeToPos[id[4]];
    const idValue = sortByCode(`${id[0]}${id[1]}${id[2]}${id[3]}${id[4]}`);
    const div1 = document.getElementById("div1");
    if (fiveStyleAlgToInfo.hasOwnProperty(idValue)) {
        if (document.getElementById("edgeinput") === document.activeElement) {
            document.getElementById("edgeinput").blur();
        }
        const rows = fiveStyleAlgToInfo[idValue].length;
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        for (let i = 0; i < rows; i++) {
            const fiveStyleAlgToInfoNew = fiveStyleAlgToInfo[idValue][i];
            tab += "<tr>";
            tab += `<td>${i + 1}</td>`;
            tab += `<td>${fiveStyleAlgToInfoNew}</td>`;
            tab += `<td>${commutator(fiveStyleAlgToInfoNew)}</td>`;
            tab += `<td>${fingerbeginfrom(fiveStyleAlgToInfoNew)}</td>`;
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
    id[4] = edgePosToCode[document.getElementById("edgeinput5").value];
    const idValue = sortByCode(`${id[0]}${id[1]}${id[2]}${id[3]}${id[4]}`);
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
    if (typeof id[4] === "undefined") {
        id[4] = "";
    }
    let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    if (getCookie("code") !== "") {
        codecookie = getCookie("code");
    }
    for (let i = 0; i <= 4; i++) {
        if (id[i] === "") {
            edgeinput[i] = "";
        } else if (codecookie[edgeChichuToNumber[id[i]]] === "") {
            edgeinput[i] = id[i];
        } else {
            edgeinput[i] = codecookie[edgeChichuToNumber[id[i]]];
        }
    }
    document.getElementById("edgeinput").value = `${edgeinput[0]}${edgeinput[1]}${edgeinput[2]}${edgeinput[3]}${edgeinput[4]}`;
    const div1 = document.getElementById("div1");
    if (fiveStyleAlgToInfo.hasOwnProperty(idValue)) {
        const rows = fiveStyleAlgToInfo[idValue].length;
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        for (let i = 0; i < rows; i++) {
            const fiveStyleAlgToInfoNew = fiveStyleAlgToInfo[idValue][i];
            tab += "<tr>";
            tab += `<td>${i + 1}</td>`;
            tab += `<td>${fiveStyleAlgToInfoNew}</td>`;
            tab += `<td>${commutator(fiveStyleAlgToInfoNew)}</td>`;
            tab += `<td>${fingerbeginfrom(fiveStyleAlgToInfoNew)}</td>`;
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