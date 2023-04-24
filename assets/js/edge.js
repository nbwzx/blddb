"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["edgeNumberToChichu", "edgeChichuToNumber", "edgeAlgToStandard", "edgeAlgToInfo", "edgeAlgToNightmare", "edgeAlgToInfoManmade", "edgePosToCode", "edgeCodeToPos"];
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`assets/json/${name}.json`, (json) => {
    window[`${name}`] = json;
}));

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
        for (let j = 0; j <= 2; j++) {
            if (codecookie[edgeChichuToNumber[i]] === idValueOrigin[j]) {
                id[j] = i;
            }
        }
    }
    document.getElementById("edgeinput1").value = edgeCodeToPos[id[0]];
    document.getElementById("edgeinput2").value = edgeCodeToPos[id[1]];
    document.getElementById("edgeinput3").value = edgeCodeToPos[id[2]];
    let idValue = edgeAlgToStandard[`${id[0]}${id[1]}${id[2]}`];
    const div1 = document.getElementById("div1");
    const setup = arrayToStr(algToArray(document.getElementById("edgesetup").value));
    if (setup.length > 0 && edgeAlgToInfo.hasOwnProperty(idValue)) {
        const edgefullstr = edgefull(arrayToStr(algToArray(`${arrayToStr(invert(algToArray(setup)))} ${edgeAlgToNightmare[idValue]} ${setup}`)));
        idValue = edgeAlgToStandard[edgefullstr[0] + edgefullstr[2] + edgefullstr[1]];
    }
    if (edgeAlgToInfo.hasOwnProperty(idValue)) {
        let edgeAlgToInfoMode = {};
        if (document.getElementById("edgemode").value === "brute") {
            edgeAlgToInfoMode = edgeAlgToInfo;
        }
        if (document.getElementById("edgemode").value === "manmade") {
            edgeAlgToInfoMode = edgeAlgToInfoManmade;
        }
        if (document.getElementById("edgeinput") === document.activeElement) {
            document.getElementById("edgeinput").blur();
        }
        const rows = edgeAlgToInfoMode[idValue].length;
        let tab = "";
        let inew = 0;
        for (let i = 0; i < rows; i++) {
            let edgeAlgToInfoNew = "";
            if (setup.length > 0) {
                if (document.getElementById("edgemode").value === "manmade") {
                    div1.innerHTML = "";
                    return;
                }
                edgeAlgToInfoNew = arrayToStr(algToArray(`${setup} ${edgeAlgToInfoMode[idValue][i]} ${arrayToStr(invert(algToArray(setup)))}`));
                if (isnightmare(edgeAlgToInfoNew) === 0) {
                    continue;
                }
                if (stm(edgeAlgToInfoNew) + 1 < stm(arrayToStr(algToArray(`${edgeAlgToInfoMode[idValue][i]} ${arrayToStr(invert(algToArray(setup)))}`))) + stm(setup)) {
                    continue;
                }
                inew = inew + 1;
            } else {
                edgeAlgToInfoNew = edgeAlgToInfoMode[idValue][i];
                inew = inew + 1;
            }
            if (document.getElementById("edgemode").value !== "manmade" && edgeAlgToInfoNew === edgeAlgToNightmare[edgeAlgToStandard[`${id[0]}${id[1]}${id[2]}`]]) {
                tab += "<tr bgcolor=\"#D0D0D0\">";
            } else {
                tab += "<tr>";
            }
            if (document.getElementById("edgemode").value === "manmade") {
                tab += `<td>${inew}</td>`;
                tab += `<td>${edgeAlgToInfoMode[idValue][i][0]}</td>`;
                tab += `<td>${commutator(edgeAlgToInfoMode[idValue][i][0])}</td>`;
                tab += `<td>${fingerbeginfrom(edgeAlgToInfoMode[idValue][i][0])}</td>`;
                tab += `<td class="help">${edgeAlgToInfoMode[idValue][i][1].length} <span class="help-content">${edgeAlgToInfoMode[idValue][i][1].join("<br>")}</span></td>`;
            } else {
                tab += `<td>${inew}</td>`;
                tab += `<td>${edgeAlgToInfoNew}</td>`;
                tab += `<td>${commutator(edgeAlgToInfoNew)}</td>`;
                tab += `<td>${fingerbeginfrom(edgeAlgToInfoNew)}</td>`;
                tab += "</tr>";
            }
        }
        if (tab !== "") {
            if (document.getElementById("edgemode").value === "manmade") {
                tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th><th>${arrLang[lang]["source"]}</th></tr></thead><tbody>${tab}</tbody></table>`;
            } else {
                tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>${tab}</tbody></table>`;
            }
        }
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
    let idValue = edgeAlgToStandard[`${id[0]}${id[1]}${id[2]}`];
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
    let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    if (getCookie("code") !== "") {
        codecookie = getCookie("code");
    }
    for (let i = 0; i <= 2; i++) {
        if (id[i] === "") {
            edgeinput[i] = "";
        } else if (codecookie[edgeChichuToNumber[id[i]]] === "") {
            edgeinput[i] = id[i];
        } else {
            edgeinput[i] = codecookie[edgeChichuToNumber[id[i]]];
        }
    }
    document.getElementById("edgeinput").value = `${edgeinput[0]}${edgeinput[1]}${edgeinput[2]}`;
    const div1 = document.getElementById("div1");
    const setup = arrayToStr(algToArray(document.getElementById("edgesetup").value));
    if (setup.length > 0 && edgeAlgToInfo.hasOwnProperty(idValue)) {
        const edgefullstr = edgefull(arrayToStr(algToArray(`${arrayToStr(invert(algToArray(setup)))} ${edgeAlgToNightmare[idValue]} ${setup}`)));
        idValue = edgeAlgToStandard[edgefullstr[0] + edgefullstr[2] + edgefullstr[1]];
    }
    if (edgeAlgToInfo.hasOwnProperty(idValue)) {
        let edgeAlgToInfoMode = {};
        if (document.getElementById("edgemode").value === "brute") {
            edgeAlgToInfoMode = edgeAlgToInfo;
        }
        if (document.getElementById("edgemode").value === "manmade") {
            edgeAlgToInfoMode = edgeAlgToInfoManmade;
        }
        const rows = edgeAlgToInfoMode[idValue].length;
        let tab = "";
        let inew = 0;
        for (let i = 0; i < rows; i++) {
            let edgeAlgToInfoNew = "";
            if (setup.length > 0) {
                if (document.getElementById("edgemode").value === "manmade") {
                    div1.innerHTML = "";
                    return;
                }
                edgeAlgToInfoNew = arrayToStr(algToArray(`${setup} ${edgeAlgToInfoMode[idValue][i]} ${arrayToStr(invert(algToArray(setup)))}`));
                if (isnightmare(edgeAlgToInfoNew) === 0) {
                    continue;
                }
                if (stm(edgeAlgToInfoNew) + 1 < stm(arrayToStr(algToArray(`${edgeAlgToInfoMode[idValue][i]} ${arrayToStr(invert(algToArray(setup)))}`))) + stm(setup)) {
                    continue;
                }
                inew = inew + 1;
            } else {
                edgeAlgToInfoNew = edgeAlgToInfoMode[idValue][i];
                inew = inew + 1;
            }
            if (document.getElementById("edgemode").value !== "manmade" && edgeAlgToInfoNew === edgeAlgToNightmare[edgeAlgToStandard[`${id[0]}${id[1]}${id[2]}`]]) {
                tab += "<tr bgcolor=\"#D0D0D0\">";
            } else {
                tab += "<tr>";
            }
            if (document.getElementById("edgemode").value === "manmade") {
                tab += `<td>${inew}</td>`;
                tab += `<td>${edgeAlgToInfoMode[idValue][i][0]}</td>`;
                tab += `<td>${commutator(edgeAlgToInfoMode[idValue][i][0])}</td>`;
                tab += `<td>${fingerbeginfrom(edgeAlgToInfoMode[idValue][i][0])}</td>`;
                tab += `<td class="help">${edgeAlgToInfoMode[idValue][i][1].length} <span class="help-content">${edgeAlgToInfoMode[idValue][i][1].join("<br>")}</span></td>`;
            } else {
                tab += `<td>${inew}</td>`;
                tab += `<td>${edgeAlgToInfoNew}</td>`;
                tab += `<td>${commutator(edgeAlgToInfoNew)}</td>`;
                tab += `<td>${fingerbeginfrom(edgeAlgToInfoNew)}</td>`;
                tab += "</tr>";
            }
        }
        if (tab !== "") {
            if (document.getElementById("edgemode").value === "manmade") {
                tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th><th>${arrLang[lang]["source"]}</th></tr></thead><tbody>${tab}</tbody></table>`;
            } else {
                tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>${tab}</tbody></table>`;
            }
        }
        div1.innerHTML = tab;
    } else {
        div1.innerHTML = "";
    }
    const r = $("#table").width() / $("#div1").width();
    if (r > 1) {
        $("#table").css("font-size", 16 / r);
    }
}

function isnightmare(s1) {
    const regString = /^[RUDFBEMSru0-9 ']*$/gu;
    const regPos = /^[0-9]*$/gu;
    if (fingerbeginfrom(s1) !== "" && stm(s1) <= 16 && qtm(s1) <= 18 && count(s1, "R") <= 8 && count(s1, "U") <= 8 && count(s1, "D") <= 6 && count(s1, "F") <= 4 && count(s1, "B") <= 4 && count(s1, "E") <= 4 && count(s1, "M") <= 5 && count(s1, "S") <= 6 && count(s1, "r") <= 4 && count(s1, "u") <= 3 && count(s1, "R2") <= 6 && count(s1, "U2") <= 4 && count(s1, "D2") <= 2 && count(s1, "F2") <= 2 && count(s1, "B2") <= 2 && count(s1, "E2") <= 2 && count(s1, "M2") <= 2 && count(s1, "S2") <= 2 && count(s1, "r2") <= 1 && count(s1, "u2") <= 2 && count(s1, "E") + count(s1, "M") + count(s1, "S") <= 6 && count(s1, "r") + count(s1, "u") <= 4 && regString.test(s1) && regPos.test(s1[0]) === false) {
        return 1;
    }
    return 0;
}