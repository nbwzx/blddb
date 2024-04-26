"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["cornerChichuToNumber", "edgePosToCode", "cornerPosToCode", "cornerCodeToPos", "ltctAlgToInfo", "ltctAlgToInfoManmade", "sourceToUrl"];
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`assets/json/${name}.json`, (json) => {
    window[`${name}`] = json;
}));

if (getCookie("ltctstyle") === "") {
    setCookie("ltctstyle", "nightmare", 30);
} else {
    document.getElementById("ltctstyle").value = getCookie("ltctstyle");
}

function switchStyle() {
    setCookie("ltctstyle", document.getElementById("ltctstyle").value, 30);
    algSearch();
}

function compareStrings(str1, str2) {
    // Check if the lengths of the strings are different
    if (str1.length !== str2.length) {
        return false;
    }
    // Iterate over each character in the strings
    for (let i = 0; i < str1.length; i++) {
        // Check if the characters are not equal and not both spaces
        if (str1[i] !== str2[i] && str1[i] !== " " && str2[i] !== " ") {
            return false;
        }
    }
    // All characters are the same or spaces
    return true;
}

function flipCode(inputCode) {
    if (typeof inputCode === "undefined") {
        return "";
    }
    const edgeCodeToFlip = {
        "A": "B",
        "B": "A",
        "C": "D",
        "D": "C",
        "E": "F",
        "F": "E",
        "G": "H",
        "H": "G",
        "I": "J",
        "J": "I",
        "K": "L",
        "L": "K",
        "M": "N",
        "N": "M",
        "O": "P",
        "P": "O",
        "Q": "R",
        "R": "Q",
        "S": "T",
        "T": "S",
        "W": "X",
        "X": "W",
        "Y": "Z",
        "Z": "Y"
    };
    let outputCode = "";
    for (let i = 0; i < inputCode.length; i++) {
        outputCode = outputCode + edgeCodeToFlip[inputCode[i]];
    }
    return outputCode;
}

function sortByCode(inputCode) {
    const edgeCodeToNumber2 = ["G", "H", "A", "B", "C", "D", "E", "F", "O", "P", "K", "L", "Q", "R", "S", "T", "Y", "Z", "I", "J", "W", "X", "M", "N"];
    let outputCode = "";
    if (edgeCodeToNumber2.indexOf(inputCode[0]) < edgeCodeToNumber2.indexOf(inputCode[1])) {
        outputCode = inputCode[0] + inputCode[1];
    } else {
        outputCode = inputCode[1] + inputCode[0];
    }
    if (edgeCodeToNumber2.indexOf(outputCode[0]) % 2 === 1) {
        outputCode = flipCode(outputCode);
    }
    const cornerCodeToNumber2 = ["J", "K", "L", "G", "H", "I", "A", "B", "C", "D", "E", "F", "X", "Y", "Z", "W", "M", "N", "R", "S", "T", "O", "P", "Q"];
    const cornerCodeNextMap = {};
    for (let i = 0; i < cornerCodeToNumber2.length; i += 3) {
        cornerCodeNextMap[cornerCodeToNumber2[i]] = cornerCodeToNumber2[i] + cornerCodeToNumber2[i + 1] + cornerCodeToNumber2[i + 2];
        cornerCodeNextMap[cornerCodeToNumber2[i + 1]] = cornerCodeToNumber2[i + 1] + cornerCodeToNumber2[i + 2] + cornerCodeToNumber2[i];
        cornerCodeNextMap[cornerCodeToNumber2[i + 2]] = cornerCodeToNumber2[i + 2] + cornerCodeToNumber2[i] + cornerCodeToNumber2[i + 1];
    }
    if (cornerCodeToNumber2.indexOf(inputCode[2]) < cornerCodeToNumber2.indexOf(inputCode[3])) {
        const cornerCodeNext = (3 - cornerCodeToNumber2.indexOf(inputCode[2]) % 3) % 3;
        outputCode += cornerCodeNextMap[inputCode[2]][cornerCodeNext] + cornerCodeNextMap[inputCode[3]][cornerCodeNext];
    } else {
        const cornerCodeNext1 = (3 - cornerCodeToNumber2.indexOf(inputCode[3]) % 3) % 3;
        const cornerCodeNext2 = (cornerCodeNext1 + cornerCodeToNumber2.indexOf(inputCode[4]) % 3) % 3;
        outputCode += cornerCodeNextMap[inputCode[3]][cornerCodeNext1] + cornerCodeNextMap[inputCode[2]][cornerCodeNext2];
    }
    outputCode += inputCode[4];
    return outputCode;
}

function algSearch() {
    algSearchByPos();
}

