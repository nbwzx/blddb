"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["bigbldXcenterAlgToInfoManmade", "sourceToUrl", "cornerCodeToPos", "cornerPosToCode", "bigbldXcenterChichuToNumber"];
const jsonNameListPre = {"bigbldXcenterAlgToInfoManmade":"bigbld/bigbldXcenterAlgToInfoManmade", "sourceToUrl":"sourceToUrl", "cornerCodeToPos":"cornerCodeToPos", "cornerPosToCode":"cornerPosToCode", "bigbldXcenterChichuToNumber":"bigbld/bigbldXcenterChichuToNumber"};
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`../assets/json/${jsonNameListPre[name]}.json`, (json) => {
    window[`${name}`] = json;
}));

// if (getCookie("cornerstyle") === "") {
//     setCookie("cornerstyle", "nightmare", 400);
// } else {
//     document.getElementById("cornerstyle").value = getCookie("cornerstyle");
// }

function switchStyle() {
    setCookie("cornerstyle", document.getElementById("cornerstyle").value, 400);
    algSearch();
}

function capitalizeFirstLetter(string) {
    if (typeof string === "undefined") {
        return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function algSearch() {
    let idValueOrigin = document.getElementById("cornerinput").value;
    if (typeof idValueOrigin === "undefined") {
        return;
    }
    idValueOrigin = idValueOrigin.toUpperCase();
    const id = [idValueOrigin[0], idValueOrigin[1], idValueOrigin[2]];
    let codecookie = "DEE G DEGGCCGGCAAJ A AAJWII X WIXOKKOOKOMR O MMREDD C EDCTXXTTXQLM Q LLMKHH I KHIZRRZZRZPS Z PPSBBB L BBLQSSQQSNJY N JJYHFF F HFFWYYWWYTNP T NNP";
    if (getCookie("codeBig") !== "") {
        codecookie = getCookie("codeBig");
    }
    for (const i in bigbldXcenterChichuToNumber) {
        for (let j = 0; j <= 2; j++) {
            if (codecookie[bigbldXcenterChichuToNumber[i]] === idValueOrigin[j]) {
                id[j] = i;
            }
        }
    }
    document.getElementById("cornerinput1").value = capitalizeFirstLetter(cornerCodeToPos[id[0]]);
    document.getElementById("cornerinput2").value = capitalizeFirstLetter(cornerCodeToPos[id[1]]);
    document.getElementById("cornerinput3").value = capitalizeFirstLetter(cornerCodeToPos[id[2]]);
    let idValue = `${id[0]}${id[1]}${id[2]}`;
    if (!bigbldXcenterAlgToInfoManmade.hasOwnProperty(idValue)) {
        idValue = `${id[1]}${id[2]}${id[0]}`;
    }
    if (!bigbldXcenterAlgToInfoManmade.hasOwnProperty(idValue)) {
        idValue = `${id[2]}${id[0]}${id[1]}`;
    }
    algSearchMain(idValue, "manmade");
}

function algSearchByPos() {
    const id = [];
    id[0] = cornerPosToCode[document.getElementById("cornerinput1").value.toUpperCase()];
    id[1] = cornerPosToCode[document.getElementById("cornerinput2").value.toUpperCase()];
    id[2] = cornerPosToCode[document.getElementById("cornerinput3").value.toUpperCase()];
    let idValue = `${id[0]}${id[1]}${id[2]}`;
    const cornerinput = [];
    if (typeof id[0] === "undefined") {
        id[0] = "";
    }
    if (typeof id[1] === "undefined") {
        id[1] = "";
    }
    if (typeof id[2] === "undefined") {
        id[2] = "";
    }
    let codecookie = "DEE G DEGGCCGGCAAJ A AAJWII X WIXOKKOOKOMR O MMREDD C EDCTXXTTXQLM Q LLMKHH I KHIZRRZZRZPS Z PPSBBB L BBLQSSQQSNJY N JJYHFF F HFFWYYWWYTNP T NNP";
    if (getCookie("codeBig") !== "") {
        codecookie = getCookie("codeBig");
    }
    for (let i = 0; i <= 2; i++) {
        if (id[i] === "") {
            cornerinput[i] = "";
        } else if (codecookie[bigbldXcenterChichuToNumber[id[i]]] === "") {
            cornerinput[i] = id[i];
        } else {
            cornerinput[i] = codecookie[bigbldXcenterChichuToNumber[id[i]]];
        }
    }
    document.getElementById("cornerinput").value = `${cornerinput[0]}${cornerinput[1]}${cornerinput[2]}`;
    if (!bigbldXcenterAlgToInfoManmade.hasOwnProperty(idValue)) {
        idValue = `${id[1]}${id[2]}${id[0]}`;
    }
    if (!bigbldXcenterAlgToInfoManmade.hasOwnProperty(idValue)) {
        idValue = `${id[2]}${id[0]}${id[1]}`;
    }
    algSearchMain(idValue, "manmade");
}

function algSearchMain(idValue, cornerstylecookie) {
    const div1 = document.getElementById("div1");
    if (bigbldXcenterAlgToInfoManmade.hasOwnProperty(idValue)) {
        let cornerAlgToInfoStyle = {};
        if (cornerstylecookie === "manmade") {
            cornerAlgToInfoStyle = bigbldXcenterAlgToInfoManmade;
        }
        document.getElementById("cornerinput").blur();
        const rows = cornerAlgToInfoStyle[idValue].length;
        let tab = "";
        if (cornerstylecookie === "manmade") {
            tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["source"]}</th></tr></thead><tbody>`;
        } else {
            tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th></tr></thead><tbody>`;
        }
        for (let i = 0; i < rows; i++) {
            if (cornerstylecookie !== "manmade" && cornerAlgToInfoStyle[idValue][i] === cornerAlgToStyle[idValue]) {
                tab += "<tr bgcolor=\"#D0D0D0\">";
            } else {
                tab += "<tr>";
            }
            tab += `<td>${i + 1}</td>`;
            if (cornerstylecookie === "manmade") {
                tab += `<td>${cornerAlgToInfoStyle[idValue][i][0]}</td>`;
                tab += `<td>${cornerAlgToInfoStyle[idValue][i][2]}</td>`;
                let sourceElement = "";
                for (const source of cornerAlgToInfoStyle[idValue][i][1]) {
                    let url = "";
                    if (source in sourceToUrl) {
                        if ("xcenter" in sourceToUrl[source]) {
                            url = sourceToUrl[source]["xcenter"];
                        } else if ("bigbld" in sourceToUrl[source]) {
                            url = sourceToUrl[source]["bigbld"];
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
                    if (source !== cornerAlgToInfoStyle[idValue][i][1][cornerAlgToInfoStyle[idValue][i][1].length - 1]) {
                        sourceElement += "<br>";
                    }
                }
                tab += `<td class="help">${cornerAlgToInfoStyle[idValue][i][1].length} <span class="help-content">${sourceElement}</span></td>`;
            } else {
                tab += `<td>${cornerAlgToInfoStyle[idValue][i]}</td>`;
                tab += `<td>${commutator(cornerAlgToInfoStyle[idValue][i])}</td>`;
                tab += `<td>${fingerbeginfrom(cornerAlgToInfoStyle[idValue][i])}</td>`;
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
    $("select").find("option[key='cornerStyleManmade']").html(`&thinsp;&#xf2bd; ${$("select").find("option[key='cornerStyleManmade']").html()}`);
}