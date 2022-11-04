"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["cornerChichuToNumber", "cornerAlgToStandard", "cornerAlgToInfo", "cornerAlgToNightmare"];
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`assets/json/${name}.json`, (json) => {
    window[`${name}`] = json;
}));

function sortByCode(x, y) {
    const cornerCodeToNumber2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "W", "M", "N", "O", "P", "Q", "R", "S", "T", "X", "Y", "Z"];
    return (cornerCodeToNumber2.indexOf(x[1]) - cornerCodeToNumber2.indexOf(y[1])) * 24 + (cornerCodeToNumber2.indexOf(x[2]) - cornerCodeToNumber2.indexOf(y[2]));
}

const bufferPos = "J";
const cornerinput = [];
const algList = [];
let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
if (getCookie("code") !== "") {
    codecookie = getCookie("code");
}
for (const alg in cornerAlgToStandard) {
    if (alg[0] === bufferPos) {
        algList.push(alg);
    }
}
algList.sort(sortByCode);
let tab = `<table id="table"><thead><tr><th style="min-width:58px">${arrLang[lang]["nightmareLetters"]}</th><th style="min-width:450px;z-index:2">${arrLang[lang]["algorithm"]}</th><th style="min-width:220px">${arrLang[lang]["commutator"]}</th><th style="min-width:60px">${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
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
    tab += "<tr>";
    tab += `<td>${letter}</td>`;
    tab += `<td style="padding:0 0 0 0;"><select id="select-algorithm-J${algdisplay}"></select></td>`;
    tab += `<td><div id="select-commutator-J${algdisplay}"></div></td>`;
    tab += `<td><div id="select-finger-J${algdisplay}"></div></td>`;
    tab += "</tr>";
}
tab += "</tbody></table>";
div2.innerHTML = tab;

for (const alg of algList) {
    const algdisplay = alg.slice(1, 3);
    setSelect(algdisplay);
}


function setSelect(letter) {
    $(`#select-algorithm-J${letter}`).selectize( {
        "loadingClass": "selectizeLoading",
        "placeholder": "Pick algorithms",
        "closeAfterSelect": true,
        "valueField": "algorithm",
        "labelField": "algorithm",
        "searchField": ["algorithm"],
        "sortField": "id",
        "options" : [
            { "id": 1, "algorithm": cornerAlgToInfo[`J${letter}`][0]},
            { "id": 2, "algorithm": cornerAlgToInfo[`J${letter}`][1]},
            { "id": 3, "algorithm": cornerAlgToInfo[`J${letter}`][2]},
            { "id": 4, "algorithm": cornerAlgToInfo[`J${letter}`][3]},
            { "id": 5, "algorithm": cornerAlgToInfo[`J${letter}`][4]},
            { "id": 6, "algorithm": cornerAlgToInfo[`J${letter}`][5]},
            { "id": 7, "algorithm": cornerAlgToInfo[`J${letter}`][6]},
            { "id": 8, "algorithm": cornerAlgToInfo[`J${letter}`][7]},
            { "id": 9, "algorithm": cornerAlgToInfo[`J${letter}`][8]},
            { "id": 10, "algorithm": cornerAlgToInfo[`J${letter}`][9]},
            { "id": 11, "algorithm": cornerAlgToInfo[`J${letter}`][10]},
            { "id": 12, "algorithm": cornerAlgToInfo[`J${letter}`][11]},
            { "id": 13, "algorithm": cornerAlgToInfo[`J${letter}`][12]},
            { "id": 14, "algorithm": cornerAlgToInfo[`J${letter}`][13]},
            { "id": 15, "algorithm": cornerAlgToInfo[`J${letter}`][14]},
            { "id": 16, "algorithm": cornerAlgToInfo[`J${letter}`][15]},
            { "id": 17, "algorithm": cornerAlgToInfo[`J${letter}`][16]},
            { "id": 18, "algorithm": cornerAlgToInfo[`J${letter}`][17]}
        ],
        "create" : true,
        "persist": false,
        "onChange" (algorithm) {
            $(`#select-commutator-J${letter}`).text(commutator(algorithm));
            $(`#select-finger-J${letter}`).text(fingerbeginfrom(algorithm));
        },
        "createFilter" (value) {
            const simplifyValue = simplifyfinal(preprocessing(value));
            for (const optValue in this.options) {
                const algorithm = this.options[optValue].algorithm;
                if (simplifyValue === algorithm) {
                    return false;
                }
            }
            const cornerfullValue = cornerfull(simplifyValue);
            if (cornerfullValue.length !== 4 || cornerfullValue[2] + cornerfullValue[1] !== letter) {
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
const out = document.getElementById("out");

function upFile(ee) {
    const files = ee.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, {
            "type": "binary"
        });
        // DO SOMETHING WITH workbook HERE
        const tmp = X.utils.sheet_to_formulae(workbook.Sheets[workbook.SheetNames[0]]);
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
        for (let i = 2; i <= maxRowCount; i++) {
            if (obj.hasOwnProperty(arrayTitle[0] + i)) {
                const alg = simplifyfinal(preprocessing(obj[arrayTitle[1] + i].replace("'", "")));
                const cornerfullValue = cornerfull(alg);
                if (cornerfullValue.length !== 4 || cornerfullValue[0] !== "J") {
                    continue;
                }
                const letter = cornerfullValue[2] + cornerfullValue[1];
                const selectize = $(`#select-algorithm-J${letter}`).selectize()[0].selectize;
                selectize.addOption([{"id": "0", "algorithm": alg}]);
                selectize.setValue([0, alg]);
            }
        }
    };
    reader.readAsBinaryString(files);
}
function downFile() {
    const Datas = {
        "Sheet1": []
    };
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
        const selectize = $(`#select-algorithm-J${algdisplay}`).selectize()[0].selectize;
        const algorithm = selectize.getValue();
        Datas.Sheet1.push({"编码":letter, "公式":algorithm, "交换子": commutator(algorithm), "起手":fingerbeginfrom(algorithm)});
    }
    const Sheet1 = X.utils.json_to_sheet(Datas.Sheet1);
    const wb = X.utils.book_new();
    X.utils.book_append_sheet(wb, Sheet1, "Sheet1");
    XLSX.writeFile(wb, "公式集.xlsx");
}
upfile.addEventListener("change", upFile, false);
downfile.addEventListener("click", downFile, false);