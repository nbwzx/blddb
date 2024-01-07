"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["edgeChichuToNumber", "edgeAlgToStandard", "edgeAlgToInfo", "edgeAlgToNightmare", "edgeAlgToInfoManmade", "edgePosToCode", "edgeCodeToPos", "sourceToUrl"];
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`assets/json/${name}.json`, (json) => {
    window[`${name}`] = json;
}));

if (getCookie("edgestyle") === "") {
    setCookie("edgestyle", "nightmare", 30);
} else {
    document.getElementById("edgestyle").value = getCookie("edgestyle");
}

function switchStyle() {
    setCookie("edgestyle", document.getElementById("edgestyle").value, 30);
    algSearch();
}

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
    let edgestylecookie = "nightmare";
    if (getCookie("edgestyle") !== "") {
        edgestylecookie = getCookie("edgestyle");
    }
    document.getElementById("edgeinput1").value = edgeCodeToPos[id[0]];
    document.getElementById("edgeinput2").value = edgeCodeToPos[id[1]];
    document.getElementById("edgeinput3").value = edgeCodeToPos[id[2]];
    let idValue = edgeAlgToStandard[`${id[0]}${id[1]}${id[2]}`];
    const setup = arrayToStr(algToArray(document.getElementById("edgesetup").value));
    if (setup.length > 0 && edgeAlgToInfo.hasOwnProperty(idValue)) {
        const edgefullstr = edgefull(arrayToStr(algToArray(`${arrayToStr(invert(algToArray(setup)))} ${edgeAlgToNightmare[idValue]} ${setup}`)));
        idValue = edgeAlgToStandard[edgefullstr[0] + edgefullstr[2] + edgefullstr[1]];
    }
    algSearchMain(idValue, setup, id, edgestylecookie);
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
    let edgestylecookie = "nightmare";
    if (getCookie("edgestyle") !== "") {
        edgestylecookie = getCookie("edgestyle");
    }
    document.getElementById("edgeinput").value = `${edgeinput[0]}${edgeinput[1]}${edgeinput[2]}`;
    const setup = arrayToStr(algToArray(document.getElementById("edgesetup").value));
    if (setup.length > 0 && edgeAlgToInfo.hasOwnProperty(idValue)) {
        const edgefullstr = edgefull(arrayToStr(algToArray(`${arrayToStr(invert(algToArray(setup)))} ${edgeAlgToNightmare[idValue]} ${setup}`)));
        idValue = edgeAlgToStandard[edgefullstr[0] + edgefullstr[2] + edgefullstr[1]];
    }
    algSearchMain(idValue, setup, id, edgestylecookie);
}

