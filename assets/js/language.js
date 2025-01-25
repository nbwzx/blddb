const arrLang = {
    "en": {
        "title": "3BLD Algorithms Database",
        "description": "The online website for BLDDB.",
        "corner": "3-Style Corner",
        "twists": "Corner Twist",
        "edge": "3-Style Edge",
        "2flips": "Edge Flip",
        "parity": "3BLD Parity",
        "ltct": "LTCT & T2C",
        "2e2e": "2e2e",
        "ltef": "LTEF",
        "5style": "5-Style",
        "code": "Lettering Scheme",
        "introduction": "Readme",
        "cornerHint": "Please enter 3 letter pairs (buffer-position1-position2) you want to query (eg. JAD)",
        "edgeHint": "Please enter 3 letter pairs (buffer-position1-position2) you want to query (eg. ACG)",
        "twistsHint": "Please set the corner twist condition (solved if empty)",
        "2flipsHint": "Please enter the 2 positions you want to flip",
        "parityHint": "Please enter the parity you want to solve",
        "2e2eHint": "Please enter the positions you want to swap",
        "ltctHint1": "Edge swap is always UF-UR.",
        "ltctHint2": "For LTCT inquiry, select first and second drop-down lists.",
        "ltctHint3": "For T2C inquiry, select first and third drop-down lists.",
        "ltefHint": "Please enter the positions you want to query (Here LTEF stand for last edge target + edge flip. eg. UF-xy-RU-FU, plus a flip)",
        "5styleHint": "Please enter 5 letter pairs (buffer-position1-position2-position3-position4) you want to query (eg. ACEGJ)",
        "wingHint": "Please enter 3 letter pairs (buffer-position1-position2) you want to query (eg. ACG)",
        "midgeHint": "Please enter 3 letter pairs (buffer-position1-position2) you want to query (eg. ACG)",
        "xcenterHint": "Please enter 3 letter pairs (buffer-position1-position2) you want to query (eg. JAB)",
        "tcenterHint": "Please enter 3 letter pairs (buffer-position1-position2) you want to query (eg. ACF)",
        "position": "Position: ",
        "pairs": "Letter Pairs: ",
        "cw": "CW: ",
        "ccw": "CCW: ",
        "2flips1": "Position1: ",
        "2flips2": "Position2: ",
        "parity1": "Edge:",
        "parity2": "Corner:",
        "twistscw": "CW",
        "twistsccw": "CCW",
        "ltcttwist": "Twist: ",
        "ltcttwistHint": "Where U/D sticker is",
        "2e2e1": "Swap1: ",
        "2e2e2": "Swap2: ",
        "2e2eflips": "Flips:",
        "2e2eyes": "Yes",
        "2e2eno": "No",
        "ltefflips": "Flips:",
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
        "wingCodeSetting": "Wing Coding Position: ",
        "wingcode1": "Standard (coding at UFr)",
        "wingcode2": "Non-standard (coding at FUr)",
        "thumbup": "Thumb up",
        "thumbdown": "Thumb down",
        "homegrip": "Home grip",
        "no": "No.",
        "algorithm": "Algorithm",
        "commutator": "Commutator",
        "thumbPosition": "Thumb Position",
        "source": "Source",
        "buffer": "Buffer: ",
        "nightmare": "Nightmare Alg Set",
        "nightmareDescription": "The online website for Nightmare.",
        "nightmareLetters": "Letters",
        "nightmareEdge": "3-Style Edge",
        "nightmareCorner": "3-Style Corner",
        "nightmare2Flips": "Edge Flip",
        "nightmare2Twists": "Corner Twist",
        "nightmareParity": "Parity",
        "nightmareParityTwist": "LTCT/LTEF",
        "nightmare2e2e": "2e2e",
        "nightmare2c2c": "2c2c",
        "nightmare3Twists": "3 Corner Twist",
        "nightmare4Flips": "4 Edge Flip",
        "nightmare5Style": "5-Style Edge(UR)",
        "style": "Style：",
        "cornerStyleNightmare": "nightmare",
        "cornerStyleBalance": "balance",
        "cornerStyleYuanzi": "yuanzi",
        "cornerStyleManmade": "manmade",
        "edgeStyleNightmare": "nightmare",
        "edgeStyleManmade": "manmade",
        "custom": "Custom Alg Set",
        "customDescription": "Customize your Alg set.",
        "customEdge": "3-Style Edge",
        "customCorner": "3-Style Corner",
        "customUpfile": "Import Local Excel",
        "customDownfile": "Export Excel",
        "customClear": "Clear",
        "bigbld": "BigBLD Alg Set",
        "wing": "Wing",
        "midge": "Midge",
        "xcenter": "X-center",
        "tcenter": "+-center"
    },
    "zh": {
        "title": "三盲公式库",
        "description": "三盲公式库的在线网页版本。",
        "corner": "角块公式库",
        "twists": "翻角公式库",
        "edge": "棱块公式库",
        "2flips": "翻棱公式库",
        "parity": "奇偶公式库",
        "ltct": "奇偶带翻库",
        "2e2e": "2e2e库",
        "ltef": "棱三循环带翻库",
        "5style": "五循环库",
        "code": "编码",
        "introduction": "说明",
        "cornerHint": "请在下方输入你要查询的公式编码（例如: JAD）",
        "edgeHint": "请在下方输入你要查询的公式编码（例如: ACG）",
        "twistsHint": "请在下方选择你要查询的翻角公式",
        "2flipsHint": "请在下方选择你要查询的翻棱公式",
        "parityHint": "请在下方输入你要查询的奇偶公式",
        "ltctHint1": "棱块交换位置为 UF-UR。",
        "ltctHint2": "查询奇偶带翻公式时，请在下方选择第一和第二个下拉栏。",
        "ltctHint3": "查询 T2C 公式时，请在下方选择第一和第三个下拉栏。",
        "2e2eHint": "请在下方选择你要查询的 2e2e 公式",
        "ltefHint": "请在下方选择你要查询的棱三循环带翻公式",
        "5styleHint": "请在下方输入你要查询的五循环公式",
        "wingHint": "请在下方输入你要查询的公式编码（例如: ACG）",
        "midgeHint": "请在下方输入你要查询的公式编码（例如: ACG）",
        "xcenterHint": "请在下方输入你要查询的公式编码（例如: JAB）",
        "tcenterHint": "请在下方输入你要查询的公式编码（例如: ACF）",
        "position": "位置类：",
        "pairs": "公式查询：",
        "cw": "顺翻：",
        "ccw": "逆翻：",
        "2flips1": "位置一：",
        "2flips2": "位置二：",
        "parity1": "棱：",
        "parity2": "角：",
        "twistscw": "顺翻",
        "twistsccw": "逆翻",
        "ltcttwist": "翻角:",
        "ltcttwistHint": "翻角高级色所在的位置",
        "2e2e1": "交换一: ",
        "2e2e2": "交换二: ",
        "2e2eflips": "含翻:",
        "2e2eyes": "是",
        "2e2eno": "否",
        "ltefflips": "翻色:",
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
        "wingCodeSetting": "翼棱编码位置：",
        "wingcode1": "标准（在 UFr 位置编码）",
        "wingcode2": "非标准（在 FUr 位置编码）",
        "thumbup": "上",
        "thumbdown": "下",
        "homegrip": "中",
        "no": "序号",
        "source": "来源",
        "algorithm": "公式",
        "commutator": "交换子",
        "thumbPosition": "起手",
        "buffer": "缓冲：",
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
        "cornerStyleManmade": "人造",
        "edgeStyleNightmare": "噩梦",
        "edgeStyleManmade": "人造",
        "custom": "个人公式集",
        "customDescription": "自定义你的盲拧公式集。",
        "customEdge": "棱块公式集",
        "customCorner": "角块公式集",
        "customUpfile": "导入本地 Excel",
        "customDownfile": "导出为 Excel",
        "customClear": "清空",
        "bigbld": "高盲公式库",
        "wing": "翼棱公式库",
        "midge": "中棱公式库",
        "xcenter": "角心公式库",
        "tcenter": "边心公式库"
    },
    "ja": {
        "title": "3BLD手順データベース",
        "description": "BLDDBのオンラインウェブサイト。",
        "corner": "3-Styleコーナー",
        "twists": "コーナーツイスト",
        "edge": "3-Styleエッジ",
        "2flips": "エッジフリップ",
        "parity": "3BLD パリティ",
        "ltct": "LTCT & T2C",
        "2e2e": "2e2e",
        "ltef": "LTEF",
        "5style": "5-Style",
        "code": "ナンバリング設定",
        "introduction": "Readme",
        "cornerHint": "検索したい3ナンバリング（バッファ-位置1-位置2）を入力してください（例：JAD）",
        "edgeHint": "検索したい3ナンバリング（バッファ-位置1-位置2）を入力してください（例：ACG）",
        "twistsHint": "コーナーツイストの条件を設定してください（未解決の場合は空にしてください）",
        "2flipsHint": "フリップしたい2つの位置を入力してください",
        "parityHint": "解決したいパリティを入力してください",
        "ltctHint1": "エッジ交換は常にUF-URです。",
        "ltctHint2": "LTCTの問い合わせの場合、最初と2番目のドロップダウンリストを選択してください。",
        "ltctHint3": "T2Cの問い合わせの場合、最初と3番目のドロップダウンリストを選択してください。",
        "2e2eHint": "交換したい位置を入力してください",
        "ltefHint": "検索したい位置を入力してください （例：UF-xy-RU-FU, plus a flip）",
        "5styleHint": "検索したい5ナンバリング（バッファ-位置1-位置2-位置3-位置4）を入力してください（例：ACEGJ）",
        "wingHint": "検索したい3ナンバリング（バッファ-位置1-位置2）を入力してください（例：ACG）",
        "midgeHint": "検索したい3ナンバリング（バッファ-位置1-位置2）を入力してください（例：ACG）",
        "xcenterHint": "検索したい3ナンバリング（バッファ-位置1-位置2）を入力してください（例：JAB）",
        "tcenterHint": "検索したい3ナンバリング（バッファ-位置1-位置2）を入力してください（例：ACF）",
        "position": "ステッカー：",
        "pairs": "ナンバリング：",
        "cw": "時計回り：",
        "ccw": "反時計回り：",
        "2flips1": "位置1：",
        "2flips2": "位置2：",
        "parity1": "エッジ：",
        "parity2": "コーナー：",
        "twistscw": "時計回り",
        "twistsccw": "反時計回り",
        "ltcttwist": "コーナーツイスト:",
        "ltcttwistHint": "U/Dステッカーがある位置",
        "2e2e1": "交換1：",
        "2e2e2": "交換2：",
        "2e2eflips": "フリップ：",
        "2e2eyes": "はい",
        "2e2eno": "いいえ",
        "ltefflips": "フリップ：",
        "codeChichu": "Chichuナンバリング",
        "codeSpeffz": "Speffzナンバリング",
        "codeLetterSetting": "ナンバリング設定：",
        "codeOrientationSetting": "向き設定：",
        "code1": "黄(U面) - 赤(F面)",
        "code2": "黄(U面) - 橙(F面)",
        "code3": "黄(U面) - 青(F面)",
        "code4": "黄(U面) - 緑(F面)",
        "code5": "白(U面) - 赤(F面)",
        "code6": "白(U面) - 橙(F面)",
        "code7": "白(U面) - 青(F面)",
        "code8": "白(U面) - 緑(F面)",
        "code9": "青(U面) - 赤(F面)",
        "code10": "青(U面) - 橙(F面)",
        "code11": "青(U面) - 黄(F面)",
        "code12": "青(U面) - 白(F面)",
        "code13": "緑(U面) - 赤(F面)",
        "code14": "緑(U面) - 橙(F面)",
        "code15": "緑(U面) - 黄(F面)",
        "code16": "緑(U面) - 白(F面)",
        "code17": "赤(U面) - 青(F面)",
        "code18": "赤(U面) - 緑(F面)",
        "code19": "赤(U面) - 黄(F面)",
        "code20": "赤(U面) - 白(F面)",
        "code21": "橙(U面) - 青(F面)",
        "code22": "橙(U面) - 緑(F面)",
        "code23": "橙(U面) - 黄(F面)",
        "code24": "橙(U面) - 白(F面)",
        "wingCodeSetting": "Wing Coding Position: ",
        "wingcode1": "Standard (coding at UFr)",
        "wingcode2": "Non-standard (coding at FUr)",
        "thumbup": "上",
        "thumbdown": "下",
        "homegrip": "中",
        "no": "連番",
        "source": "出典",
        "algorithm": "手順",
        "commutator": "コミュテーター",
        "thumbPosition": "スタート",
        "buffer": "バッファ：",
        "nightmare": "悪夢手順表",
        "nightmareDescription": "悪夢手順表のオンラインウェブサイト。",
        "nightmareLetters": "ステッカー",
        "nightmareEdge": "全エッジバッファ",
        "nightmareCorner": "全コーナーバッファ",
        "nightmare2Flips": "全2エッジフリップ",
        "nightmare2Twists": "全2コーナーツイスト",
        "nightmareParity": "パリティ",
        "nightmareParityTwist": "LTCT/LTEF",
        "nightmare2e2e": "2e2e",
        "nightmare2c2c": "2c2c",
        "nightmare3Twists": "全3コーナーツイスト",
        "nightmare4Flips": "全4エッジフリップ",
        "nightmare5Style": "5-Styleエッジ(UR)",
        "style": "スタイル：",
        "cornerStyleNightmare": "悪夢",
        "cornerStyleBalance": "バランス",
        "cornerStyleYuanzi": "yuanzi",
        "cornerStyleManmade": "人工",
        "edgeStyleNightmare": "悪夢",
        "edgeStyleManmade": "人工",
        "custom": "カスタム手順表",
        "customDescription": "あなたの3BLD手順表をカスタマイズする",
        "customEdge": "3-Styleエッジ",
        "customCorner": "3-Styleコーナー",
        "customUpfile": "Excelファイルをインポート",
        "customDownfile": "Excelファイルにエクスポート",
        "customClear": "クリア",
        "bigbld": "BigBLD Alg Set",
        "wing": "Wing",
        "midge": "Midge",
        "xcenter": "X-center",
        "tcenter": "+-center"
    }
};

