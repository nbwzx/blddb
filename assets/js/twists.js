"use strict";

$.ajaxSettings.async = false;
const jsonNameList = ["twistsAlgToInfo"];
const jsonLoaded = jsonNameList.map((name) => $.getJSON(`assets/json/${name}.json`, (json) => {
    window[`${name}`] = json;
}));

function algSearch() {
    let idValue = "";
    if (document.getElementById("cornerinput3").value === "cw") {
        idValue = `${idValue}C`;
    }
    if (document.getElementById("cornerinput3").value === "ccw") {
        idValue = `${idValue}B`;
    }
    if (document.getElementById("cornerinput4").value === "cw") {
        idValue = `${idValue}F`;
    }
    if (document.getElementById("cornerinput4").value === "ccw") {
        idValue = `${idValue}E`;
    }
    if (document.getElementById("cornerinput2").value === "cw") {
        idValue = `${idValue}I`;
    }
    if (document.getElementById("cornerinput2").value === "ccw") {
        idValue = `${idValue}H`;
    }
    if (document.getElementById("cornerinput1").value === "cw") {
        idValue = `${idValue}L`;
    }
    if (document.getElementById("cornerinput1").value === "ccw") {
        idValue = `${idValue}K`;
    }
    if (document.getElementById("cornerinput7").value === "cw") {
        idValue = `${idValue}N`;
    }
    if (document.getElementById("cornerinput7").value === "ccw") {
        idValue = `${idValue}M`;
    }
    if (document.getElementById("cornerinput8").value === "cw") {
        idValue = `${idValue}Q`;
    }
    if (document.getElementById("cornerinput8").value === "ccw") {
        idValue = `${idValue}P`;
    }
    if (document.getElementById("cornerinput6").value === "cw") {
        idValue = `${idValue}T`;
    }
    if (document.getElementById("cornerinput6").value === "ccw") {
        idValue = `${idValue}S`;
    }
    if (document.getElementById("cornerinput5").value === "cw") {
        idValue = `${idValue}Z`;
    }
    if (document.getElementById("cornerinput5").value === "ccw") {
        idValue = `${idValue}Y`;
    }
    const div1 = document.getElementById("div1");
    if (twistsAlgToInfo.hasOwnProperty(idValue)) {
        const rows = twistsAlgToInfo[idValue].length;
        let tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        if (idValue.length === 2) {
            tab = `<table id="table"><thead><tr><th>${arrLang[lang]["no"]}</th><th>${arrLang[lang]["algorithm"]}</th><th>${arrLang[lang]["commutator"]}</th><th>${arrLang[lang]["thumbPosition"]}</th></tr></thead><tbody>`;
        }
        for (let i = 0; i < rows; i++) {
            tab += "<tr>";
            tab += `<td>${i + 1}</td>`;
            tab += `<td>${twistsAlgToInfo[idValue][i]}</td>`;
            if (idValue.length === 2) {
                tab += `<td>${commutator(twistsAlgToInfo[idValue][i])}</td>`;
            }
            tab += `<td>${fingerbeginfrom(twistsAlgToInfo[idValue][i])}</td>`;
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