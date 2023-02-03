"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["edgeChichuToNumber", "cornerChichuToNumber", "parityEdgeAlgToStandard", "parityCornerAlgToStandard", "parityAlgToInfo", "parityAlgToNightmare", "cornerPosToCode", "cornerCodeToPos", "edgePosToCode", "edgeCodeToPos"];
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`assets/json/${name}.json`, (json) => {
    window[`${name}`] = json;
}));

function parityToCode(str) {
    return str[0] + str[2];
}

function algSearch() {
    let idValueOrigin = document.getElementById("parityinput1").value + document.getElementById("parityinput2").value + document.getElementById("parityinput3").value + document.getElementById("parityinput4").value;
    if (typeof idValueOrigin === "undefined") {
        return;
    }
    idValueOrigin = idValueOrigin.toUpperCase();
    const id = [idValueOrigin[0], idValueOrigin[1], idValueOrigin[2], idValueOrigin[3]];
    let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    if (getCookie("code") !== "") {
        codecookie = getCookie("code");
    }
    for (const i in edgeChichuToNumber) {
        for (let j = 0; j <= 1; j++) {
            if (codecookie[edgeChichuToNumber[i]] === idValueOrigin[j]) {
                id[j] = i;
            }
        }
    }
    for (const i in cornerChichuToNumber) {
        for (let j = 2; j <= 3; j++) {
            if (codecookie[cornerChichuToNumber[i]] === idValueOrigin[j]) {
                id[j] = i;
            }
        }
    }
    document.getElementById("edgeinput1").value = edgeCodeToPos[id[0]];
    document.getElementById("edgeinput2").value = edgeCodeToPos[id[1]];
    document.getElementById("cornerinput1").value = cornerCodeToPos[id[2]];
    document.getElementById("cornerinput2").value = cornerCodeToPos[id[3]];
    const idValue = parityEdgeAlgToStandard[`${id[0]}${id[1]}`] + parityCornerAlgToStandard[`${id[2]}${id[3]}`];
    const div1 = document.getElementById("div1");
    if (parityAlgToInfo.hasOwnProperty(idValue)) {
        if (document.getElementById("parityinput1") === document.activeElement) {
            document.getElementById("parityinput1").blur();
        }
        if (document.getElementById("parityinput2") === document.activeElement) {
            document.getElementById("parityinput2").blur();
        }
        if (document.getElementById("parityinput3") === document.activeElement) {
            document.getElementById("parityinput3").blur();
        }
        if (document.getElementById("parityinput4") === document.activeElement) {
            document.getElementById("parityinput4").blur();
        }
        const rows = parityAlgToInfo[idValue].length;
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        for (let i = 0; i < rows; i++) {
            if (parityAlgToInfo[idValue][i] === parityAlgToNightmare[idValue]) {
                tab += "<tr bgcolor=\"#D0D0D0\">";
            } else {
                tab += "<tr>";
            }
            tab += `<td>${i + 1}</td>`;
            tab += `<td>${parityAlgToInfo[idValue][i]}</td>`;
            tab += `<td>${fingerbeginfrom(parityAlgToInfo[idValue][i])}</td>`;
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
    id[2] = cornerPosToCode[document.getElementById("cornerinput1").value];
    id[3] = cornerPosToCode[document.getElementById("cornerinput2").value];
    const idValueOrigin = `${id[0]}${id[1]}${id[2]}${id[3]}`;
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
    for (const i in edgeChichuToNumber) {
        for (let j = 0; j <= 1; j++) {
            if (codecookie[edgeChichuToNumber[i]] === idValueOrigin[j]) {
                id[j] = i;
            }
        }
    }
    for (const i in cornerChichuToNumber) {
        for (let j = 2; j <= 3; j++) {
            if (codecookie[cornerChichuToNumber[i]] === idValueOrigin[j]) {
                id[j] = i;
            }
        }
    }
    document.getElementById("parityinput1").value = id[0];
    document.getElementById("parityinput2").value = id[1];
    document.getElementById("parityinput3").value = id[2];
    document.getElementById("parityinput4").value = id[3];
    const idValue = parityEdgeAlgToStandard[`${id[0]}${id[1]}`] + parityCornerAlgToStandard[`${id[2]}${id[3]}`];
    const div1 = document.getElementById("div1");
    if (parityAlgToInfo.hasOwnProperty(idValue)) {
        if (document.getElementById("parityinput1") === document.activeElement) {
            document.getElementById("parityinput1").blur();
        }
        if (document.getElementById("parityinput2") === document.activeElement) {
            document.getElementById("parityinput2").blur();
        }
        if (document.getElementById("parityinput3") === document.activeElement) {
            document.getElementById("parityinput3").blur();
        }
        if (document.getElementById("parityinput4") === document.activeElement) {
            document.getElementById("parityinput4").blur();
        }
        const rows = parityAlgToInfo[idValue].length;
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        for (let i = 0; i < rows; i++) {
            if (parityAlgToInfo[idValue][i] === parityAlgToNightmare[idValue]) {
                tab += "<tr bgcolor=\"#D0D0D0\">";
            } else {
                tab += "<tr>";
            }
            tab += `<td>${i + 1}</td>`;
            tab += `<td>${parityAlgToInfo[idValue][i]}</td>`;
            tab += `<td>${fingerbeginfrom(parityAlgToInfo[idValue][i])}</td>`;
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