const arrLang = {
    "en": {
        "title": "3BLD Algorithms Database",
        "description": "The online website for BLDDB.",
        "corner": "3-Style Corner",
        "2twists": "Corner Twist",
        "edge": "3-Style Edge",
        "2flips": "Edge Flip",
        "parity": "3BLD Parity",
        "3twists": "3 Corner Twist",
        "code": "Lettering Scheme",
        "introduction": "Readme",
        "cornerHint": "Please enter 3 letter pairs (buffer-position1-position2) you want to query (eg. JAD)",
        "edgeHint": "Please enter 3 letter pairs (buffer-position1-position2) you want to query (eg. ACG)",
        "2twistsHint": "Please enter the 2 positions you want to twist",
        "2flipsHint": "Please enter the 2 positions you want to flip",
        "parityHint": "Please enter the parity you want to solve",
        "3twistsHint": "Please enter the 3 positions you want to twist",
        "position": "Position: ",
        "pairs": "Letter Pairs: ",
        "setup": "Set up: ",
        "cw": "CW: ",
        "ccw": "CCW: ",
        "2flips1": "Position1: ",
        "2flips2": "Position2: ",
        "parity1": "Edge:",
        "parity2": "Corner:",
        "3twistscw": "CW",
        "3twistsccw": "CCW",
        "codeChichu": "Chinese Lettering Scheme",
        "codeSpeffz": "Speffz Lettering Scheme",
        "codeLetterSetting": "Lettering Scheme Setting: ",
        "codeOrientationSetting": "Orientation Setting: ",
        "code1": "Yellow(top) - Red(front)",
        "code2": "Yellow(top) - Orange(front)",
        "code3": "Yellow(top) - Blue(front)",
        "code4": "Yellow(top) - Green(front)",
        "code5": "White(top) - Red(front)",
        "code6": "White(top) - Orange(front)",
        "code7": "White(top) - Blue(front)",
        "code8": "White(top) - Green(front)",
        "code9": "Blue(top) - Red(front)",
        "code10": "Blue(top) - Orange(front)",
        "code11": "Blue(top) - Yellow(front)",
        "code12": "Blue(top) - White(front)",
        "code13": "Green(top) - Red(front)",
        "code14": "Green(top) - Orange(front)",
        "code15": "Green(top) - Yellow(front)",
        "code16": "Green(top) - White(front)",
        "code17": "Red(top) - Blue(front)",
        "code18": "Red(top) - Green(front)",
        "code19": "Red(top) - Yellow(front)",
        "code20": "Red(top) - White(front)",
        "code21": "Orange(top) - Blue(front)",
        "code22": "Orange(top) - Green(front)",
        "code23": "Orange(top) - Yellow(front)",
        "code24": "Orange(top) - White(front)",
        "thumbup": "Thumb up",
        "thumbdown": "Thumb down",
        "homegrip": "Home grip",
        "all": "All",
        "no": "No.",
        "algorithm": "Algorithm",
        "commutator": "Commutator",
        "thumbPosition": "Thumb Position",
        "buffer":"Buffer: ",
        "nightmare": "Nightmare Alg Set",
        "nightmareDescription": "The online website for Nightmare.",
        "nightmareLetters": "Letters",
        "nightmareEdge": "3-Style Edge",
        "nightmareCorner": "3-Style Corner",
        "nightmare2Flips": "Edge Flip",
        "nightmare2Twists": "Corner Twist",
        "nightmareParity": "Parity",
        "nightmareParityTwist": "Parity with a Flip/Twist",
        "nightmare2e2e": "2e2e",
        "nightmare2c2c": "2c2c",
        "nightmare3Twists": "3 Corner Twist",
        "nightmare4Flips": "4 Edge Flip",
        "nightmare5Style": "5-Style Edge(UR)",
        "style": "Style：",
        "cornerStyleNightmare": "nightmare",
        "cornerStyleBalance": "balance",
        "cornerStyleYuanzi": "yuanzi",
        "mode": "Mode：",
        "edgeModeDefault": "default",
        "edgeModeBrute": "brute force",
        "custom": "Custom Alg Set",
        "customDescription": "Customize your Alg set.",
        "customEdge": "3-Style Edge",
        "customCorner": "3-Style Corner",
        "customUpfile": "Import Local Excel",
        "customDownfile": "Export Excel",
        "customClear": "Clear"
    },
    "zh": {
        "title": "三盲公式库",
        "description": "三盲公式库的在线网页版本。",
        "corner": "角块公式库",
        "2twists": "翻角公式库",
        "edge": "棱块公式库",
        "2flips": "翻棱公式库",
        "parity": "奇偶公式库",
        "3twists": "三角翻库",
        "code": "编码",
        "introduction": "说明",
        "cornerHint": "请在下方输入你要查询的公式编码（例如: JAD）",
        "edgeHint": "请在下方输入你要查询的公式编码（例如: ACG）",
        "2twistsHint": "请在下方选择你要查询的翻角公式",
        "2flipsHint": "请在下方选择你要查询的翻棱公式",
        "parityHint": "请在下方输入你要查询的奇偶公式",
        "3twistsHint": "请在下方选择你要查询的三角翻公式",
        "position": "位置类：",
        "pairs": "公式查询：",
        "setup": "Set up：",
        "cw": "顺翻：",
        "ccw": "逆翻：",
        "2flips1": "位置一：",
        "2flips2": "位置二：",
        "parity1": "棱：",
        "parity2": "角：",
        "3twistscw": "顺翻",
        "3twistsccw": "逆翻",
        "codeChichu": "彳亍编码",
        "codeSpeffz": "Speffz 编码",
        "codeLetterSetting": "编码设置：",
        "codeOrientationSetting": "坐标设置：",
        "code1": "黄顶红前",
        "code2": "黄顶橙前",
        "code3": "黄顶蓝前",
        "code4": "黄顶绿前",
        "code5": "白顶红前",
        "code6": "白顶橙前",
        "code7": "白顶蓝前",
        "code8": "白顶绿前",
        "code9": "蓝顶红前",
        "code10": "蓝顶橙前",
        "code11": "蓝顶黄前",
        "code12": "蓝顶白前",
        "code13": "绿顶红前",
        "code14": "绿顶橙前",
        "code15": "绿顶黄前",
        "code16": "绿顶白前",
        "code17": "红顶蓝前",
        "code18": "红顶绿前",
        "code19": "红顶黄前",
        "code20": "红顶白前",
        "code21": "橙顶蓝前",
        "code22": "橙顶绿前",
        "code23": "橙顶黄前",
        "code24": "橙顶白前",
        "thumbup": "上",
        "thumbdown": "下",
        "homegrip": "中",
        "all": "全",
        "no": "序号",
        "algorithm": "公式",
        "commutator": "交换子",
        "thumbPosition": "起手",
        "buffer":"缓冲：",
        "nightmare": "噩梦公式集",
        "nightmareDescription": "噩梦公式集的在线网页版本。",
        "nightmareLetters": "编码",
        "nightmareEdge": "全缓冲棱",
        "nightmareCorner": "全缓冲角",
        "nightmare2Flips": "全两棱翻",
        "nightmare2Twists": "全两角翻",
        "nightmareParity": "奇偶",
        "nightmareParityTwist": "奇偶带翻",
        "nightmare2e2e": "2e2e",
        "nightmare2c2c": "2c2c",
        "nightmare3Twists": "全三角翻",
        "nightmare4Flips": "全四棱翻",
        "nightmare5Style": "五循环(UR)",
        "style": "风格：",
        "cornerStyleNightmare": "噩梦",
        "cornerStyleBalance": "平衡",
        "cornerStyleYuanzi": "圆子",
        "mode": "模式：",
        "edgeModeDefault": "默认",
        "edgeModeBrute": "穷举",
        "custom": "个人公式集",
        "customDescription": "自定义你的盲拧公式集。",
        "customEdge": "棱块公式集",
        "customCorner": "角块公式集",
        "customUpfile": "导入本地 Excel",
        "customDownfile": "导出为 Excel",
        "customClear": "清空"
    }
};