const langNames = {
    "zh": "简体中文",
    "en": "English",
    "ja": "日本語"
};

// Check for cookie support
// The default language is English
let lang = getCookie("lang") || navigator.language.slice(0, 2) || navigator.userLanguage.slice(0, 2) || "en";
if (!Object.keys(arrLang).includes(lang)) {
    lang = "en";
}

document.querySelector(".language .status_circle").textContent = langNames[lang];
if (lang === "zh") {
    $("#introduction").attr("href", "https://docs.blddb.net/zh");
    $("#nightmareIntroduction").attr("href", "https://docs.blddb.net/zh/#nightmare");
    $("#donate").attr("href", "donate.html");
    $("#codeinput").width("5.5em");
    $("#cornerstyle").width("5em");
    $("#edgestyle").width("5em");
    $("#ltctstyle").width("5em");
    $("#paritystyle").width("5em");
    $("#image").show();
} else {
    $("#introduction").attr("href", "https://docs.blddb.net/en");
    $("#nightmareIntroduction").attr("href", "https://docs.blddb.net/en/#nightmare");
    $("#donate").attr("href", "donate_en.html");
    $("#codeinput").width("14em");
    $("#cornerstyle").width("7em");
    $("#edgestyle").width("7em");
    $("#ltctstyle").width("7em");
    $("#paritystyle").width("7em");
    $("#image").hide();
}

