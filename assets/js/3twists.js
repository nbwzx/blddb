"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["twoTwistsPos1ToCode", "twoTwistsPos2ToCode", "threeTwistsAlgToInfo", "threeTwistsAlgToNightmare"];
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`assets/json/${name}.json`, (json) => {
    window[`${name}`] = json;
}));

function sortByCode(x, y) {
    const cornerCodeToNumber2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "W", "M", "N", "O", "P", "Q", "R", "S", "T", "X", "Y", "Z"];
    return cornerCodeToNumber2.indexOf(x) - cornerCodeToNumber2.indexOf(y);
}

function algSearch() {
    let idValue = "";
    if (document.getElementById("cornerinput0").value === "cw") {
        idValue = twoTwistsPos1ToCode[document.getElementById("cornerinput1").value] + twoTwistsPos1ToCode[document.getElementById("cornerinput2").value] + twoTwistsPos1ToCode[document.getElementById("cornerinput3").value];
    }
    if (document.getElementById("cornerinput0").value === "ccw") {
        idValue = twoTwistsPos2ToCode[document.getElementById("cornerinput1").value] + twoTwistsPos2ToCode[document.getElementById("cornerinput2").value] + twoTwistsPos2ToCode[document.getElementById("cornerinput3").value];
    }
    if (idValue.length === 3) {
        idValue = idValue.split("").sort(sortByCode).join("");
    }
    const div1 = document.getElementById("div1");
    const rows = 50;
    if (threeTwistsAlgToInfo.hasOwnProperty(idValue)) {
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        for (let i = 0; i < rows; i++) {
            if (threeTwistsAlgToInfo[idValue].length <= i) {
                break;
            }
            if (threeTwistsAlgToInfo[idValue][i] === threeTwistsAlgToNightmare[idValue]) {
                tab += "<tr bgcolor=\"#D0D0D0\">";
            } else {
                tab += "<tr>";
            }
            tab += `<td>${i + 1}</td>`;
            tab += `<td>${threeTwistsAlgToInfo[idValue][i]}</td>`;
            tab += `<td>${fingerbeginfrom(threeTwistsAlgToInfo[idValue][i])}</td>`;
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