function algSearchMain(idValue, setup, id, edgestylecookie) {
    const div1 = document.getElementById("div1");
    if (edgeAlgToInfo.hasOwnProperty(idValue)) {
        let edgeAlgToInfoStyle = {};
        if (edgestylecookie === "nightmare") {
            edgeAlgToInfoStyle = edgeAlgToInfo;
        }
        const singleList = [];
        const groupedValues = {};
        if (edgestylecookie === "manmade") {
            edgeAlgToInfoStyle = edgeAlgToInfoManmade;
            for (let i = 0; i < edgeAlgToInfoStyle[idValue].length; i++) {
                const originalValue = edgeAlgToInfoStyle[idValue][i];
                const singleValue = single(originalValue[0]);
                // Check if the singleValue is already in the groupedValues object
                if (groupedValues.hasOwnProperty(singleValue)) {
                    groupedValues[singleValue].push(originalValue);
                } else {
                    groupedValues[singleValue] = [originalValue];
                    singleList.push(singleValue);
                }
            }
        }
        if (document.getElementById("edgeinput") === document.activeElement) {
            document.getElementById("edgeinput").blur();
        }
        let rows = edgeAlgToInfoStyle[idValue].length;
        if (edgestylecookie === "manmade") {
            rows = singleList.length;
        }
        let tab = "";
        let inew = 0;
        for (let i = 0; i < rows; i++) {
            let edgeAlgToInfoNew = "";
            if (setup.length > 0) {
                if (edgestylecookie === "manmade") {
                    div1.innerHTML = "";
                    return;
                }
                edgeAlgToInfoNew = arrayToStr(algToArray(`${setup} ${edgeAlgToInfoStyle[idValue][i]} ${arrayToStr(invert(algToArray(setup)))}`));
                if (isnightmare(edgeAlgToInfoNew) === 0) {
                    continue;
                }
                if (stm(edgeAlgToInfoNew) + 1 < stm(arrayToStr(algToArray(`${edgeAlgToInfoStyle[idValue][i]} ${arrayToStr(invert(algToArray(setup)))}`))) + stm(setup)) {
                    continue;
                }
                inew = inew + 1;
            } else {
                edgeAlgToInfoNew = edgeAlgToInfoStyle[idValue][i];
                inew = inew + 1;
            }
            if (edgestylecookie !== "manmade" && edgeAlgToInfoNew === edgeAlgToNightmare[edgeAlgToStandard[`${id[0]}${id[1]}${id[2]}`]]) {
                tab += "<tr bgcolor=\"#D0D0D0\">";
            } else {
                tab += "<tr>";
            }
            if (edgestylecookie === "manmade") {
                tab += `<td rowspan="${groupedValues[singleList[i]].length}">${inew}</td>`;
                const mergedSource = [];
                for (let j = 0; j < groupedValues[singleList[i]].length; j++) {
                    for (const source of groupedValues[singleList[i]][j][1]) {
                        if (!mergedSource.includes(source)) {
                            mergedSource.push(source);
                        }
                    }
                }
                mergedSource.sort();
                for (let j = 0; j < groupedValues[singleList[i]].length; j++) {
                    if (j === 0) {
                        tab += `<td>${groupedValues[singleList[i]][j][0]}</td>`;
                    } else {
                        tab += `<td style="border-left:0px">${groupedValues[singleList[i]][j][0]}</td>`;
                    }
                    tab += `<td>${commutator(groupedValues[singleList[i]][j][0])}</td>`;
                    let sourceElement = "";
                    for (const source of mergedSource) {
                        if (source in sourceToUrl) {
                            sourceElement = `${sourceElement}<a href="${sourceToUrl[source][0]}" target="_blank">${source}</a>`;
                        } else {
                            sourceElement = `${sourceElement}${source}`;
                        }
                        if (source !== mergedSource[mergedSource.length - 1]) {
                            sourceElement += "<br>";
                        }
                    }
                    if (j === 0) {
                        tab += `<td rowspan="${groupedValues[singleList[i]].length}">${fingerbeginfrom(groupedValues[singleList[i]][j][0])}</td>`;
                        tab += `<td class="help" rowspan="${groupedValues[singleList[i]].length}">${mergedSource.length} <span class="help-content">${sourceElement}</span></td>`;
                    }
                    tab += "</tr>";
                    if (j !== groupedValues[singleList[i]].length - 1) {
                        tab += "<tr>";
                    }
                }
            } else {
                tab += `<td>${inew}</td>`;
                tab += `<td>${edgeAlgToInfoNew}</td>`;
                tab += `<td>${commutator(edgeAlgToInfoNew)}</td>`;
                tab += `<td>${fingerbeginfrom(edgeAlgToInfoNew)}</td>`;
                tab += "</tr>";
            }
        }
        if (tab !== "") {
            if (edgestylecookie === "manmade") {
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

function fontAwesome() {
    $("select").find("option[key='edgeStyleNightmare']").html(`&#128128; ${$("select").find("option[key='edgeStyleNightmare']").html()}`);
    $("select").find("option[key='edgeStyleManmade']").html(`&thinsp;&#xf2bd; ${$("select").find("option[key='edgeStyleManmade']").html()}`);
}