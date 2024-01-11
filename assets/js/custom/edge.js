"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["edgeAlgToStandard", "edgeAlgToInfo", "edgeAlgToInfoManmade", "edgeChichuToNumber", "edgePosToCode"];
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`../assets/json/${name}.json`, (json) => {
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

function sortByCode(x, y) {
    const edgeCodeToNumber2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];
    return (edgeCodeToNumber2.indexOf(x[1]) - edgeCodeToNumber2.indexOf(y[1])) * 24 + (edgeCodeToNumber2.indexOf(x[2]) - edgeCodeToNumber2.indexOf(y[2]));
}

let buffer = "";
let standardAlgList = [];
let algList = [];
let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
const edgeinput = [];

function algSearch() {
    $("#newupfile").val(arrLang[lang]["customUpfile"]);
    let bufferPos = "";
    algList = [];
    standardAlgList = [];
    buffer = document.getElementById("edgeinput").value;
    if (buffer === "") {
        document.getElementById("newupfile").style.visibility = "hidden";
        document.getElementById("downfile").style.visibility = "hidden";
        document.getElementById("clearSheet").style.visibility = "hidden";
        div2.innerHTML = "";
        return;
    }
    document.getElementById("newupfile").style.visibility = "visible";
    document.getElementById("downfile").style.visibility = "visible";
    document.getElementById("clearSheet").style.visibility = "visible";
    bufferPos = edgePosToCode[buffer];
    if (getCookie("code") !== "") {
        codecookie = getCookie("code");
    }
    for (const alg in edgeAlgToStandard) {
        if (alg[0] === bufferPos) {
            algList.push(alg);
        }
    }
    algList.sort(sortByCode);
    let tab = "";
    if (lang === "zh") {
        tab = `<table id="table" style="table-layout: fixed; width: 900px; padding-right: 0px;"><thead><tr><th style="width:7.5%">${arrLang[lang]["nightmareLetters"]}</th><th style="width:53%;z-index:2">${arrLang[lang]["algorithm"]}</th><th style="width:32%">${arrLang[lang]["commutator"]}</th><th style="width:7.5%">${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
    } else {
        tab = `<table id="table" style="table-layout: fixed; width: 1100px; padding-right: 0px;"><thead><tr><th style="width:7.5%">${arrLang[lang]["nightmareLetters"]}</th><th style="width:43%;z-index:2">${arrLang[lang]["algorithm"]}</th><th style="width:27.5%">${arrLang[lang]["commutator"]}</th><th style="width:22%">${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
    }
    for (const alg of algList) {
        for (let i = 0; i <= 1; i++) {
            if (alg[i + 1] === "") {
                edgeinput[i] = "";
            } else if (codecookie[edgeChichuToNumber[alg[i + 1]]] === "") {
                edgeinput[i] = alg[i + 1];
            } else {
                edgeinput[i] = codecookie[edgeChichuToNumber[alg[i + 1]]];
            }
        }
        const letter = `${edgeinput[0]}${edgeinput[1]}`;
        const standardAlg = edgeAlgToStandard[alg];
        tab += "<tr>";
        tab += `<td>${letter}</td>`;
        tab += `<td style="padding:0 0 0 0;"><select id="select-algorithm-${standardAlg}"></select></td>`;
        tab += `<td><div id="select-commutator-${standardAlg}"></div></td>`;
        tab += `<td><div id="select-finger-${standardAlg}"></div></td>`;
        tab += "</tr>";
    }
    tab += "</tbody></table>";
    div2.innerHTML = tab;

    for (const alg of algList) {
        setSelect(alg);
    }
    setLocal();
    let r = 0;
    if (lang === "zh") {
        r = 900 / $("#div2").width();
    } else {
        r = 1100 / $("#div2").width();
    }
    if (r > 1) {
        $("#table").css("width", $("#div2").width());
        $("#table").css("font-size", 16 / r);
        $(".selectize-dropdown").css("line-height", 1.43);
        $(".selectize-input").css("line-height", 2.57);
        $(".selectize-dropdown").css("padding", 0);
        $(".selectize-input").css("padding", 0);
    }
}

function setSelect(alg) {
    const standardAlg = edgeAlgToStandard[alg];
    if (!(standardAlgList.indexOf(standardAlg) > -1)) {
        standardAlgList.push(standardAlg);
    }
    const optionsList = [];
    let edgeAlgToInfoStyle = {};
    let edgestylecookie = "nightmare";
    if (getCookie("edgestyle") !== "") {
        edgestylecookie = getCookie("edgestyle");
    }
    if (edgestylecookie === "nightmare") {
        edgeAlgToInfoStyle = edgeAlgToInfo;
    }
    if (edgestylecookie === "manmade") {
        edgeAlgToInfoStyle = edgeAlgToInfoManmade;
    }
    if (edgestylecookie === "manmade") {
        const singleList = [];
        for (const algs of edgeAlgToInfoStyle[standardAlg]) {
            for (const singleAlg of algs[0]) {
                singleList.push(singleAlg);
            }
        }
        const rows = singleList.length;
        for (let i = 0; i < rows; i++) {
            const optionsDict = {};
            optionsDict["id"] = i + 1;
            optionsDict["algorithm"] = singleList[i];
            optionsList.push(optionsDict);
        }
    } else {
        const rows = edgeAlgToInfoStyle[standardAlg].length;
        for (let i = 0; i < rows; i++) {
            const optionsDict = {};
            optionsDict["id"] = i + 1;
            optionsDict["algorithm"] = edgeAlgToInfoStyle[standardAlg][i];
            optionsList.push(optionsDict);
        }
    }
    $(`#select-algorithm-${standardAlg}`).selectize( {
        "loadingClass": "selectizeLoading",
        "placeholder": "Pick algorithms",
        "closeAfterSelect": true,
        "valueField": "algorithm",
        "labelField": "algorithm",
        "searchField": ["algorithm"],
        "sortField": "id",
        "options" : optionsList,
        "create" : true,
        "persist": false,
        "onChange" (algorithm) {
            const selectize = $(`#select-algorithm-${standardAlg}`).selectize()[0].selectize;
            const simplifyValue = expand(algorithm);
            if (simplifyValue !== algorithm) {
                selectize.removeOption(algorithm);
                selectize.addOption([{"id": "0", "algorithm": simplifyValue}]);
                selectize.setValue([0, simplifyValue]);
            }
            localStorage.setItem(`edge-${standardAlg}`, simplifyValue);
            $(`#select-commutator-${standardAlg}`).text(commutator(simplifyValue));
            $(`#select-finger-${standardAlg}`).text(fingerbeginfrom(simplifyValue));
        },
        "createFilter" (value) {
            const simplifyValue = expand(value);
            for (const optValue in this.options) {
                const algorithm = this.options[optValue].algorithm;
                if (value === algorithm) {
                    return false;
                }
                if (simplifyValue === algorithm) {
                    return true;
                }
            }
            const edgefullValue = edgefull(simplifyValue);
            if (edgefullValue.length !== 4) {
                return false;
            }
            const cornerfullValue = cornerfull(simplifyValue);
            if (cornerfullValue.length !== 0) {
                return false;
            }
            const standardValue = edgefullValue[0] + edgefullValue[2] + edgefullValue[1];
            if (standardValue !== standardAlg) {
                return false;
            }
            return true;
        },
        "score" (search) {
            return function (option) {
                if (option.algorithm.indexOf(search) === 0) {
                    return 1;
                }
                return 0;
            };
        }
    }).data("selectize");
}

function setLocal() {
    for (const alg of algList) {
        const standardAlg = edgeAlgToStandard[alg];
        const selectize = $(`#select-algorithm-${standardAlg}`).selectize()[0].selectize;
        const localValue = localStorage.getItem(`edge-${standardAlg}`);
        if (typeof localValue !== "undefined" && localValue !== null) {
            selectize.addOption([{"id": "0", "algorithm": localValue}]);
            selectize.setValue([0, localValue]);
        }
    }
}

function clearSheet() {
    for (const alg of algList) {
        const standardAlg = edgeAlgToStandard[alg];
        localStorage.removeItem(`edge-${standardAlg}`);
    }
    algSearch();
}

function upFile(ee) {
    const standardAlgListCopy = standardAlgList.concat();
    const files = ee.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, {
            "type": "binary"
        });
        for (let sheetIndex = 0; sheetIndex < workbook.SheetNames.length; sheetIndex++){
            const tmp = XLSX.utils.sheet_to_formulae(workbook.Sheets[workbook.SheetNames[sheetIndex]]);
            let maxRowCount = 0;
            let tmpRowCount = 0;
            let arrayTitle = [];
            const obj = {};
            for (let i = 0; i < tmp.length; i++) {
                tmpRowCount = parseInt(tmp[i].split("=")[0].substr(1, tmp[i].split("=")[0].length - 1), 10);
                if (tmpRowCount >= maxRowCount) {
                    maxRowCount = tmpRowCount;
                }
                obj[tmp[i].split("=")[0]] = tmp[i].split("=")[1];
                arrayTitle.push(tmp[i].split("=")[0].charAt(0));
            }
            arrayTitle = Array.from(new Set(arrayTitle));
            for (let i = 1; i <= maxRowCount; i++) {
                for (let j = 0; j < arrayTitle.length; j++) {
                    if (obj.hasOwnProperty(arrayTitle[j] + i)) {
                        const originAlg = obj[arrayTitle[j] + i].replace("'", "");
                        if (originAlg.length > 60) {
                            continue;
                        }
                        const alg = expand(originAlg);
                        const edgefullValue = edgefull(alg);
                        if (edgefullValue.length !== 4) {
                            continue;
                        }
                        const cornerfullValue = cornerfull(alg);
                        if (cornerfullValue.length !== 0) {
                            continue;
                        }
                        const standardAlg = edgefullValue[0] + edgefullValue[2] + edgefullValue[1];
                        const indexOfList = standardAlgListCopy.indexOf(standardAlg);
                        if (!(indexOfList > -1)) {
                            continue;
                        }
                        standardAlgListCopy.splice(indexOfList, 1);
                        const selectize = $(`#select-algorithm-${standardAlg}`).selectize()[0].selectize;
                        selectize.addOption([{"id": "0", "algorithm": alg}]);
                        selectize.setValue([0, alg]);
                        if (standardAlgListCopy.length === 0) {
                            return;
                        }
                    }
                }
            }
        }
    };
    reader.readAsBinaryString(files);
    document.getElementById("upfile").value = null;
}

