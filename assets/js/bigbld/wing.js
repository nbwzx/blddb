"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["bigbldWingAlgToInfoManmade", "sourceToUrl", "bidbldWingCodeToPos", "bidbldWingPosToCode", "bigbldWingChichuToNumber", "bigbldWingChichuToNumber1", "bidbldWingCodeToPos1", "bidbldWingPosToCode1"];
const jsonNameListPre = {"bigbldWingAlgToInfoManmade":"bigbld/bigbldWingAlgToInfoManmade", "sourceToUrl":"sourceToUrl", "bidbldWingCodeToPos":"bigbld/bidbldWingCodeToPos", "bidbldWingPosToCode":"bigbld/bidbldWingPosToCode", "bigbldWingChichuToNumber":"bigbld/bigbldWingChichuToNumber", "bigbldWingChichuToNumber1":"bigbld/bigbldWingChichuToNumber1", "bidbldWingCodeToPos1":"bigbld/bidbldWingCodeToPos1", "bidbldWingPosToCode1":"bigbld/bidbldWingPosToCode1"};
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`../assets/json/${jsonNameListPre[name]}.json`, (json) => {
    window[`${name}`] = json;
}));

if (getCookie("codeBig") !== "") {
    // Non-standard
    if (getCookie("codeBig")[1] === " ") {
        for (let i = 1; i <= 3; i++) {
            document.getElementById(`cornerinput${i}`).innerHTML = `
            <option></option>
            <option>UBr</option>
            <option>URf</option>
            <option>UFl</option>
            <option>ULb</option>
            <option>LUf</option>
            <option>LFd</option>
            <option>LDb</option>
            <option>LBu</option>
            <option>FUr</option>
            <option>FRd</option>
            <option>FDl</option>
            <option>FLu</option>
            <option>RUb</option>
            <option>RBd</option>
            <option>RDf</option>
            <option>RFu</option>
            <option>BUl</option>
            <option>BLd</option>
            <option>BDr</option>
            <option>BRu</option>
            <option>DFr</option>
            <option>DRb</option>
            <option>DBl</option>
            <option>DLf</option>
            `;
        }
    }
}

function switchStyle() {
    setCookie("cornerstyle", document.getElementById("cornerstyle").value, 400);
    algSearch();
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
    if (getCookie("codeBig")[1] === " ") {
        for (const i in bigbldWingChichuToNumber1) {
            for (let j = 0; j <= 2; j++) {
                if (codecookie[bigbldWingChichuToNumber1[i]] === idValueOrigin[j]) {
                    id[j] = i;
                }
            }
        }
        document.getElementById("cornerinput1").value = bidbldWingCodeToPos1[id[0]];
        document.getElementById("cornerinput2").value = bidbldWingCodeToPos1[id[1]];
        document.getElementById("cornerinput3").value = bidbldWingCodeToPos1[id[2]];
    } else {
        for (const i in bigbldWingChichuToNumber) {
            for (let j = 0; j <= 2; j++) {
                if (codecookie[bigbldWingChichuToNumber[i]] === idValueOrigin[j]) {
                    id[j] = i;
                }
            }
        }
        document.getElementById("cornerinput1").value = bidbldWingCodeToPos[id[0]];
        document.getElementById("cornerinput2").value = bidbldWingCodeToPos[id[1]];
        document.getElementById("cornerinput3").value = bidbldWingCodeToPos[id[2]];
    }
    let idValue = `${id[0]}${id[1]}${id[2]}`;
    if (!bigbldWingAlgToInfoManmade.hasOwnProperty(idValue)) {
        idValue = `${id[1]}${id[2]}${id[0]}`;
    }
    if (!bigbldWingAlgToInfoManmade.hasOwnProperty(idValue)) {
        idValue = `${id[2]}${id[0]}${id[1]}`;
    }
    algSearchMain(idValue, "manmade");
}

function algSearchByPos() {
    let codecookie = "DEE G DEGGCCGGCAAJ A AAJWII X WIXOKKOOKOMR O MMREDD C EDCTXXTTXQLM Q LLMKHH I KHIZRRZZRZPS Z PPSBBB L BBLQSSQQSNJY N JJYHFF F HFFWYYWWYTNP T NNP";
    if (getCookie("codeBig") !== "") {
        codecookie = getCookie("codeBig");
    }
    const id = [];
    if (getCookie("codeBig")[1] === " ") {
        id[0] = bidbldWingPosToCode1[document.getElementById("cornerinput1").value];
        id[1] = bidbldWingPosToCode1[document.getElementById("cornerinput2").value];
        id[2] = bidbldWingPosToCode1[document.getElementById("cornerinput3").value];
    } else {
        id[0] = bidbldWingPosToCode[document.getElementById("cornerinput1").value];
        id[1] = bidbldWingPosToCode[document.getElementById("cornerinput2").value];
        id[2] = bidbldWingPosToCode[document.getElementById("cornerinput3").value];
    }
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
    if (getCookie("codeBig")[1] === " ") {
        for (let i = 0; i <= 2; i++) {
            if (id[i] === "") {
                cornerinput[i] = "";
            } else if (codecookie[bigbldWingChichuToNumber1[id[i]]] === "") {
                cornerinput[i] = id[i];
            } else {
                cornerinput[i] = codecookie[bigbldWingChichuToNumber1[id[i]]];
            }
        }
    } else {
        for (let i = 0; i <= 2; i++) {
            if (id[i] === "") {
                cornerinput[i] = "";
            } else if (codecookie[bigbldWingChichuToNumber[id[i]]] === "") {
                cornerinput[i] = id[i];
            } else {
                cornerinput[i] = codecookie[bigbldWingChichuToNumber[id[i]]];
            }
        }
    }
    document.getElementById("cornerinput").value = `${cornerinput[0]}${cornerinput[1]}${cornerinput[2]}`;
    if (!bigbldWingAlgToInfoManmade.hasOwnProperty(idValue)) {
        idValue = `${id[1]}${id[2]}${id[0]}`;
    }
    if (!bigbldWingAlgToInfoManmade.hasOwnProperty(idValue)) {
        idValue = `${id[2]}${id[0]}${id[1]}`;
    }
    algSearchMain(idValue, "manmade");
}

function algSearchMain(idValue, cornerstylecookie) {
    const div1 = document.getElementById("div1");
    if (bigbldWingAlgToInfoManmade.hasOwnProperty(idValue)) {
        let cornerAlgToInfoStyle = {};
        if (cornerstylecookie === "manmade") {
            cornerAlgToInfoStyle = bigbldWingAlgToInfoManmade;
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
                        if ("wing" in sourceToUrl[source]) {
                            url = sourceToUrl[source]["wing"];
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