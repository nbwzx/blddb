"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["bigbldTcenterAlgToInfoManmade", "sourceToUrl", "edgeCodeToPos", "edgePosToCode", "bigbldTcenterChichuToNumber"];
const jsonNameListPre = {"bigbldTcenterAlgToInfoManmade":"bigbld/bigbldTcenterAlgToInfoManmade", "sourceToUrl":"sourceToUrl", "edgeCodeToPos":"edgeCodeToPos", "edgePosToCode":"edgePosToCode", "bigbldTcenterChichuToNumber":"bigbld/bigbldTcenterChichuToNumber"};
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`../assets/json/${jsonNameListPre[name]}.json`, (json) => {
    window[`${name}`] = json;
}));

// if (getCookie("cornerstyle") === "") {
//     setCookie("cornerstyle", "nightmare", 30);
// } else {
//     document.getElementById("cornerstyle").value = getCookie("cornerstyle");
// }

function switchStyle() {
    setCookie("cornerstyle", document.getElementById("cornerstyle").value, 30);
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
    for (const i in bigbldTcenterChichuToNumber) {
        for (let j = 0; j <= 2; j++) {
            if (codecookie[bigbldTcenterChichuToNumber[i]] === idValueOrigin[j]) {
                id[j] = i;
            }
        }
    }
    document.getElementById("cornerinput1").value = capitalizeFirstLetter(edgeCodeToPos[id[0]]);
    document.getElementById("cornerinput2").value = capitalizeFirstLetter(edgeCodeToPos[id[1]]);
    document.getElementById("cornerinput3").value = capitalizeFirstLetter(edgeCodeToPos[id[2]]);
    let idValue = `${id[0]}${id[1]}${id[2]}`;
    if (!bigbldTcenterAlgToInfoManmade.hasOwnProperty(idValue)) {
        idValue = `${id[1]}${id[2]}${id[0]}`;
    }
    if (!bigbldTcenterAlgToInfoManmade.hasOwnProperty(idValue)) {
        idValue = `${id[2]}${id[0]}${id[1]}`;
    }
    algSearchMain(idValue, "manmade");
}

function algSearchByPos() {
    const id = [];
    id[0] = edgePosToCode[document.getElementById("cornerinput1").value.toUpperCase()];
    id[1] = edgePosToCode[document.getElementById("cornerinput2").value.toUpperCase()];
    id[2] = edgePosToCode[document.getElementById("cornerinput3").value.toUpperCase()];
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
        } else if (codecookie[bigbldTcenterChichuToNumber[id[i]]] === "") {
            cornerinput[i] = id[i];
        } else {
            cornerinput[i] = codecookie[bigbldTcenterChichuToNumber[id[i]]];
        }
    }
    document.getElementById("cornerinput").value = `${cornerinput[0]}${cornerinput[1]}${cornerinput[2]}`;
    if (!bigbldTcenterAlgToInfoManmade.hasOwnProperty(idValue)) {
        idValue = `${id[1]}${id[2]}${id[0]}`;
    }
    if (!bigbldTcenterAlgToInfoManmade.hasOwnProperty(idValue)) {
        idValue = `${id[2]}${id[0]}${id[1]}`;
    }
    algSearchMain(idValue, "manmade");
}

function algSearchMain(idValue, cornerstylecookie) {
    const div1 = document.getElementById("div1");
    if (bigbldTcenterAlgToInfoManmade.hasOwnProperty(idValue)) {
        let cornerAlgToInfoStyle = {};
        if (cornerstylecookie === "manmade") {
            cornerAlgToInfoStyle = bigbldTcenterAlgToInfoManmade;
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
                        if ("tcenter" in sourceToUrl[source]) {
                            url = sourceToUrl[source]["tcenter"];
                        } else if ("bigbld" in sourceToUrl[source]) {
                            url = sourceToUrl[source]["bigbld"];
                        } else if ("bld" in sourceToUrl[source]) {
                            url = sourceToUrl[source]["bld"];
                        }
                    }
                    if (url !== "") {
                        sourceElement = `${sourceElement}<a href="${url}" target="_blank">${source}</a>`;
                    } else {
                        sourceElement = `${sourceElement}${source}`;
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