function downFile() {
    const Datas = {
        "Sheet1": []
    };
    for (const alg of algList) {
        for (let i = 0; i <= 1; i++) {
            if (alg[i + 1] === "") {
                edgeinput[i] = "";
            } else if (codecookie[edgeChichuToNumber[alg[i + 1]]] === "") {
                edgeinput[i] = alg[i + 1];
            } else {
                edgeinput[i] = codecookie[edgeChichuToNumber[alg[i + 1]]];
            }
        }
        const letter = `${edgeinput[0]}${edgeinput[1]}`;
        const standardAlg = edgeAlgToStandard[alg];
        const selectize = $(`#select-algorithm-${standardAlg}`).selectize()[0].selectize;
        const algorithm = selectize.getValue();
        Datas.Sheet1.push({[arrLang[lang]["nightmareLetters"]]: letter, [arrLang[lang]["algorithm"]]: algorithm, [arrLang[lang]["commutator"]]: commutator(algorithm), [arrLang[lang]["thumbPosition"]]: fingerbeginfrom(algorithm)});
    }
    const Sheet1 = XLSX.utils.json_to_sheet(Datas.Sheet1);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, Sheet1, buffer);
    const Sheet2 = XLSX.utils.aoa_to_sheet([
        ["", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", codecookie[0], codecookie[1], codecookie[2], "", "", "", "", "", ""],
        ["", "", "", "", codecookie[3], "", codecookie[4], "", "", "", "", "", ""],
        ["", "", "", "", codecookie[5], codecookie[6], codecookie[7], "", "", "", "", "", ""],
        ["", codecookie[16], codecookie[17], codecookie[18], codecookie[32], codecookie[33], codecookie[34], codecookie[24], codecookie[25], codecookie[26], codecookie[40], codecookie[41], codecookie[42]],
        ["", codecookie[19], "", codecookie[20], codecookie[35], "", codecookie[36], codecookie[27], "", codecookie[28], codecookie[43], "", codecookie[44]],
        ["", codecookie[21], codecookie[22], codecookie[23], codecookie[37], codecookie[38], codecookie[39], codecookie[29], codecookie[30], codecookie[31], codecookie[45], codecookie[46], codecookie[47]],
        ["", "", "", "", codecookie[8], codecookie[9], codecookie[10], "", "", "", "", "", ""],
        ["", "", "", "", codecookie[11], "", codecookie[12], "", "", "", "", "", ""],
        ["", "", "", "", codecookie[13], codecookie[14], codecookie[15], "", "", "", "", "", ""]
    ]);
    XLSX.utils.book_append_sheet(wb, Sheet2, arrLang[lang]["code"]);
    const myDate = new Date();
    const year = myDate.getFullYear();
    let month = myDate.getMonth() + 1;
    let ddate = myDate.getDate();
    let Sheet3 = "";
    if (lang === "zh") {
        if (month >= 1 && month <= 9) {
            month = `0${month}`;
        }
        if (ddate >= 0 && ddate <= 9) {
            ddate = `0${ddate}`;
        }
        Sheet3 = XLSX.utils.aoa_to_sheet([["本文件由 https://blddb.net 进行后期处理"], [`最后更新于${year}年${month}月${ddate}日`]]);
    } else {
        const monthArr = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
        const suffix = ["st", "nd", "rd", "th"];
        if (ddate % 10 < 1 || ddate % 10 > 3) {
            ddate = ddate + suffix[3];
        } else if (ddate % 10 === 1) {
            ddate = ddate + suffix[0];
        } else if (ddate % 10 === 2) {
            ddate = ddate + suffix[1];
        } else {
            ddate = ddate + suffix[2];
        }
        Sheet3 = XLSX.utils.aoa_to_sheet([["This file is post processed by https://blddb.net"], [`Latest update on ${ddate} ${monthArr[month - 1]} ${year}`]]);
    }
    XLSX.utils.book_append_sheet(wb, Sheet3, arrLang[lang]["introduction"]);
    XLSX.writeFile(wb, `${arrLang[lang]["customEdge"]}-${buffer}.xlsx`);
}

function fontAwesome() {
    $("select").find("option[key='edgeStyleNightmare']").html(`&#128128; ${$("select").find("option[key='edgeStyleNightmare']").html()}`);
    $("select").find("option[key='edgeStyleManmade']").html(`&thinsp;&#xf2bd; ${$("select").find("option[key='edgeStyleManmade']").html()}`);
}

$(document).ready(() => {
    $("input[type=file]").each(function () {
        const thisInput$ = $(this);
        const newElement = $("<button id='newupfile' style='visibility:hidden' class='lang icon fa-upload' key='customUpfile'></button>");
        newElement.text(arrLang[lang]["customUpfile"]);
        newElement.click(() => {
            thisInput$.click();
        });
        thisInput$.after(newElement);
        thisInput$.hide();
    });
});

document.getElementById("upfile").addEventListener("change", upFile, false);
document.getElementById("downfile").addEventListener("click", downFile, false);
document.getElementById("clearSheet").addEventListener("click", clearSheet, false);