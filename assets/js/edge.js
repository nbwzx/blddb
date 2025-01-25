"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["edgeChichuToNumber", "edgeAlgToStandard", "edgeAlgToInfo", "edgeAlgToNightmare", "edgeAlgToInfoManmade", "edgePosToCode", "edgeCodeToPos", "sourceToUrl"];
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`assets/json/${name}.json`, (json) => {
    window[`${name}`] = json;
}));

if (getCookie("edgestyle") === "") {
    setCookie("edgestyle", "nightmare", 400);
} else {
    document.getElementById("edgestyle").value = getCookie("edgestyle");
}

function switchStyle() {
    setCookie("edgestyle", document.getElementById("edgestyle").value, 400);
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
    algSearchMain(idValue, edgestylecookie);
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
    algSearchMain(idValue, edgestylecookie);
}

function algSearchMain(idValue, edgestylecookie) {
    const div1 = document.getElementById("div1");
    let edgeAlgToInfoStyle = {};
    let edgeAlgToStyle = {};
    if (edgestylecookie === "nightmare") {
        edgeAlgToInfoStyle = edgeAlgToInfo;
        edgeAlgToStyle = edgeAlgToNightmare;
    }
    if (edgestylecookie === "manmade") {
        edgeAlgToInfoStyle = edgeAlgToInfoManmade;
    }
    if (edgeAlgToInfoStyle.hasOwnProperty(idValue)) {
        if (document.getElementById("edgeinput") === document.activeElement) {
            document.getElementById("edgeinput").blur();
        }
        const rows = edgeAlgToInfoStyle[idValue].length;
        let tab = "";
        if (edgestylecookie === "manmade") {
            tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th><th>${arrLang[lang]["source"]}</th></tr></thead><tbody>`;
        } else {
            tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        }
        for (let i = 0; i < rows; i++) {
            if (edgestylecookie !== "manmade" && edgeAlgToInfoStyle[idValue][i] === edgeAlgToStyle[idValue]) {
                tab += "<tr bgcolor=\"#D0D0D0\">";
            } else {
                tab += "<tr>";
            }
            if (edgestylecookie === "manmade") {
                const algInfo = edgeAlgToInfoStyle[idValue][i][0];
                const sourceInfo = edgeAlgToInfoStyle[idValue][i][1];
                tab += `<td rowspan="${algInfo.length}">${i + 1}</td>`;
                for (let j = 0; j < algInfo.length; j++) {
                    if (j === 0) {
                        tab += `<td>${algInfo[j]}</td>`;
                    } else {
                        tab += `<td style="border-left:0px">${algInfo[j]}</td>`;
                    }
                    tab += `<td>${commutator(algInfo[j])}</td>`;
                    let sourceElement = "";
                    for (const source of sourceInfo) {
                        let url = "";
                        if (source in sourceToUrl) {
                            if ("edge" in sourceToUrl[source]) {
                                url = sourceToUrl[source]["edge"];
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
                tab += `<td>${edgeAlgToInfoStyle[idValue][i]}</td>`;
                tab += `<td>${commutator(edgeAlgToInfoStyle[idValue][i])}</td>`;
                tab += `<td>${fingerbeginfrom(edgeAlgToInfoStyle[idValue][i])}</td>`;
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
    $("select").find("option[key='edgeStyleNightmare']").html(`&#128128; ${$("select").find("option[key='edgeStyleNightmare']").html()}`);
    $("select").find("option[key='edgeStyleManmade']").html(`&thinsp;&#xf2bd; ${$("select").find("option[key='edgeStyleManmade']").html()}`);
}