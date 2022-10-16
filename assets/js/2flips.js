"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["twoFlipsAlgToInfo", "twoFlipsAlgToNightmare", "twoFlipsPosToCode", "twoFlipsPosToNumber"];
const jsonNameDict = {};
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`assets/json/${name}.json`, (json) => {
    jsonNameDict[name] = json;
}));
Reflect.apply($.when, $, jsonLoaded).done(() => {
    for (const i of jsonNameList) {
        window[`${i}`] = jsonNameDict[i];
    }
});

function algSearch() {
    let idValue = "";
    if (twoFlipsPosToNumber[document.getElementById("edgeinput1").value] < twoFlipsPosToNumber[document.getElementById("edgeinput2").value]) {
        idValue = twoFlipsPosToCode[document.getElementById("edgeinput1").value] + twoFlipsPosToCode[document.getElementById("edgeinput2").value];
    } else {
        idValue = twoFlipsPosToCode[document.getElementById("edgeinput2").value] + twoFlipsPosToCode[document.getElementById("edgeinput1").value];
    }

    const div1 = document.getElementById("div1");
    const rows = 100;
    if (twoFlipsAlgToInfo.hasOwnProperty(idValue)) {
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        for (let i = 0; i < rows; i++) {
            if (twoFlipsAlgToInfo[idValue].length <= i) {
                break;
            }
            if (twoFlipsAlgToInfo[idValue][i] === twoFlipsAlgToNightmare[idValue]) {
                tab += "<tr bgcolor=\"#D0D0D0\">";
            } else {
                tab += "<tr>";
            }
            tab += `<td>${i + 1}</td>`;
            tab += `<td>${twoFlipsAlgToInfo[idValue][i]}</td>`;
            tab += `<td>${commutator(twoFlipsAlgToInfo[idValue][i])}</td>`;
            tab += `<td>${fingerbeginfrom(twoFlipsAlgToInfo[idValue][i])}</td>`;
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