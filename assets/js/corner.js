"use strict";

const cornerNumberToChichu = JSON.parse($.getJSON({"url": "assets/json/cornerNumberToChichu.json", "async": false}).responseText);
const cornerChichuToNumber = JSON.parse($.getJSON({"url": "assets/json/cornerChichuToNumber.json", "async": false}).responseText);
const cornerAlgToStandard = JSON.parse($.getJSON({"url": "assets/json/cornerAlgToStandard.json", "async": false}).responseText);
const cornerAlgToInfo = JSON.parse($.getJSON({"url": "assets/json/cornerAlgToInfo.json", "async": false}).responseText);
const cornerAlgToNightmare = JSON.parse($.getJSON({"url": "assets/json/cornerAlgToNightmare.json", "async": false}).responseText);
const cornerAlgToInfoYuanzi = JSON.parse($.getJSON({"url": "assets/json/cornerAlgToInfoYuanzi.json", "async": false}).responseText);
const cornerAlgToYuanzi = JSON.parse($.getJSON({"url": "assets/json/cornerAlgToYuanzi.json", "async": false}).responseText);
const cornerPosToCode = JSON.parse($.getJSON({"url": "assets/json/cornerPosToCode.json", "async": false}).responseText);
const cornerCodeToPos = JSON.parse($.getJSON({"url": "assets/json/cornerCodeToPos.json", "async": false}).responseText);

function algSearch() {
    let idValueOrigin = document.getElementById("cornerinput").value;
    if (typeof idValueOrigin === "undefined") {
        return;
    }
    idValueOrigin = idValueOrigin.toUpperCase();
    const id = [idValueOrigin[0], idValueOrigin[1], idValueOrigin[2]];
    let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    if (getCookie("code") !== "") {
        codecookie = getCookie("code");
    }
    for (const i in cornerChichuToNumber) {
        for (let j = 0; j <= 2; j++) {
            if (codecookie[cornerChichuToNumber[i]] === idValueOrigin[j]) {
                id[j] = i;
            }
        }
    }
    document.getElementById("cornerinput1").value = cornerCodeToPos[id[0]];
    document.getElementById("cornerinput2").value = cornerCodeToPos[id[1]];
    document.getElementById("cornerinput3").value = cornerCodeToPos[id[2]];
    const idValue = cornerAlgToStandard[`${id[0]}${id[1]}${id[2]}`];
    const div1 = document.getElementById("div1");
    const rows = 18;
    if (cornerAlgToInfo.hasOwnProperty(idValue)) {
        let cornerAlgToInfoStyle = {};
        let cornerAlgToStyle = {};
        if (document.getElementById("cornerstyle").value === "nightmare") {
            cornerAlgToInfoStyle = cornerAlgToInfo;
            cornerAlgToStyle = cornerAlgToNightmare;
        }
        if (document.getElementById("cornerstyle").value === "yuanzi") {
            cornerAlgToInfoStyle = cornerAlgToInfoYuanzi;
            cornerAlgToStyle = cornerAlgToYuanzi;
        }
        document.getElementById("cornerinput").blur();
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        for (let i = 0; i < rows; i++) {
            if (cornerAlgToInfoStyle[idValue].length <= i) {
                break;
            }
            if (cornerAlgToInfoStyle[idValue][i] === cornerAlgToStyle[idValue]) {
                tab += "<tr bgcolor=\"#D0D0D0\">";
            } else {
                tab += "<tr>";
            }
            tab += `<td>${i + 1}</td>`;
            tab += `<td>${cornerAlgToInfoStyle[idValue][i]}</td>`;
            tab += `<td>${commutator(cornerAlgToInfoStyle[idValue][i])}</td>`;
            tab += `<td>${fingerbeginfrom(cornerAlgToInfoStyle[idValue][i])}</td>`;
            tab += "</tr>";
        }
        tab += "</tbody></table>";
        div1.innerHTML = tab;
    } else {
        div1.innerHTML = "";
    }
}

function algSearchByPos() {
    const id = [];
    id[0] = cornerPosToCode[document.getElementById("cornerinput1").value];
    id[1] = cornerPosToCode[document.getElementById("cornerinput2").value];
    id[2] = cornerPosToCode[document.getElementById("cornerinput3").value];
    const idValue = cornerAlgToStandard[`${id[0]}${id[1]}${id[2]}`];
    const cornerinput = [];
    if (typeof id[0] === "undefined") {
        id[0] = "";
    }
    if (typeof id[1] === "undefined") {
        id[1] = "";
    }
    if (typeof id[2] === "undefined") {
        id[2] = "";
    }
    let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    if (getCookie("code") !== "") {
        codecookie = getCookie("code");
    }
    for (let i = 0; i <= 2; i++) {
        if (id[i] === "") {
            cornerinput[i] = "";
        } else if (codecookie[cornerChichuToNumber[id[i]]] === "") {
            cornerinput[i] = id[i];
        } else {
            cornerinput[i] = codecookie[cornerChichuToNumber[id[i]]];
        }
    }
    document.getElementById("cornerinput").value = `${cornerinput[0]}${cornerinput[1]}${cornerinput[2]}`;
    const div1 = document.getElementById("div1");
    const rows = 18;
    if (cornerAlgToInfo.hasOwnProperty(idValue)) {
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        for (let i = 0; i < rows; i++) {
            if (cornerAlgToInfo[idValue][i] === "") {
                break;
            }
            if (cornerAlgToInfo[idValue][i] === cornerAlgToNightmare[idValue]) {
                tab += "<tr bgcolor=\"#D0D0D0\">";
            } else {
                tab += "<tr>";
            }
            tab += `<td>${i + 1}</td>`;
            tab += `<td>${cornerAlgToInfo[idValue][i]}</td>`;
            tab += `<td>${commutator(cornerAlgToInfo[idValue][i])}</td>`;
            tab += `<td>${fingerbeginfrom(cornerAlgToInfo[idValue][i])}</td>`;
            tab += "</tr>";
        }
        tab += "</tbody></table>";
        div1.innerHTML = tab;
    } else {
        div1.innerHTML = "";
    }
}