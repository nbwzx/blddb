"use strict";

const bigbldCodeConverter = (function () {
  const letteringSchemes = {
    Chichu:
      "DEE G DEGGCC GGCAAJ A AAJEDD C EDCTXX TTXQLM Q LLMBBB L BBLQSS QQSNJY N JJYKHH I KHIZRR ZZRZPS Z PPSHFF F HFFWYY WWYTNP T NNPWII X WIXOKKOOOKOMR O MMR",
    Speffz:
      "AAA B AABBDD BBDDCC D CCCEEE F EEFFHH FFHHGG H GGGIII J IIJJLL JJLLKK L KKKMMM N MMNNPP NNPPOO P OOOQQQ R QQRRTT RRTTSS T SSSUUU V UUVVXXUVVXXWW X WWW",
  };
  const initialInputValues = letteringSchemes["Chichu"];

  return {
    initialInputValues,
    letteringSchemes,
  };
})();

export default bigbldCodeConverter;