// Switch between Chinese and English
let lang = "";
// Check for cookie support
lang = getCookie("lang");
if (lang === "") {
    lang = navigator.language.slice(0, 2) || navigator.userLanguage.slice(0, 2);
    // The default language is English
    if (lang === "") {
        lang = "en";
    }
}
if (!Object.keys(arrLang).includes(lang)) {
    lang = "en";
}
if (Object.keys(arrLang).includes(lang)) {
    if (lang === "zh") {
        $(".language").html("<div class=\"status_circle status_circle_online\">简体中文</div>");
        $("#introduction").attr("href", "https://docs.blddb.net/zh");
        $("#nightmareIntroduction").attr("href", "https://docs.blddb.net/zh/#nightmare");
        $("#donate").attr("href", "donate.html");
        $("#codeinput").width("5.5em");
        $("#cornerstyle").width("5em");
        $("#edgemode").width("4em");
        $("#image").show();
    } else if (lang === "en") {
        $(".language").html("<div class=\"status_circle status_circle_hide\">English</div>");
        $("#introduction").attr("href", "https://docs.blddb.net/en");
        $("#nightmareIntroduction").attr("href", "https://docs.blddb.net/en/#nightmare");
        $("#donate").attr("href", "donate_en.html");
        $("#codeinput").width("14em");
        $("#cornerstyle").width("7em");
        $("#edgemode").width("6em");
        $("#image").hide();
    }
} else {
    $(".language").html("<div class=\"status_circle status_circle_online\">简体中文</div>");
    $("#introduction").attr("href", "https://docs.blddb.net/zh");
    $("#nightmareIntroduction").attr("href", "https://docs.blddb.net/zh/#nightmare");
    $("#donate").attr("href", "donate.html");
    $("#codeinput").width("5.5em");
    $("#cornerstyle").width("5em");
    $("#edgemode").width("4em");
    $("#image").show();
}

