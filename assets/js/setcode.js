"use strict";

const cornerCodeToCustom = {
    "a11": "D",
    "a12": "E",
    "a13": "G",
    "a14": "C",
    "a16": "G",
    "a17": "A",
    "a18": "A",
    "a19": "J",
    "a21": "W",
    "a22": "I",
    "a23": "X",
    "a24": "K",
    "a26": "O",
    "a27": "O",
    "a28": "M",
    "a29": "R",
    "a31": "E",
    "a32": "D",
    "a33": "C",
    "a34": "X",
    "a36": "T",
    "a37": "Q",
    "a38": "L",
    "a39": "M",
    "a41": "K",
    "a42": "H",
    "a43": "I",
    "a44": "R",
    "a46": "Z",
    "a47": "Z",
    "a48": "P",
    "a49": "S",
    "a51": "B",
    "a52": "B",
    "a53": "L",
    "a54": "S",
    "a56": "Q",
    "a57": "N",
    "a58": "J",
    "a59": "Y",
    "a61": "H",
    "a62": "F",
    "a63": "F",
    "a64": "Y",
    "a66": "W",
    "a67": "T",
    "a68": "N",
    "a69": "P"
};

const cornerCodeToSpeffz = {
    "a11": "A",
    "a12": "A",
    "a13": "B",
    "a14": "D",
    "a16": "B",
    "a17": "D",
    "a18": "C",
    "a19": "C",
    "a21": "U",
    "a22": "U",
    "a23": "V",
    "a24": "X",
    "a26": "V",
    "a27": "X",
    "a28": "W",
    "a29": "W",
    "a31": "E",
    "a32": "E",
    "a33": "F",
    "a34": "H",
    "a36": "F",
    "a37": "H",
    "a38": "G",
    "a39": "G",
    "a41": "M",
    "a42": "M",
    "a43": "N",
    "a44": "P",
    "a46": "N",
    "a47": "P",
    "a48": "O",
    "a49": "O",
    "a51": "I",
    "a52": "I",
    "a53": "J",
    "a54": "L",
    "a56": "J",
    "a57": "L",
    "a58": "K",
    "a59": "K",
    "a61": "Q",
    "a62": "Q",
    "a63": "R",
    "a64": "T",
    "a66": "R",
    "a67": "T",
    "a68": "S",
    "a69": "S"
};

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toGMTString()}`;
    document.cookie = `${cname}=${cvalue};${expires};`;
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
    for (const i in cornerCodeToCustom) {
        if (byid(i) === null) {
            if (getCookie(i) === "") {
                setCookie(i, cornerCodeToCustom[i], 30);
            }
        } else {
            if (byid(i).value === "") {
                byid(i).value = cornerCodeToCustom[i];
            }
            if (getCookie(i) === "") {
                setCookie(i, byid(i).value, 30);
            } else {
                byid(i).value = getCookie(i);
            }
        }
    }
}

function setColor() {
    let color1 = "1",
        color2 = "2",
        color3 = "3",
        color4 = "4",
        color5 = "5",
        color6 = "6";
    switch (document.getElementById("codeinput").value) {
    case "黄顶红前":
        [color1, color2, color3, color4, color5, color6] = ["1", "2", "3", "4", "5", "6"];
        break;
    case "黄顶橙前":
        [color1, color2, color3, color4, color5, color6] = ["1", "4", "5", "2", "3", "6"];
        break;
    case "黄顶蓝前":
        [color1, color2, color3, color4, color5, color6] = ["1", "5", "2", "3", "4", "6"];
        break;
    case "黄顶绿前":
        [color1, color2, color3, color4, color5, color6] = ["1", "3", "4", "5", "2", "6"];
        break;
    case "白顶红前":
        [color1, color2, color3, color4, color5, color6] = ["6", "4", "3", "2", "5", "1"];
        break;
    case "白顶橙前":
        [color1, color2, color3, color4, color5, color6] = ["6", "2", "5", "4", "3", "1"];
        break;
    case "白顶蓝前":
        [color1, color2, color3, color4, color5, color6] = ["6", "3", "2", "5", "4", "1"];
        break;
    case "白顶绿前":
        [color1, color2, color3, color4, color5, color6] = ["6", "5", "4", "3", "2", "1"];
        break;
    case "蓝顶红前":
        [color1, color2, color3, color4, color5, color6] = ["2", "6", "3", "1", "5", "4"];
        break;
    case "蓝顶橙前":
        [color1, color2, color3, color4, color5, color6] = ["2", "1", "5", "6", "3", "4"];
        break;
    case "蓝顶黄前":
        [color1, color2, color3, color4, color5, color6] = ["2", "3", "1", "5", "6", "4"];
        break;
    case "蓝顶白前":
        [color1, color2, color3, color4, color5, color6] = ["2", "5", "6", "3", "1", "4"];
        break;
    case "绿顶红前":
        [color1, color2, color3, color4, color5, color6] = ["4", "1", "3", "6", "5", "2"];
        break;
    case "绿顶橙前":
        [color1, color2, color3, color4, color5, color6] = ["4", "6", "5", "1", "3", "2"];
        break;
    case "绿顶黄前":
        [color1, color2, color3, color4, color5, color6] = ["4", "5", "1", "3", "6", "2"];
        break;
    case "绿顶白前":
        [color1, color2, color3, color4, color5, color6] = ["4", "3", "6", "5", "1", "2"];
        break;
    case "红顶蓝前":
        [color1, color2, color3, color4, color5, color6] = ["3", "1", "2", "6", "4", "5"];
        break;
    case "红顶绿前":
        [color1, color2, color3, color4, color5, color6] = ["3", "6", "4", "1", "2", "5"];
        break;
    case "红顶黄前":
        [color1, color2, color3, color4, color5, color6] = ["3", "4", "1", "2", "6", "5"];
        break;
    case "红顶白前":
        [color1, color2, color3, color4, color5, color6] = ["3", "2", "6", "4", "1", "5"];
        break;
    case "橙顶蓝前":
        [color1, color2, color3, color4, color5, color6] = ["5", "6", "2", "1", "4", "3"];
        break;
    case "橙顶绿前":
        [color1, color2, color3, color4, color5, color6] = ["5", "1", "4", "6", "2", "3"];
        break;
    case "橙顶黄前":
        [color1, color2, color3, color4, color5, color6] = ["5", "2", "1", "4", "6", "3"];
        break;
    case "橙顶白前":
        [color1, color2, color3, color4, color5, color6] = ["5", "4", "6", "2", "1", "3"];
        break;
    default:
        break;
    }
    document.getElementById("table").innerHTML = `
        <tbody>
        <tr>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color1}><input id="a11" class="xl${color1} input" onkeyup="setAll()"></td>
          <td class=xl${color1}><input id="a12" class="xl${color1} input" onkeyup="setAll()"></td>
          <td class=xl${color1}><input id="a13" class="xl${color1} input" onkeyup="setAll()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color1}><input id="a14" class="xl${color1} input" onkeyup="setAll()"></td>
          <td class=xl${color1}></td>
          <td class=xl${color1}><input id="a16" class="xl${color1} input" onkeyup="setAll()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color1}><input id="a17" class="xl${color1} input" onkeyup="setAll()"></td>
          <td class=xl${color1}><input id="a18" class="xl${color1} input" onkeyup="setAll()"></td>
          <td class=xl${color1}><input id="a19" class="xl${color1} input" onkeyup="setAll()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl${color2}><input id="a31" class="xl${color2} input" onkeyup="setAll()"></td>
          <td class=xl${color2}><input id="a32" class="xl${color2} input" onkeyup="setAll()"></td>
          <td class=xl${color2}><input id="a33" class="xl${color2} input" onkeyup="setAll()"></td>
          <td class=xl${color3}><input id="a51" class="xl${color3} input" onkeyup="setAll()"></td>
          <td class=xl${color3}><input id="a52" class="xl${color3} input" onkeyup="setAll()"></td>
          <td class=xl${color3}><input id="a53" class="xl${color3} input" onkeyup="setAll()"></td>
          <td class=xl${color4}><input id="a41" class="xl${color4} input" onkeyup="setAll()"></td>
          <td class=xl${color4}><input id="a42" class="xl${color4} input" onkeyup="setAll()"></td>
          <td class=xl${color4}><input id="a43" class="xl${color4} input" onkeyup="setAll()"></td>
          <td class=xl${color5}><input id="a61" class="xl${color5} input" onkeyup="setAll()"></td>
          <td class=xl${color5}><input id="a62" class="xl${color5} input" onkeyup="setAll()"></td>
          <td class=xl${color5}><input id="a63" class="xl${color5} input" onkeyup="setAll()"></td>
        </tr>
        <tr>
          <td class=xl${color2}><input id="a34" class="xl${color2} input" onkeyup="setAll()"></td>
          <td class=xl${color2}></td>
          <td class=xl${color2}><input id="a36" class="xl${color2} input" onkeyup="setAll()"></td>
          <td class=xl${color3}><input id="a54" class="xl${color3} input" onkeyup="setAll()"></td>
          <td class=xl${color3}></td>
          <td class=xl${color3}><input id="a56" class="xl${color3} input" onkeyup="setAll()"></td>
          <td class=xl${color4}><input id="a44" class="xl${color4} input" onkeyup="setAll()"></td>
          <td class=xl${color4}></td>
          <td class=xl${color4}><input id="a46" class="xl${color4} input" onkeyup="setAll()"></td>
          <td class=xl${color5}><input id="a64" class="xl${color5} input" onkeyup="setAll()"></td>
          <td class=xl${color5}></td>
          <td class=xl${color5}><input id="a66" class="xl${color5} input" onkeyup="setAll()"></td>
        </tr>
        <tr>
          <td class=xl${color2}><input id="a37" class="xl${color2} input" onkeyup="setAll()"></td>
          <td class=xl${color2}><input id="a38" class="xl${color2} input" onkeyup="setAll()"></td>
          <td class=xl${color2}><input id="a39" class="xl${color2} input" onkeyup="setAll()"></td>
          <td class=xl${color3}><input id="a57" class="xl${color3} input" onkeyup="setAll()"></td>
          <td class=xl${color3}><input id="a58" class="xl${color3} input" onkeyup="setAll()"></td>
          <td class=xl${color3}><input id="a59" class="xl${color3} input" onkeyup="setAll()"></td>
          <td class=xl${color4}><input id="a47" class="xl${color4} input" onkeyup="setAll()"></td>
          <td class=xl${color4}><input id="a48" class="xl${color4} input" onkeyup="setAll()"></td>
          <td class=xl${color4}><input id="a49" class="xl${color4} input" onkeyup="setAll()"></td>
          <td class=xl${color5}><input id="a67" class="xl${color5} input" onkeyup="setAll()"></td>
          <td class=xl${color5}><input id="a68" class="xl${color5} input" onkeyup="setAll()"></td>
          <td class=xl${color5}><input id="a69" class="xl${color5} input" onkeyup="setAll()"></td>
        </tr>
        <tr>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color6}><input id="a21" class="xl${color6} input" onkeyup="setAll()"></td>
          <td class=xl${color6}><input id="a22" class="xl${color6} input" onkeyup="setAll()"></td>
          <td class=xl${color6}><input id="a23" class="xl${color6} input" onkeyup="setAll()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color6}><input id="a24" class="xl${color6} input" onkeyup="setAll()"></td>
          <td class=xl${color6}></td>
          <td class=xl${color6}><input id="a26" class="xl${color6} input" onkeyup="setAll()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
        <tr>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl${color6}><input id="a27" class="xl${color6} input" onkeyup="setAll()"></td>
          <td class=xl${color6}><input id="a28" class="xl${color6} input" onkeyup="setAll()"></td>
          <td class=xl${color6}><input id="a29" class="xl${color6} input" onkeyup="setAll()"></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
          <td class=xl0></td>
        </tr>
      </tbody>`;
    init();
    setCookie("codeinput", encodeURI(byid("codeinput").value), 30);
}

window.onload = function onload() {
    if (document.title === "编码") {
        if (getCookie("codeinput") !== "") {
            byid("codeinput").value = decodeURI(getCookie("codeinput"));
        }
        setColor();
    }
    init();
};

function byid(id) {
    return document.getElementById(id);
}

function setAll() {
    for (const i in cornerCodeToCustom) {
        setCookie(i, byid(i).value, 30);
    }
}

function setChichu() {
    for (const i in cornerCodeToCustom) {
        byid(i).value = cornerCodeToCustom[i];
        setCookie(i, byid(i).value, 30);
    }
}

function setSpeffz() {
    for (const i in cornerCodeToSpeffz) {
        byid(i).value = cornerCodeToSpeffz[i];
        setCookie(i, byid(i).value, 30);
    }
}