dropdown = document.querySelector(".dropdown-content");
dropdown.innerHTML = "";

for (const langOther in langNames) {
    if (langOther !== lang) {
        dropdown.innerHTML += `<div class="status_circle" data-lang="${langOther}">${langNames[langOther]}</div>`;
    }
}

// Get the translate button and dropdown content
const translateBtn = document.querySelector(".language .status_circle");
const dropdownContent = document.querySelector(".language .dropdown-content");

translateBtn.textContent = langNames[lang];
translateBtn.style.backgroundImage = `url(../../images/${lang}.png)`;
// Add a click event listener to the translate button
translateBtn.addEventListener("click", () => {
    // Toggle the "show" class on the dropdown content
    dropdownContent.classList.toggle("show");
});

$(document).ready(() => {
    $(".lang").each(function (index, element) {
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

dropdownContent.addEventListener("click", (event) => {
    if (event.target.classList.contains("status_circle")) {
        lang = event.target.dataset.lang;
        translateBtn.textContent = langNames[lang];
        translateBtn.style.backgroundImage = `url(../../images/${lang}.png)`;
        dropdownContent.classList.remove("show");
        // add options to the dropdown for the other languages
        dropdown.innerHTML = "";
        for (const langOther in langNames) {
            if (langOther !== lang) {
                dropdown.innerHTML += `<div class="status_circle" data-lang="${langOther}">${langNames[langOther]}</div>`;
            }
        }
        // update cookie key
        setCookie("lang", lang, 400);
        document.querySelector(".language .status_circle").textContent = langNames[lang];
        if (lang === "zh") {
            $("#introduction").attr("href", "https://docs.blddb.net/zh");
            $("#nightmareIntroduction").attr("href", "https://docs.blddb.net/zh/#nightmare");
            $("#donate").attr("href", "donate.html");
            $("#codeinput").width("5.5em");
            $("#cornerstyle").width("5em");
            $("#edgestyle").width("5em");
            $("#ltctstyle").width("5em");
            $("#paritystyle").width("5em");
            $("#image").show();
        } else {
            $("#introduction").attr("href", "https://docs.blddb.net/en");
            $("#nightmareIntroduction").attr("href", "https://docs.blddb.net/en/#nightmare");
            $("#donate").attr("href", "donate_en.html");
            $("#codeinput").width("14em");
            $("#cornerstyle").width("7em");
            $("#edgestyle").width("7em");
            $("#ltctstyle").width("7em");
            $("#paritystyle").width("7em");
            $("#image").hide();
        }
        $(".lang").each(function (index, element) {
            $(this).text(arrLang[lang][$(this).attr("key")]);
        });
        if (typeof algSearch === "function") {
            algSearch();
        }
        if (typeof fontAwesome === "function") {
            fontAwesome();
        }
    }
});