$(document).ready(() => {
    $(".lang").each(function(index, element) {
        $(this).text(arrLang[lang][$(this).attr("key")]);
    });
    if (typeof $(".allscreen")[0] !== "undefined") {
        $(".allscreen")[0].style.display = "block";
    }
    const r = $("#table").width() / $("#div1").width();
    if (r > 1) {
        $("#table").css("font-size", 16 / r);
    }
    if (typeof fontAwesome === "function") {
        fontAwesome();
    }
});

// get/set the selected language
$(".translate").click(() => {
    // update cookie key
    if (lang === "en") {
        lang = "zh";
        setCookie("lang", "zh", 30);
    } else if (lang === "zh") {
        lang = "en";
        setCookie("lang", "en", 30);
    }
    if (!Object.keys(arrLang).includes(lang)) {
        lang = "en";
    }
    if (Object.keys(arrLang).includes(lang)) {
        if (lang === "zh") {
            $(".language").html("<div class=\"status_circle status_circle_online\">简体中文</div>");
            $("#introduction").attr("href", "https://docs.blddb.net/zh");
            $("#nightmareIntroduction").attr("href", "https://docs.blddb.net/zh/#nightmare");
            $("#donate").attr("href", "donate.html");
            $("#codeinput").width("5.5em");
            $("#cornerstyle").width("5em");
            $("#edgemode").width("4em");
            $("#image").show();
        } else if (lang === "en") {
            $(".language").html("<div class=\"status_circle status_circle_hide\">English</div>");
            $("#introduction").attr("href", "https://docs.blddb.net/en");
            $("#nightmareIntroduction").attr("href", "https://docs.blddb.net/en/#nightmare");
            $("#donate").attr("href", "donate_en.html");
            $("#codeinput").width("14em");
            $("#cornerstyle").width("7em");
            $("#edgemode").width("6em");
            $("#image").hide();
        }
    } else {
        $(".language").html("<div class=\"status_circle status_circle_online\">简体中文</div>");
        $("#introduction").attr("href", "https://docs.blddb.net/zh");
        $("#nightmareIntroduction").attr("href", "https://docs.blddb.net/zh/#nightmare");
        $("#donate").attr("href", "donate.html");
        $("#codeinput").width("5.5em");
        $("#cornerstyle").width("5em");
        $("#edgemode").width("4em");
        $("#image").show();
    }
    $(".lang").each(function(index, element) {
        $(this).text(arrLang[lang][$(this).attr("key")]);
    });
    if (typeof algSearch === "function") {
        algSearch();
    }
    if (typeof fontAwesome === "function") {
        fontAwesome();
    }
});