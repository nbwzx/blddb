"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["edgeAlgToStandard", "edgeAlgToInfo", "edgeChichuToNumber", "edgePosToCode"];
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`../assets/json/${name}.json`, (json) => {
    window[`${name}`] = json;
}));

function sortByCode(x, y) {
    const edgeCodeToNumber2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];
    return (edgeCodeToNumber2.indexOf(x[1]) - edgeCodeToNumber2.indexOf(y[1])) * 24 + (edgeCodeToNumber2.indexOf(x[2]) - edgeCodeToNumber2.indexOf(y[2]));
}

let buffer = "";
let bufferPos = "";
let standardAlgList = [];
let algList = [];
let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";

function algSearch() {
    $("#newupfile").val(arrLang[lang]["customUpfile"]);
    const edgeinput = [];
    algList = [];
    standardAlgList = [];
    buffer = document.getElementById("edgeinput").value;
    if (buffer === "") {
        document.getElementById("newupfile").style.visibility = "hidden";
        document.getElementById("downfile").style.visibility = "hidden";
        document.getElementById("algsearch").style.visibility = "hidden";
        div2.innerHTML = "";
        return;
    }
    document.getElementById("newupfile").style.visibility = "visible";
    document.getElementById("downfile").style.visibility = "visible";
    document.getElementById("algsearch").style.visibility = "visible";
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
        tab = `<table id="table" style="table-layout: fixed; width: 800px; padding-right: 0px;"><thead><tr><th style="width:8%">${arrLang[lang]["nightmareLetters"]}</th><th style="width:56%;z-index:2">${arrLang[lang]["algorithm"]}</th><th style="width:28%">${arrLang[lang]["commutator"]}</th><th style="width:8%">${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
    } else {
        tab = `<table id="table" style="table-layout: fixed; width: 976px; padding-right: 0px;"><thead><tr><th style="width:10%">${arrLang[lang]["nightmareLetters"]}</th><th style="width:56%;z-index:2">${arrLang[lang]["algorithm"]}</th><th style="width:28%">${arrLang[lang]["commutator"]}</th><th style="width:28%">${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
    }
    for (const alg of algList) {
        const algdisplay = alg.slice(1, 3);
        for (let i = 0; i <= 1; i++) {
            if (algdisplay[i] === "") {
                edgeinput[i] = "";
            } else if (codecookie[edgeChichuToNumber[algdisplay[i]]] === "") {
                edgeinput[i] = algdisplay[i];
            } else {
                edgeinput[i] = codecookie[edgeChichuToNumber[algdisplay[i]]];
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
    let r = 0;
    if (lang === "zh") {
        r = 800 / $("#div2").width();
    } else {
        r = 976 / $("#div2").width();
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
    $(`#select-algorithm-${standardAlg}`).selectize( {
        "loadingClass": "selectizeLoading",
        "placeholder": "Pick algorithms",
        "closeAfterSelect": true,
        "valueField": "algorithm",
        "labelField": "algorithm",
        "searchField": ["algorithm"],
        "sortField": "id",
        "options" : [
            { "id": 1, "algorithm": edgeAlgToInfo[standardAlg][0]},
            { "id": 2, "algorithm": edgeAlgToInfo[standardAlg][1]},
            { "id": 3, "algorithm": edgeAlgToInfo[standardAlg][2]},
            { "id": 4, "algorithm": edgeAlgToInfo[standardAlg][3]},
            { "id": 5, "algorithm": edgeAlgToInfo[standardAlg][4]},
            { "id": 6, "algorithm": edgeAlgToInfo[standardAlg][5]},
            { "id": 7, "algorithm": edgeAlgToInfo[standardAlg][6]},
            { "id": 8, "algorithm": edgeAlgToInfo[standardAlg][7]},
            { "id": 9, "algorithm": edgeAlgToInfo[standardAlg][8]},
            { "id": 10, "algorithm": edgeAlgToInfo[standardAlg][9]},
            { "id": 11, "algorithm": edgeAlgToInfo[standardAlg][10]},
            { "id": 12, "algorithm": edgeAlgToInfo[standardAlg][11]},
            { "id": 13, "algorithm": edgeAlgToInfo[standardAlg][12]},
            { "id": 14, "algorithm": edgeAlgToInfo[standardAlg][13]},
            { "id": 15, "algorithm": edgeAlgToInfo[standardAlg][14]},
            { "id": 16, "algorithm": edgeAlgToInfo[standardAlg][15]},
            { "id": 17, "algorithm": edgeAlgToInfo[standardAlg][16]},
            { "id": 18, "algorithm": edgeAlgToInfo[standardAlg][17]}
        ],
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

const X = XLSX;
const upfile = document.getElementById("upfile");
const downfile = document.getElementById("downfile");
const algsearch = document.getElementById("algsearch");

function upFile(ee) {
    const standardAlgListCopy = standardAlgList.concat();
    const files = ee.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, {
            "type": "binary"
        });
        // DO SOMETHING WITH workbook HERE
        for (let sheetIndex = 0; sheetIndex < workbook.SheetNames.length; sheetIndex++){
            const tmp = X.utils.sheet_to_formulae(workbook.Sheets[workbook.SheetNames[sheetIndex]]);
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
            arrayTitle = Array.from(new Set(arrayTitle)); //Array deduplication
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
        const algdisplay = alg.slice(1, 3);
        const letter = `${algdisplay[0]}${algdisplay[1]}`;
        const standardAlg = edgeAlgToStandard[alg];
        const selectize = $(`#select-algorithm-${standardAlg}`).selectize()[0].selectize;
        const algorithm = selectize.getValue();
        Datas.Sheet1.push({[arrLang[lang]["nightmareLetters"]]: letter, [arrLang[lang]["algorithm"]]: algorithm, [arrLang[lang]["commutator"]]: commutator(algorithm), [arrLang[lang]["thumbPosition"]]: fingerbeginfrom(algorithm)});
    }
    const Sheet1 = X.utils.json_to_sheet(Datas.Sheet1);
    const wb = X.utils.book_new();
    X.utils.book_append_sheet(wb, Sheet1, "Sheet1");
    XLSX.writeFile(wb, `${arrLang[lang]["customEdge"]}-${buffer}.xlsx`);
}

$(document).ready(() => {
    $("input[type=file]").each(function () {
        const thisInput$ = $(this);
        const newElement = $(`<input type='button' id='newupfile' value='${arrLang[lang]["customUpfile"]
        }' style='visibility:hidden'/>`);
        newElement.click(() => {
            thisInput$.click();
        });
        thisInput$.after(newElement);
        thisInput$.hide();
    });
});

upfile.addEventListener("change", upFile, false);
downfile.addEventListener("click", downFile, false);
algsearch.addEventListener("click", algSearch, false);