function algSearchByPos() {
    const id = ["G", "A"];
    // if (document.getElementById("ltctinput1").value !== "") {
    //     id[0] = edgePosToCode[document.getElementById("ltctinput1").value];
    // } else {
    //     id[0] = " ";
    // }
    // if (document.getElementById("ltctinput2").value !== "") {
    //     id[1] = edgePosToCode[document.getElementById("ltctinput2").value];
    // } else {
    //     id[1] = " ";
    // }
    if (document.getElementById("ltctinput3").value !== "") {
        id[2] = cornerPosToCode[document.getElementById("ltctinput3").value];
    } else {
        id[2] = " ";
    }
    if (document.getElementById("ltctinput4").value !== "") {
        id[3] = cornerPosToCode[document.getElementById("ltctinput4").value];
    } else {
        id[3] = " ";
    }
    if (document.getElementById("ltctinput5").value !== "") {
        id[4] = cornerPosToCode[document.getElementById("ltctinput5").value];
    } else {
        id[4] = " ";
    }
    const idValue = `${id[0]}${id[1]}${id[2]}${id[3]}${id[4]}`;
    let ltctstylecookie = "nightmare";
    if (getCookie("ltctstyle") !== "") {
        ltctstylecookie = getCookie("ltctstyle");
    }
    algSearchMain(idValue, ltctstylecookie);
}

function algSearchMain(idValue, ltctstylecookie) {
    const div1 = document.getElementById("div1");
    let cornerAlgToInfoStyle = {};
    let cornerAlgToStyle = {};
    if (ltctstylecookie === "nightmare") {
        cornerAlgToInfoStyle = ltctAlgToInfo;
    }
    if (ltctstylecookie === "manmade") {
        cornerAlgToInfoStyle = ltctAlgToInfoManmade;
    }
    let tab = "";
    const spaceIndex = idValue.indexOf(" ");
    const searchList = [];
    if (spaceIndex !== -1) {
        const cornerPositions = "ABCDEFGHIJKLWMNOPQRSTXYZ";
        for (let i = 0; i < cornerPositions.length; i++) {
            searchList.push(idValue.replace(" ", cornerPositions[i]));
        }
    } else {
        searchList.push(idValue);
    }
    let isFound = false;
    if (idValue.split(" ").length - 1 <= 1) {
        for (const originalKey of searchList) {
            const key = sortByCode(originalKey);
            if (!(key in cornerAlgToInfoStyle)) {
                continue;
            }
            isFound = true;
            let rows = cornerAlgToInfoStyle[key].length;
            if (ltctstylecookie === "nightmare" && idValue.split(" ").length - 1 === 1) {
                rows = 5;
            }
            if (tab === "") {
                if (ltctstylecookie === "manmade") {
                    tab += `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["thumbPosition"]}</th><th>${arrLang[lang]["source"]}</th></tr></thead><tbody>`;
                } else {
                    tab += `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
                }
            }
            const spaceIndex = idValue.indexOf(" ");
            if (spaceIndex !== -1) {
                let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
                if (getCookie("code") !== "") {
                    codecookie = getCookie("code");
                }
                let customCode = "";
                if (originalKey[spaceIndex] === "") {
                    customCode = "";
                } else if (codecookie[cornerChichuToNumber[originalKey[spaceIndex]]] === "") {
                    customCode = originalKey[spaceIndex];
                } else {
                    customCode = codecookie[cornerChichuToNumber[originalKey[spaceIndex]]];
                }
                tab += "<tr><td colspan='4'>" + cornerCodeToPos[originalKey[spaceIndex]] + " (" + customCode + ")" + "</td></tr>";
            }
            for (let i = 0; i < rows; i++) {
                if (ltctstylecookie !== "manmade" && cornerAlgToInfoStyle[key][i] === cornerAlgToStyle[key]) {
                    tab += "<tr bgcolor=\"#D0D0D0\">";
                } else {
                    tab += "<tr>";
                }
                if (ltctstylecookie === "manmade") {
                    const algInfo = cornerAlgToInfoStyle[key][i][0];
                    const sourceInfo = cornerAlgToInfoStyle[key][i][1];
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
                                if ("ltct" in sourceToUrl[source]) {
                                    url = sourceToUrl[source]["ltct"];
                                } else if ("3bld" in sourceToUrl[source]) {
                                    url = sourceToUrl[source]["3bld"];
                                } else if ("bld" in sourceToUrl[source]) {
                                    url = sourceToUrl[source]["bld"];
                                }
                            }
                            if (url !== "") {
                                sourceElement = `${sourceElement}<a href="${url}" target="_blank">${source}</a>`;
                            } else {
                                sourceElement = `${sourceElement}${source}`;
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
                    tab += `<td>${cornerAlgToInfoStyle[key][i]}</td>`;
                    tab += `<td>${fingerbeginfrom(cornerAlgToInfoStyle[key][i])}</td>`;
                }
                tab += "</tr>";
            }
        }
    }
    if (isFound) {
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