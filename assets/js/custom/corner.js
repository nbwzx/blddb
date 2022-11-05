"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["cornerAlgToStandard", "cornerAlgToInfo", "cornerChichuToNumber", "cornerPosToCode"];
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`../assets/json/${name}.json`, (json) => {
    window[`${name}`] = json;
}));

function sortByCode(x, y) {
    const cornerCodeToNumber2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "W", "M", "N", "O", "P", "Q", "R", "S", "T", "X", "Y", "Z"];
    return (cornerCodeToNumber2.indexOf(x[1]) - cornerCodeToNumber2.indexOf(y[1])) * 24 + (cornerCodeToNumber2.indexOf(x[2]) - cornerCodeToNumber2.indexOf(y[2]));
}

let buffer = "";
let bufferPos = "";
let standardAlgList = [];
let algList = [];
let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";

function algSearch() {
    $("#newupfile").val(arrLang[lang]["customUpfile"]);
    const cornerinput = [];
    algList = [];
    standardAlgList = [];
    buffer = document.getElementById("cornerinput").value;
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
    bufferPos = cornerPosToCode[buffer];
    if (getCookie("code") !== "") {
        codecookie = getCookie("code");
    }
    for (const alg in cornerAlgToStandard) {
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
        const algdisplay = alg.slice(1, 3);
        for (let i = 0; i <= 1; i++) {
            if (algdisplay[i] === "") {
                cornerinput[i] = "";
            } else if (codecookie[cornerChichuToNumber[algdisplay[i]]] === "") {
                cornerinput[i] = algdisplay[i];
            } else {
                cornerinput[i] = codecookie[cornerChichuToNumber[algdisplay[i]]];
            }
        }
        const letter = `${cornerinput[0]}${cornerinput[1]}`;
        const standardAlg = cornerAlgToStandard[alg];
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
    const standardAlg = cornerAlgToStandard[alg];
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
            { "id": 1, "algorithm": cornerAlgToInfo[standardAlg][0]},
            { "id": 2, "algorithm": cornerAlgToInfo[standardAlg][1]},
            { "id": 3, "algorithm": cornerAlgToInfo[standardAlg][2]},
            { "id": 4, "algorithm": cornerAlgToInfo[standardAlg][3]},
            { "id": 5, "algorithm": cornerAlgToInfo[standardAlg][4]},
            { "id": 6, "algorithm": cornerAlgToInfo[standardAlg][5]},
            { "id": 7, "algorithm": cornerAlgToInfo[standardAlg][6]},
            { "id": 8, "algorithm": cornerAlgToInfo[standardAlg][7]},
            { "id": 9, "algorithm": cornerAlgToInfo[standardAlg][8]},
            { "id": 10, "algorithm": cornerAlgToInfo[standardAlg][9]},
            { "id": 11, "algorithm": cornerAlgToInfo[standardAlg][10]},
            { "id": 12, "algorithm": cornerAlgToInfo[standardAlg][11]},
            { "id": 13, "algorithm": cornerAlgToInfo[standardAlg][12]},
            { "id": 14, "algorithm": cornerAlgToInfo[standardAlg][13]},
            { "id": 15, "algorithm": cornerAlgToInfo[standardAlg][14]},
            { "id": 16, "algorithm": cornerAlgToInfo[standardAlg][15]},
            { "id": 17, "algorithm": cornerAlgToInfo[standardAlg][16]},
            { "id": 18, "algorithm": cornerAlgToInfo[standardAlg][17]}
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
            const cornerfullValue = cornerfull(simplifyValue);
            if (cornerfullValue.length !== 4) {
                return false;
            }
            const edgefullValue = edgefull(simplifyValue);
            if (edgefullValue.length !== 0) {
                return false;
            }
            const standardValue = cornerfullValue[0] + cornerfullValue[2] + cornerfullValue[1];
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
                        const cornerfullValue = cornerfull(alg);
                        if (cornerfullValue.length !== 4) {
                            continue;
                        }
                        const edgefullValue = edgefull(alg);
                        if (edgefullValue.length !== 0) {
                            continue;
                        }
                        const standardAlg = cornerfullValue[0] + cornerfullValue[2] + cornerfullValue[1];
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
        const standardAlg = cornerAlgToStandard[alg];
        const selectize = $(`#select-algorithm-${standardAlg}`).selectize()[0].selectize;
        const algorithm = selectize.getValue();
        Datas.Sheet1.push({[arrLang[lang]["nightmareLetters"]]: letter, [arrLang[lang]["algorithm"]]: algorithm, [arrLang[lang]["commutator"]]: commutator(algorithm), [arrLang[lang]["thumbPosition"]]: fingerbeginfrom(algorithm)});
    }
    const Sheet1 = X.utils.json_to_sheet(Datas.Sheet1);
    const wb = X.utils.book_new();
    X.utils.book_append_sheet(wb, Sheet1, "Sheet1");
    XLSX.writeFile(wb, `${arrLang[lang]["customCorner"]}-${buffer}.xlsx`);
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