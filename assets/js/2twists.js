"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["twoTwistsAlgToInfo", "twoTwistsPos1ToCode", "twoTwistsPos2ToCode", "twoTwistsAlgToNightmare"];
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
    const idValue = twoTwistsPos1ToCode[document.getElementById("cornerinput1").value] + twoTwistsPos2ToCode[document.getElementById("cornerinput2").value];
    const div1 = document.getElementById("div1");
    const rows = 18;
    if (twoTwistsAlgToInfo.hasOwnProperty(idValue)) {
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        for (let i = 0; i < rows; i++) {
            if (twoTwistsAlgToInfo[idValue].length <= i) {
                break;
            }
            if (twoTwistsAlgToInfo[idValue][i] === twoTwistsAlgToNightmare[idValue]) {
                tab += "<tr bgcolor=\"#D0D0D0\">";
            } else {
                tab += "<tr>";
            }
            tab += `<td>${i + 1}</td>`;
            tab += `<td>${twoTwistsAlgToInfo[idValue][i]}</td>`;
            tab += `<td>${commutator(twoTwistsAlgToInfo[idValue][i])}</td>`;
            tab += `<td>${fingerbeginfrom(twoTwistsAlgToInfo[idValue][i])}</td>`;
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