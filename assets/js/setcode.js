"use strict";

const idOrder = ["a11", "a12", "a13", "a14", "a16", "a17", "a18", "a19", "a21", "a22", "a23", "a24", "a26", "a27", "a28", "a29", "a31", "a32", "a33", "a34", "a36", "a37", "a38", "a39", "a41", "a42", "a43", "a44", "a46", "a47", "a48", "a49", "a51", "a52", "a53", "a54", "a56", "a57", "a58", "a59", "a61", "a62", "a63", "a64", "a66", "a67", "a68", "a69"];

const idOrderBig = ["a101", "a102", "a103", "a104", "a105", "a106", "a107", "a108", "a109", "a110", "a111", "a112", "a114", "a115", "a116", "a117", "a118", "a119", "a120", "a121", "a122", "a123", "a124", "a125", "a201", "a202", "a203", "a204", "a205", "a206", "a207", "a208", "a209", "a210", "a211", "a212", "a214", "a215", "a216", "a217", "a218", "a219", "a220", "a221", "a222", "a223", "a224", "a225", "a301", "a302", "a303", "a304", "a305", "a306", "a307", "a308", "a309", "a310", "a311", "a312", "a314", "a315", "a316", "a317", "a318", "a319", "a320", "a321", "a322", "a323", "a324", "a325", "a401", "a402", "a403", "a404", "a405", "a406", "a407", "a408", "a409", "a410", "a411", "a412", "a414", "a415", "a416", "a417", "a418", "a419", "a420", "a421", "a422", "a423", "a424", "a425", "a501", "a502", "a503", "a504", "a505", "a506", "a507", "a508", "a509", "a510", "a511", "a512", "a514", "a515", "a516", "a517", "a518", "a519", "a520", "a521", "a522", "a523", "a524", "a525", "a601", "a602", "a603", "a604", "a605", "a606", "a607", "a608", "a609", "a610", "a611", "a612", "a614", "a615", "a616", "a617", "a618", "a619", "a620", "a621", "a622", "a623", "a624", "a625"];

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toGMTString()}`;
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function getCookie(cname) {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function init() {
    let codecookie = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    if (getCookie("code") === "") {
        setCookie("code", codecookie, 400);
    } else if (byid("codeinput") !== null && byid("wingcodeinput") === null) {
        codecookie = getCookie("code");
    }
    if (byid("codeinput") !== null && byid("wingcodeinput") === null) {
        let count = 0;
        for (const i of idOrder) {
            byid(i).value = codecookie[count];
            count = count + 1;
        }
    }
}

function initBig() {
    let codecookie = "DEE G DEGGCCGGCAAJ A AAJWII X WIXOKKOOKOMR O MMREDD C EDCTXXTTXQLM Q LLMKHH I KHIZRRZZRZPS Z PPSBBB L BBLQSSQQSNJY N JJYHFF F HFFWYYWWYTNP T NNP";
    if (getCookie("codeBig") === "") {
        setCookie("codeBig", codecookie, 400);
    } else if (byid("codeinput") !== null && byid("wingcodeinput") !== null) {
        codecookie = getCookie("codeBig");
    }
    if (byid("codeinput") !== null && byid("wingcodeinput") !== null) {
        let count = 0;
        for (const i of idOrderBig) {
            byid(i).value = codecookie[count];
            count = count + 1;
        }
    }
}

function setColor(casenumgiven) {
    let color1 = "1",
        color2 = "2",
        color3 = "3",
        color4 = "4",
        color5 = "5",
        color6 = "6";
    let casenum = document.getElementById("codeinput").value;
    if (casenumgiven !== "" && casenumgiven >= 1 && casenumgiven <= 24) {
        casenum = casenumgiven;
    }
    switch (casenum) {
    case "1":
        [color1, color2, color3, color4, color5, color6] = ["1", "2", "3", "4", "5", "6"];
        break;
    case "2":
        [color1, color2, color3, color4, color5, color6] = ["1", "4", "5", "2", "3", "6"];
        break;
    case "3":
        [color1, color2, color3, color4, color5, color6] = ["1", "5", "2", "3", "4", "6"];
        break;
    case "4":
        [color1, color2, color3, color4, color5, color6] = ["1", "3", "4", "5", "2", "6"];
        break;
    case "5":
        [color1, color2, color3, color4, color5, color6] = ["6", "4", "3", "2", "5", "1"];
        break;
    case "6":
        [color1, color2, color3, color4, color5, color6] = ["6", "2", "5", "4", "3", "1"];
        break;
    case "7":
        [color1, color2, color3, color4, color5, color6] = ["6", "3", "2", "5", "4", "1"];
        break;
    case "8":
        [color1, color2, color3, color4, color5, color6] = ["6", "5", "4", "3", "2", "1"];
        break;
    case "9":
        [color1, color2, color3, color4, color5, color6] = ["2", "6", "3", "1", "5", "4"];
        break;
    case "10":
        [color1, color2, color3, color4, color5, color6] = ["2", "1", "5", "6", "3", "4"];
        break;
    case "11":
        [color1, color2, color3, color4, color5, color6] = ["2", "3", "1", "5", "6", "4"];
        break;
    case "12":
        [color1, color2, color3, color4, color5, color6] = ["2", "5", "6", "3", "1", "4"];
        break;
    case "13":
        [color1, color2, color3, color4, color5, color6] = ["4", "1", "3", "6", "5", "2"];
        break;
    case "14":
        [color1, color2, color3, color4, color5, color6] = ["4", "6", "5", "1", "3", "2"];
        break;
    case "15":
        [color1, color2, color3, color4, color5, color6] = ["4", "5", "1", "3", "6", "2"];
        break;
    case "16":
        [color1, color2, color3, color4, color5, color6] = ["4", "3", "6", "5", "1", "2"];
        break;
    case "17":
        [color1, color2, color3, color4, color5, color6] = ["3", "1", "2", "6", "4", "5"];
        break;
    case "18":
        [color1, color2, color3, color4, color5, color6] = ["3", "6", "4", "1", "2", "5"];
        break;
    case "19":
        [color1, color2, color3, color4, color5, color6] = ["3", "4", "1", "2", "6", "5"];
        break;
    case "20":
        [color1, color2, color3, color4, color5, color6] = ["3", "2", "6", "4", "1", "5"];
        break;
    case "21":
        [color1, color2, color3, color4, color5, color6] = ["5", "6", "2", "1", "4", "3"];
        break;
    case "22":
        [color1, color2, color3, color4, color5, color6] = ["5", "1", "4", "6", "2", "3"];
        break;
    case "23":
        [color1, color2, color3, color4, color5, color6] = ["5", "2", "1", "4", "6", "3"];
        break;
    case "24":
        [color1, color2, color3, color4, color5, color6] = ["5", "4", "6", "2", "1", "3"];
        break;
    default:
        break;
    }
    document.getElementById("table").innerHTML = `
        <tbody>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color1}><input id="a11" class="xl${color1} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a12" class="xl${color1} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a13" class="xl${color1} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color1}><input id="a14" class="xl${color1} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}></td>
          <td class=xl${color1}><input id="a16" class="xl${color1} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color1}><input id="a17" class="xl${color1} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a18" class="xl${color1} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a19" class="xl${color1} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl${color2} style="border:2px solid black"><input id="a31" class="xl${color2} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a32" class="xl${color2} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a33" class="xl${color2} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a51" class="xl${color3} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a52" class="xl${color3} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a53" class="xl${color3} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a41" class="xl${color4} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a42" class="xl${color4} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a43" class="xl${color4} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a61" class="xl${color5} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a62" class="xl${color5} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a63" class="xl${color5} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
        </tr>
        <tr>
          <td class=xl${color2} style="border:2px solid black"><input id="a34" class="xl${color2} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}></td>
          <td class=xl${color2}><input id="a36" class="xl${color2} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a54" class="xl${color3} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}></td>
          <td class=xl${color3}><input id="a56" class="xl${color3} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a44" class="xl${color4} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}></td>
          <td class=xl${color4}><input id="a46" class="xl${color4} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a64" class="xl${color5} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}></td>
          <td class=xl${color5}><input id="a66" class="xl${color5} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
        </tr>
        <tr>
          <td class=xl${color2} style="border:2px solid black"><input id="a37" class="xl${color2} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a38" class="xl${color2} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a39" class="xl${color2} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a57" class="xl${color3} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a58" class="xl${color3} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a59" class="xl${color3} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a47" class="xl${color4} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a48" class="xl${color4} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a49" class="xl${color4} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a67" class="xl${color5} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a68" class="xl${color5} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a69" class="xl${color5} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
        </tr>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color6}><input id="a21" class="xl${color6} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a22" class="xl${color6} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a23" class="xl${color6} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color6}><input id="a24" class="xl${color6} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}></td>
          <td class=xl${color6}><input id="a26" class="xl${color6} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color6}><input id="a27" class="xl${color6} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a28" class="xl${color6} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a29" class="xl${color6} input" maxlength="1" onkeyup="setAll()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
      </tbody>`;
    init();
    document.getElementById("codeinput").value = casenum;
    setCookie("codeinput", casenum, 400);
}

function setColorBig(casenumgiven, wingnumgiven) {
    let color1 = "1",
        color2 = "2",
        color3 = "3",
        color4 = "4",
        color5 = "5",
        color6 = "6";
    let casenum = document.getElementById("codeinput").value;
    if (casenumgiven !== "" && casenumgiven >= 1 && casenumgiven <= 24) {
        casenum = casenumgiven;
    }
    switch (casenum) {
    case "1":
        [color1, color2, color3, color4, color5, color6] = ["1", "2", "3", "4", "5", "6"];
        break;
    case "2":
        [color1, color2, color3, color4, color5, color6] = ["1", "4", "5", "2", "3", "6"];
        break;
    case "3":
        [color1, color2, color3, color4, color5, color6] = ["1", "5", "2", "3", "4", "6"];
        break;
    case "4":
        [color1, color2, color3, color4, color5, color6] = ["1", "3", "4", "5", "2", "6"];
        break;
    case "5":
        [color1, color2, color3, color4, color5, color6] = ["6", "4", "3", "2", "5", "1"];
        break;
    case "6":
        [color1, color2, color3, color4, color5, color6] = ["6", "2", "5", "4", "3", "1"];
        break;
    case "7":
        [color1, color2, color3, color4, color5, color6] = ["6", "3", "2", "5", "4", "1"];
        break;
    case "8":
        [color1, color2, color3, color4, color5, color6] = ["6", "5", "4", "3", "2", "1"];
        break;
    case "9":
        [color1, color2, color3, color4, color5, color6] = ["2", "6", "3", "1", "5", "4"];
        break;
    case "10":
        [color1, color2, color3, color4, color5, color6] = ["2", "1", "5", "6", "3", "4"];
        break;
    case "11":
        [color1, color2, color3, color4, color5, color6] = ["2", "3", "1", "5", "6", "4"];
        break;
    case "12":
        [color1, color2, color3, color4, color5, color6] = ["2", "5", "6", "3", "1", "4"];
        break;
    case "13":
        [color1, color2, color3, color4, color5, color6] = ["4", "1", "3", "6", "5", "2"];
        break;
    case "14":
        [color1, color2, color3, color4, color5, color6] = ["4", "6", "5", "1", "3", "2"];
        break;
    case "15":
        [color1, color2, color3, color4, color5, color6] = ["4", "5", "1", "3", "6", "2"];
        break;
    case "16":
        [color1, color2, color3, color4, color5, color6] = ["4", "3", "6", "5", "1", "2"];
        break;
    case "17":
        [color1, color2, color3, color4, color5, color6] = ["3", "1", "2", "6", "4", "5"];
        break;
    case "18":
        [color1, color2, color3, color4, color5, color6] = ["3", "6", "4", "1", "2", "5"];
        break;
    case "19":
        [color1, color2, color3, color4, color5, color6] = ["3", "4", "1", "2", "6", "5"];
        break;
    case "20":
        [color1, color2, color3, color4, color5, color6] = ["3", "2", "6", "4", "1", "5"];
        break;
    case "21":
        [color1, color2, color3, color4, color5, color6] = ["5", "6", "2", "1", "4", "3"];
        break;
    case "22":
        [color1, color2, color3, color4, color5, color6] = ["5", "1", "4", "6", "2", "3"];
        break;
    case "23":
        [color1, color2, color3, color4, color5, color6] = ["5", "2", "1", "4", "6", "3"];
        break;
    case "24":
        [color1, color2, color3, color4, color5, color6] = ["5", "4", "6", "2", "1", "3"];
        break;
    default:
        break;
    }
    document.getElementById("table").innerHTML = `
        <tbody>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color1}><input id="a101" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a102" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a103" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a104" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a105" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color1}><input id="a106" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a107" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a108" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a109" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a110" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color1}><input id="a111" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a112" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}></td>
          <td class=xl${color1}><input id="a114" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a115" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color1}><input id="a116" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a117" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a118" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a119" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a120" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color1}><input id="a121" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a122" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a123" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a124" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color1}><input id="a125" class="xl${color1} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl${color2} style="border:2px solid black"><input id="a301" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a302" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a303" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a304" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a305" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a501" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a502" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a503" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a504" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a505" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a401" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a402" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a403" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a404" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a405" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a601" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a602" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a603" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a604" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a605" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
        </tr>
        <tr>
          <td class=xl${color2} style="border:2px solid black"><input id="a306" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a307" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a308" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a309" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a310" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a506" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a507" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a508" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a509" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a510" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a406" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a407" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a408" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a409" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a410" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a606" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a607" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a608" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a609" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a610" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
        </tr>
        <tr>
          <td class=xl${color2} style="border:2px solid black"><input id="a311" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a312" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}></td>
          <td class=xl${color2}><input id="a314" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a315" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a511" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a512" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}></td>
          <td class=xl${color3}><input id="a514" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a515" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a411" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a412" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}></td>
          <td class=xl${color4}><input id="a414" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a415" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a611" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a612" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}></td>
          <td class=xl${color5}><input id="a614" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a615" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
        </tr>
        <tr>
          <td class=xl${color2} style="border:2px solid black"><input id="a316" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a317" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a318" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a319" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a320" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a516" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a517" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a518" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a519" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a520" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a416" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a417" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a418" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a419" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a420" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a616" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a617" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a618" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a619" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a620" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
        </tr>
        <tr>
          <td class=xl${color2} style="border:2px solid black"><input id="a321" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a322" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a323" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a324" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color2}><input id="a325" class="xl${color2} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a521" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a522" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a523" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a524" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color3}><input id="a525" class="xl${color3} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a421" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a422" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a423" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a424" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color4}><input id="a425" class="xl${color4} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a621" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a622" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a623" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a624" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color5}><input id="a625" class="xl${color5} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
        </tr>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color6}><input id="a201" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a202" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a203" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a204" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a205" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color6}><input id="a206" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a207" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a208" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a209" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a210" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color6}><input id="a211" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a212" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}></td>
          <td class=xl${color6}><input id="a214" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a215" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color6}><input id="a216" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a217" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a218" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a219" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a220" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0 style="border-left:0"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color6}><input id="a221" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a222" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a223" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a224" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl${color6}><input id="a225" class="xl${color6} input" maxlength="1" onkeyup="setAllBig()" style="text-transform:uppercase" onfocus="this.select()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
      </tbody>`;
    initBig();
    document.getElementById("codeinput").value = casenum;
    if (wingnumgiven === 0) {
        if (document.getElementById("a102").value === " ") {
            document.getElementById("wingcodeinput").value = "2";
        } else {
            document.getElementById("wingcodeinput").value = "1";
        }
    }
    const wingnum = document.getElementById("wingcodeinput").value;
    if (wingnum === "1") {
        for (let i = 1; i <= 6; i++) {
            document.getElementById(`a${i.toString()}04`).disabled = true;
            document.getElementById(`a${i.toString()}06`).disabled = true;
            document.getElementById(`a${i.toString()}20`).disabled = true;
            document.getElementById(`a${i.toString()}22`).disabled = true;
            document.getElementById(`a${i.toString()}02`).disabled = false;
            document.getElementById(`a${i.toString()}10`).disabled = false;
            document.getElementById(`a${i.toString()}16`).disabled = false;
            document.getElementById(`a${i.toString()}24`).disabled = false;
        }
    } else if (wingnum === "2") {
        for (let i = 1; i <= 6; i++) {
            document.getElementById(`a${i.toString()}02`).disabled = true;
            document.getElementById(`a${i.toString()}10`).disabled = true;
            document.getElementById(`a${i.toString()}16`).disabled = true;
            document.getElementById(`a${i.toString()}24`).disabled = true;
            document.getElementById(`a${i.toString()}04`).disabled = false;
            document.getElementById(`a${i.toString()}06`).disabled = false;
            document.getElementById(`a${i.toString()}20`).disabled = false;
            document.getElementById(`a${i.toString()}22`).disabled = false;
        }
    }
    if (wingnumgiven === 1) {
        if (wingnum === "1" && document.getElementById("a102").value === " ") {
            for (let i = 1; i <= 6; i++) {
                let temp = 0;
                temp = document.getElementById(`a${i.toString()}04`).value;
                document.getElementById(`a${i.toString()}04`).value = document.getElementById(`a${i.toString()}02`).value;
                document.getElementById(`a${i.toString()}02`).value = temp;
                temp = document.getElementById(`a${i.toString()}06`).value;
                document.getElementById(`a${i.toString()}06`).value = document.getElementById(`a${i.toString()}16`).value;
                document.getElementById(`a${i.toString()}16`).value = temp;
                temp = document.getElementById(`a${i.toString()}20`).value;
                document.getElementById(`a${i.toString()}20`).value = document.getElementById(`a${i.toString()}10`).value;
                document.getElementById(`a${i.toString()}10`).value = temp;
                temp = document.getElementById(`a${i.toString()}22`).value;
                document.getElementById(`a${i.toString()}22`).value = document.getElementById(`a${i.toString()}24`).value;
                document.getElementById(`a${i.toString()}24`).value = temp;
                setAllBig();
            }
        } else if (wingnum === "2" && document.getElementById("a104").value === " ") {
            for (let i = 1; i <= 6; i++) {
                let temp = 0;
                temp = document.getElementById(`a${i.toString()}02`).value;
                document.getElementById(`a${i.toString()}02`).value = document.getElementById(`a${i.toString()}04`).value;
                document.getElementById(`a${i.toString()}04`).value = temp;
                temp = document.getElementById(`a${i.toString()}10`).value;
                document.getElementById(`a${i.toString()}10`).value = document.getElementById(`a${i.toString()}20`).value;
                document.getElementById(`a${i.toString()}20`).value = temp;
                temp = document.getElementById(`a${i.toString()}16`).value;
                document.getElementById(`a${i.toString()}16`).value = document.getElementById(`a${i.toString()}06`).value;
                document.getElementById(`a${i.toString()}06`).value = temp;
                temp = document.getElementById(`a${i.toString()}24`).value;
                document.getElementById(`a${i.toString()}24`).value = document.getElementById(`a${i.toString()}22`).value;
                document.getElementById(`a${i.toString()}22`).value = temp;
                setAllBig();
            }
        }
    }
    setCookie("codeinput", casenum, 400);
}

window.onload = function onload() {
    if (byid("codeinput") !== null) {
        if (byid("wingcodeinput") === null) {
            setColor(getCookie("codeinput"));
        } else {
            setColorBig(getCookie("codeinput"), 0);
        }
    }
    init();
    initBig();
};

function byid(id) {
    return document.getElementById(id);
}

function setAll() {
    let str = "";
    let count = 0;
    const codecookie = getCookie("code");
    for (const i of idOrder) {
        if (byid(i).value === "") {
            str = str + codecookie[count];
        } else {
            str = str + byid(i).value.toUpperCase();
        }
        count = count + 1;
    }
    setCookie("code", str, 400);
}

function setChichu() {
    const str = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    let count = 0;
    for (const i of idOrder) {
        byid(i).value = str[count];
        count = count + 1;
    }
    setCookie("code", str, 400);
}

function setSpeffz() {
    const str = "AABDBDCCUUVXVXWWEEFHFHGGMMNPNPOOIIJLJLKKQQRTRTSS";
    let count = 0;
    for (const i of idOrder) {
        byid(i).value = str[count];
        count = count + 1;
    }
    setCookie("code", str, 400);
}

function setAllBig() {
    let str = "";
    let count = 0;
    const codecookie = getCookie("codeBig");
    for (const i of idOrderBig) {
        if (byid(i).value === "") {
            str = str + codecookie[count];
        } else {
            str = str + byid(i).value.toUpperCase();
        }
        count = count + 1;
    }
    setCookie("codeBig", str, 400);
}

function setChichuBig() {
    const str = "DEE G DEGGCCGGCAAJ A AAJWII X WIXOKKOOKOMR O MMREDD C EDCTXXTTXQLM Q LLMKHH I KHIZRRZZRZPS Z PPSBBB L BBLQSSQQSNJY N JJYHFF F HFFWYYWWYTNP T NNP";
    let count = 0;
    for (const i of idOrderBig) {
        byid(i).value = str[count];
        count = count + 1;
    }
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`a${i.toString()}04`).disabled = true;
        document.getElementById(`a${i.toString()}06`).disabled = true;
        document.getElementById(`a${i.toString()}20`).disabled = true;
        document.getElementById(`a${i.toString()}22`).disabled = true;
        document.getElementById(`a${i.toString()}02`).disabled = false;
        document.getElementById(`a${i.toString()}10`).disabled = false;
        document.getElementById(`a${i.toString()}16`).disabled = false;
        document.getElementById(`a${i.toString()}24`).disabled = false;
    }
    document.getElementById("wingcodeinput").value = "1";
    setCookie("codeBig", str, 400);
}

function setSpeffzBig() {
    const str = "AAA B AABBDDBBDDCC D CCCUUU V UUVVXXVVXXWW X WWWEEE F EEFFHHFFHHGG H GGGMMM N MMNNPPNNPPOO P OOOIII J IIJJLLJJLLKK L KKKQQQ R QQRRTTRRTTSS T SSS";
    let count = 0;
    for (const i of idOrderBig) {
        byid(i).value = str[count];
        count = count + 1;
    }
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`a${i.toString()}04`).disabled = true;
        document.getElementById(`a${i.toString()}06`).disabled = true;
        document.getElementById(`a${i.toString()}20`).disabled = true;
        document.getElementById(`a${i.toString()}22`).disabled = true;
        document.getElementById(`a${i.toString()}02`).disabled = false;
        document.getElementById(`a${i.toString()}10`).disabled = false;
        document.getElementById(`a${i.toString()}16`).disabled = false;
        document.getElementById(`a${i.toString()}24`).disabled = false;
    }
    document.getElementById("wingcodeinput").value = "1";
    setCookie("codeBig", str, 400);
}