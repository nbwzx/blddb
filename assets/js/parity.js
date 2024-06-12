"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["edgeChichuToNumber", "cornerChichuToNumber", "parityEdgeAlgToStandard", "parityCornerAlgToStandard", "parityAlgToInfo", "parityAlgToInfoManmade", "parityAlgToNightmare", "cornerPosToCode", "cornerCodeToPos", "edgePosToCode", "edgeCodeToPos", "sourceToUrl"];
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`assets/json/${name}.json`, (json) => {
    window[`${name}`] = json;
}));

if (getCookie("paritystyle") === "") {
    setCookie("paritystyle", "nightmare", 30);
} else {
    document.getElementById("paritystyle").value = getCookie("paritystyle");
}

function switchStyle() {
    setCookie("paritystyle", document.getElementById("paritystyle").value, 30);
    algSearch();
}

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
    let paritystylecookie = "nightmare";
    if (getCookie("paritystyle") !== "") {
        paritystylecookie = getCookie("paritystyle");
    }
    for (const i in cornerChichuToNumber) {
        for (let j = 2; j <= 3; j++) {
            if (codecookie[cornerChichuToNumber[i]] === idValueOrigin[j]) {
                id[j] = i;
            }
        }
    }
    document.getElementById("edgeinput1").value = edgeCodeToPos[id[0]];
    document.getElementById("edgeinput2").value = edgeCodeToPos[id[1]];
    document.getElementById("cornerinput1").value = cornerCodeToPos[id[2]];
    document.getElementById("cornerinput2").value = cornerCodeToPos[id[3]];
    const idValue = parityEdgeAlgToStandard[`${id[0]}${id[1]}`] + parityCornerAlgToStandard[`${id[2]}${id[3]}`];
    algSearchMain(idValue, paritystylecookie);
}


function algSearchByPos() {
    const id = [];
    id[0] = edgePosToCode[document.getElementById("edgeinput1").value];
    id[1] = edgePosToCode[document.getElementById("edgeinput2").value];
    id[2] = cornerPosToCode[document.getElementById("cornerinput1").value];
    id[3] = cornerPosToCode[document.getElementById("cornerinput2").value];
    const idValueOrigin = `${id[0]}${id[1]}${id[2]}${id[3]}`;
    if (typeof id[0] === "undefined") {
        id[0] = "";
    }
    if (typeof id[1] === "undefined") {
        id[1] = "";
    }
    if (typeof id[2] === "undefined") {
        id[2] = "";
    }
    if (typeof id[3] === "undefined") {
        id[3] = "";
    }
    let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    if (getCookie("code") !== "") {
        codecookie = getCookie("code");
    }
    let paritystylecookie = "nightmare";
    if (getCookie("paritystyle") !== "") {
        paritystylecookie = getCookie("paritystyle");
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
    document.getElementById("parityinput1").value = id[0];
    document.getElementById("parityinput2").value = id[1];
    document.getElementById("parityinput3").value = id[2];
    document.getElementById("parityinput4").value = id[3];
    const idValue = parityEdgeAlgToStandard[`${id[0]}${id[1]}`] + parityCornerAlgToStandard[`${id[2]}${id[3]}`];
    algSearchMain(idValue, paritystylecookie);
}

function algSearchMain(idValue, paritystylecookie) {
    const div1 = document.getElementById("div1");
    let parityAlgToInfoStyle = {};
    let parityAlgToStyle = {};
    if (paritystylecookie === "nightmare") {
        parityAlgToInfoStyle = parityAlgToInfo;
        parityAlgToStyle = parityAlgToNightmare;
    }
    if (paritystylecookie === "manmade") {
        parityAlgToInfoStyle = parityAlgToInfoManmade;
    }
    if (parityAlgToInfoStyle.hasOwnProperty(idValue)) {
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
        const rows = parityAlgToInfoStyle[idValue].length;
        let tab = "";
        if (paritystylecookie === "manmade") {
            tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["thumbPosition"]}</th><th>${arrLang[lang]["source"]}</th></tr></thead><tbody>`;
        } else {
            tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        }
        for (let i = 0; i < rows; i++) {
            if (paritystylecookie !== "manmade" && parityAlgToInfoStyle[idValue][i] === parityAlgToStyle[idValue]) {
                tab += "<tr bgcolor=\"#D0D0D0\">";
            } else {
                tab += "<tr>";
            }
            if (paritystylecookie === "manmade") {
                const algInfo = parityAlgToInfoStyle[idValue][i][0];
                const sourceInfo = parityAlgToInfoStyle[idValue][i][1];
                tab += `<td rowspan="${algInfo.length}">${i + 1}</td>`;
                for (let j = 0; j < algInfo.length; j++) {
                    if (j === 0) {
                        tab += `<td>${algInfo[j]}</td>`;
                    } else {
                        tab += `<td style="border-left:0px">${algInfo[j]}</td>`;
                    }
                    let sourceElement = "";
                    for (const source of sourceInfo) {
                        let url = "";
                        if (source in sourceToUrl) {
                            if ("parity" in sourceToUrl[source]) {
                                url = sourceToUrl[source]["parity"];
                            } else if ("3bld" in sourceToUrl[source]) {
                                url = sourceToUrl[source]["3bld"];
                            } else if ("bld" in sourceToUrl[source]) {
                                url = sourceToUrl[source]["bld"];
                            }
                        }
                        let sourceNew = source;
                        if (source.length > 25) {
                            sourceNew = source.split("(")[0].trim();
                            if (sourceNew.length > 25) {
                                sourceNew = source.slice(0, 25) + "...";
                            }
                        }
                        if (url !== "") {
                            sourceElement = `${sourceElement}<a href="${url}" target="_blank">${sourceNew}</a>`;
                        } else {
                            sourceElement = `${sourceElement}${sourceNew}`;
                        }
                        if (source !== sourceInfo[sourceInfo.length - 1]) {
                            sourceElement += "<br>";
                        }
                    }
                    if (j === 0) {
                        tab += `<td rowspan="${algInfo.length}">${fingerbeginfrom(algInfo[j])}</td>`;
                        tab += `<td class="help" rowspan="${algInfo.length}">${sourceInfo.length} <span class="help-content">${sourceElement}</span></td>`;
                    }
                    tab += "</tr>";
                    if (j !== algInfo.length - 1) {
                        tab += "<tr>";
                    }
                }
            } else {
                tab += `<td>${i + 1}</td>`;
                tab += `<td>${parityAlgToInfoStyle[idValue][i]}</td>`;
                tab += `<td>${fingerbeginfrom(parityAlgToInfoStyle[idValue][i])}</td>`;
            }
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

function fontAwesome() {
    $("select").find("option[key='cornerStyleNightmare']").html(`&#128128; ${$("select").find("option[key='cornerStyleNightmare']").html()}`);
    $("select").find("option[key='cornerStyleManmade']").html(`&thinsp;&#xf2bd; ${$("select").find("option[key='cornerStyleManmade']").html()}`);
}