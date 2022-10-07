"use strict";

const jsonNameList = ["cornerChichuToNumber", "nightmareTwoTwistsAlgToInfo"];
const jsonNameListPre = {"cornerChichuToNumber":"cornerChichuToNumber", "nightmareTwoTwistsAlgToInfo":"nightmare/nightmareTwoTwistsAlgToInfo"};
const jsonNameDict = {};
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`../assets/json/${jsonNameListPre[name]}.json`, (json) => {
    jsonNameDict[name] = json;
}));
Reflect.apply($.when, $, jsonLoaded).done(() => {
    for (const i of jsonNameList) {
        window[`${i}`] = jsonNameDict[i];
    }
    algSearch();
});

function sortByCode(x, y) {
    const cornerCodeToNumber2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "W", "M", "N", "O", "P", "Q", "R", "S", "T", "X", "Y", "Z"];
    return (cornerCodeToNumber2.indexOf(x[1]) - cornerCodeToNumber2.indexOf(y[1])) * 24 + (cornerCodeToNumber2.indexOf(x[2]) - cornerCodeToNumber2.indexOf(y[2]));
}

function algSearch() {
    let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["nightmareLetters"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
    const cornerinput = [];
    let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    if (getCookie("code") !== "") {
        codecookie = getCookie("code");
    }
    for (const algi in nightmareTwoTwistsAlgToInfo) {
        for (let i = 0; i <= 1; i++) {
            if (algi[i] === "") {
                cornerinput[i] = "";
            } else if (codecookie[cornerChichuToNumber[algi[i]]] === "") {
                cornerinput[i] = algi[i];
            } else {
                cornerinput[i] = codecookie[cornerChichuToNumber[algi[i]]];
            }
        }
        tab += "<tr>";
        tab += `<td>${`${cornerinput[0]}${cornerinput[1]}`}</td>`;
        tab += `<td>${nightmareTwoTwistsAlgToInfo[algi].algorithm}</td>`;
        tab += `<td>${nightmareTwoTwistsAlgToInfo[algi].commutator}</td>`;
        tab += `<td>${fingerbeginfrom(nightmareTwoTwistsAlgToInfo[algi].algorithm)}</td>`;
        tab += "</tr>";
    }
    tab += "</tbody></table>";
    div1.innerHTML = tab;
    const r = $("#table").width() / $("#div1").width();
    if (r > 1) {
        $("#table").css("font-size", 16 / r);
    }
}