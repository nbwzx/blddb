"use strict";

const edgeChichuToNumber = JSON.parse($.getJSON({"url": "../assets/json/edgeChichuToNumber.json", "async": false}).responseText);
const nightmareTwoFlipsAlgToInfo = JSON.parse($.getJSON({"url": "../assets/json/nightmare/nightmareTwoFlipsAlgToInfo.json", "async": false}).responseText);

function sortByCode(x, y) {
    const edgeCodeToNumber2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];
    return edgeCodeToNumber2.indexOf(x[1]) - edgeCodeToNumber2.indexOf(y[1]);
}

function algSearch() {
    let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["nightmareLetters"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
    const edgeinput = [];
    let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    if (getCookie("code") !== "") {
        codecookie = getCookie("code");
    }
    for (const algi in nightmareTwoFlipsAlgToInfo) {
        for (let i = 0; i <= 1; i++) {
            if (algi[i] === "") {
                edgeinput[i] = "";
            } else if (codecookie[edgeChichuToNumber[algi[i]]] === "") {
                edgeinput[i] = algi[i];
            } else {
                edgeinput[i] = codecookie[edgeChichuToNumber[algi[i]]];
            }
        }
        tab += "<tr>";
        tab += `<td>${`${edgeinput[0]}${edgeinput[1]}`}</td>`;
        tab += `<td>${nightmareTwoFlipsAlgToInfo[algi].algorithm}</td>`;
        tab += `<td>${nightmareTwoFlipsAlgToInfo[algi].commutator}</td>`;
        tab += `<td>${fingerbeginfrom(nightmareTwoFlipsAlgToInfo[algi].algorithm)}</td>`;
        tab += "</tr>";
    }
    tab += "</tbody></table>";
    div1.innerHTML = tab;
}

window.onload = function onload() {
    algSearch();
};