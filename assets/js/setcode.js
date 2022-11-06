"use strict";

const idOrder = ["a11", "a12", "a13", "a14", "a16", "a17", "a18", "a19", "a21", "a22", "a23", "a24", "a26", "a27", "a28", "a29", "a31", "a32", "a33", "a34", "a36", "a37", "a38", "a39", "a41", "a42", "a43", "a44", "a46", "a47", "a48", "a49", "a51", "a52", "a53", "a54", "a56", "a57", "a58", "a59", "a61", "a62", "a63", "a64", "a66", "a67", "a68", "a69"];

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
        setCookie("code", codecookie, 30);
    } else if (byid("codeinput") !== null) {
        codecookie = getCookie("code");
    }
    if (byid("codeinput") !== null) {
        let count = 0;
        for (const i of idOrder) {
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
    setCookie("codeinput", casenum, 30);
}

window.onload = function onload() {
    if (byid("codeinput") !== null) {
        setColor(getCookie("codeinput"));
    }
    init();
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
    setCookie("code", str, 30);
}

function setChichu() {
    const str = "DEGCGAAJWIXKOOMREDCXTQLMKHIRZZPSBBLSQNJYHFFYWTNP";
    let count = 0;
    for (const i of idOrder) {
        byid(i).value = str[count];
        count = count + 1;
    }
    setCookie("code", str, 30);
}

function setSpeffz() {
    const str = "AABDBDCCUUVXVXWWEEFHFHGGMMNPNPOOIIJLJLKKQQRTRTSS";
    let count = 0;
    for (const i of idOrder) {
        byid(i).value = str[count];
        count = count + 1;
    }
    setCookie("code", str, 30);
}