"use strict";

const jsonNameList = ["edgeChichuToNumber", "cornerChichuToNumber", "parityEdgeAlgToStandard", "parityCornerAlgToStandard", "parityAlgToInfo", "parityAlgToNightmare"];
const jsonNameDict = {};
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`assets/json/${name}.json`, (json) => {
    jsonNameDict[name] = json;
}));
Reflect.apply($.when, $, jsonLoaded).done(() => {
    for (const i of jsonNameList) {
        window[`${i}`] = jsonNameDict[i];
    }
});

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
    const idValue = parityEdgeAlgToStandard[`${id[0]}${id[1]}`] + parityCornerAlgToStandard[`${id[2]}${id[3]}`];
    const div1 = document.getElementById("div1");
    const rows = 18;
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
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        for (let i = 0; i < rows; i++) {
            if (parityAlgToInfo[idValue].length <= i) {
                break;
            }
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
}