"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["cornerChichuToNumber", "cornerAlgToStandard", "cornerPosToCode", "nightmareCornerAlgToInfo"];
const jsonNameListPre = {"cornerChichuToNumber":"cornerChichuToNumber", "cornerAlgToStandard":"cornerAlgToStandard", "cornerPosToCode":"cornerPosToCode", "nightmareCornerAlgToInfo":"nightmare/nightmareCornerAlgToInfo"};
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`../assets/json/${jsonNameListPre[name]}.json`, (json) => {
    window[`${name}`] = json;
}));
algSearch();

function sortByCode(x, y) {
    const cornerCodeToNumber2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "W", "M", "N", "O", "P", "Q", "R", "S", "T", "X", "Y", "Z"];
    return (cornerCodeToNumber2.indexOf(x[1]) - cornerCodeToNumber2.indexOf(y[1])) * 24 + (cornerCodeToNumber2.indexOf(x[2]) - cornerCodeToNumber2.indexOf(y[2]));
}

function algSearch() {
    const buffer = document.getElementById("cornerinput").value;
    const cornerinput = [];
    let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    if (getCookie("code") !== "") {
        codecookie = getCookie("code");
    }
    if (buffer === "") {
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["nightmareLetters"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        for (const algi in nightmareCornerAlgToInfo) {
            for (let i = 0; i <= 2; i++) {
                if (algi[i] === "") {
                    cornerinput[i] = "";
                } else if (codecookie[cornerChichuToNumber[algi[i]]] === "") {
                    cornerinput[i] = algi[i];
                } else {
                    cornerinput[i] = codecookie[cornerChichuToNumber[algi[i]]];
                }
            }
            tab += "<tr>";
            tab += `<td>${`${cornerinput[0]}${cornerinput[1]}${cornerinput[2]}`}</td>`;
            tab += `<td>${nightmareCornerAlgToInfo[algi].algorithm}</td>`;
            tab += `<td>${nightmareCornerAlgToInfo[algi].commutator}</td>`;
            tab += `<td>${fingerbeginfrom(nightmareCornerAlgToInfo[algi].algorithm)}</td>`;
            tab += "</tr>";
        }
        tab += "</tbody></table>";
        div1.innerHTML = tab;
    } else {
        const bufferPos = cornerPosToCode[buffer];
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["nightmareLetters"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        const algList = [];
        for (const alg in cornerAlgToStandard) {
            if (alg[0] === bufferPos) {
                algList.push(alg);
            }
        }
        algList.sort(sortByCode);
        for (const alg of algList) {
            const algi = cornerAlgToStandard[alg];
            const algdisplay = alg.slice(1, 3);
            for (let i = 0; i <= 1; i++) {
                if (algdisplay[i] === "") {
                    cornerinput[i] = "";
                } else if (codecookie[cornerChichuToNumber[algdisplay[i]]] === "") {
                    cornerinput[i] = algdisplay[i];
                } else {
                    cornerinput[i] = codecookie[cornerChichuToNumber[algdisplay[i]]];
                }
            }
            tab += "<tr>";
            tab += `<td>${`${cornerinput[0]}${cornerinput[1]}`}</td>`;
            tab += `<td>${nightmareCornerAlgToInfo[algi].algorithm}</td>`;
            tab += `<td>${nightmareCornerAlgToInfo[algi].commutator}</td>`;
            tab += `<td>${fingerbeginfrom(nightmareCornerAlgToInfo[algi].algorithm)}</td>`;
            tab += "</tr>";
        }
        tab += "</tbody></table>";
        div1.innerHTML = tab;
    }
    const r = $("#table").width() / $("#div1").width();
    if (r > 1) {
        $("#table").css("font-size", 16 / r);
    }
}