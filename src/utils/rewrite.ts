import commutator from "./commutator";

const rewrite = (function () {
  // prettier-ignore
  const MOVE = [
    "U", "U2", "U'",
    "R", "R2", "R'",
    "F", "F2", "F'",
    "D", "D2", "D'",
    "L", "L2", "L'",
    "B", "B2", "B'",
    "u", "u2", "u'",
    "r", "r2", "r'",
    "f", "f2", "f'",
    "d", "d2", "d'",
    "l", "l2", "l'",
    "b", "b2", "b'",
    "E", "E2", "E'",
    "M", "M2", "M'",
    "S", "S2", "S'"
  ];
  // prettier-ignore
  const ROTATION = ["", "y", "y2", "y'", "x", "x y", "x y2", "x y'", "x2", "x2 y", "x2 y2", "x2 y'", "x'", "x' y", "x' y2", "x' y'", "z", "z y", "z y2", "z y'", "z'", "z' y", "z' y2", "z' y'"];
  // prettier-ignore
  const ROTATION_BASE = ["x", "y", "z"];
  // prettier-ignore
  const ROTATION_DICT = {
    "x": [4, 21, 14, 19, 8, 22, 2, 18, 12, 23, 6, 17, 0, 20, 10, 16, 5, 1, 13, 9, 7, 11, 15, 3],
    "x2": [8, 11, 10, 9, 12, 15, 14, 13, 0, 3, 2, 1, 4, 7, 6, 5, 22, 21, 20, 23, 18, 17, 16, 19],
    "x'": [12, 17, 6, 23, 0, 16, 10, 20, 4, 19, 14, 21, 8, 18, 2, 22, 15, 11, 7, 3, 13, 1, 5, 9],
    "y": [1, 2, 3, 0, 5, 6, 7, 4, 9, 10, 11, 8, 13, 14, 15, 12, 17, 18, 19, 16, 21, 22, 23, 20],
    "y2": [2, 3, 0, 1, 6, 7, 4, 5, 10, 11, 8, 9, 14, 15, 12, 13, 18, 19, 16, 17, 22, 23, 20, 21],
    "y'": [3, 0, 1, 2, 7, 4, 5, 6, 11, 8, 9, 10, 15, 12, 13, 14, 19, 16, 17, 18, 23, 20, 21, 22],
    "z": [16, 5, 22, 15, 19, 9, 23, 3, 18, 13, 20, 7, 17, 1, 21, 11, 10, 6, 2, 14, 0, 4, 8, 12],
    "z2": [10, 9, 8, 11, 14, 13, 12, 15, 2, 1, 0, 3, 6, 5, 4, 7, 20, 23, 22, 21, 16, 19, 18, 17],
    "z'": [20, 13, 18, 7, 21, 1, 17, 11, 22, 5, 16, 15, 23, 9, 19, 3, 0, 12, 8, 4, 10, 14, 2, 6]
  };
  // prettier-ignore
  const MOVE_DICT = [
    ["U", "U2", "U'", "R", "R2", "R'", "F", "F2", "F'", "D", "D2", "D'", "L", "L2", "L'", "B", "B2", "B'", "u", "u2", "u'", "r", "r2", "r'", "f", "f2", "f'", "d", "d2", "d'", "l", "l2", "l'", "b", "b2", "b'", "E", "E2", "E'", "M", "M2", "M'", "S", "S2", "S'"],
    ["U", "U2", "U'", "B", "B2", "B'", "R", "R2", "R'", "D", "D2", "D'", "F", "F2", "F'", "L", "L2", "L'", "u", "u2", "u'", "b", "b2", "b'", "r", "r2", "r'", "d", "d2", "d'", "f", "f2", "f'", "l", "l2", "l'", "E", "E2", "E'", "S", "S2", "S'", "M'", "M2", "M"],
    ["U", "U2", "U'", "L", "L2", "L'", "B", "B2", "B'", "D", "D2", "D'", "R", "R2", "R'", "F", "F2", "F'", "u", "u2", "u'", "l", "l2", "l'", "b", "b2", "b'", "d", "d2", "d'", "r", "r2", "r'", "f", "f2", "f'", "E", "E2", "E'", "M'", "M2", "M", "S'", "S2", "S"],
    ["U", "U2", "U'", "F", "F2", "F'", "L", "L2", "L'", "D", "D2", "D'", "B", "B2", "B'", "R", "R2", "R'", "u", "u2", "u'", "f", "f2", "f'", "l", "l2", "l'", "d", "d2", "d'", "b", "b2", "b'", "r", "r2", "r'", "E", "E2", "E'", "S'", "S2", "S", "M", "M2", "M'"],
    ["F", "F2", "F'", "R", "R2", "R'", "D", "D2", "D'", "B", "B2", "B'", "L", "L2", "L'", "U", "U2", "U'", "f", "f2", "f'", "r", "r2", "r'", "d", "d2", "d'", "b", "b2", "b'", "l", "l2", "l'", "u", "u2", "u'", "S'", "S2", "S", "M", "M2", "M'", "E", "E2", "E'"],
    ["F", "F2", "F'", "U", "U2", "U'", "R", "R2", "R'", "B", "B2", "B'", "D", "D2", "D'", "L", "L2", "L'", "f", "f2", "f'", "u", "u2", "u'", "r", "r2", "r'", "b", "b2", "b'", "d", "d2", "d'", "l", "l2", "l'", "S'", "S2", "S", "E", "E2", "E'", "M'", "M2", "M"],
    ["F", "F2", "F'", "L", "L2", "L'", "U", "U2", "U'", "B", "B2", "B'", "R", "R2", "R'", "D", "D2", "D'", "f", "f2", "f'", "l", "l2", "l'", "u", "u2", "u'", "b", "b2", "b'", "r", "r2", "r'", "d", "d2", "d'", "S'", "S2", "S", "M'", "M2", "M", "E'", "E2", "E"],
    ["F", "F2", "F'", "D", "D2", "D'", "L", "L2", "L'", "B", "B2", "B'", "U", "U2", "U'", "R", "R2", "R'", "f", "f2", "f'", "d", "d2", "d'", "l", "l2", "l'", "b", "b2", "b'", "u", "u2", "u'", "r", "r2", "r'", "S'", "S2", "S", "E'", "E2", "E", "M", "M2", "M'"],
    ["D", "D2", "D'", "R", "R2", "R'", "B", "B2", "B'", "U", "U2", "U'", "L", "L2", "L'", "F", "F2", "F'", "d", "d2", "d'", "r", "r2", "r'", "b", "b2", "b'", "u", "u2", "u'", "l", "l2", "l'", "f", "f2", "f'", "E'", "E2", "E", "M", "M2", "M'", "S'", "S2", "S"],
    ["D", "D2", "D'", "F", "F2", "F'", "R", "R2", "R'", "U", "U2", "U'", "B", "B2", "B'", "L", "L2", "L'", "d", "d2", "d'", "f", "f2", "f'", "r", "r2", "r'", "u", "u2", "u'", "b", "b2", "b'", "l", "l2", "l'", "E'", "E2", "E", "S'", "S2", "S", "M'", "M2", "M"],
    ["D", "D2", "D'", "L", "L2", "L'", "F", "F2", "F'", "U", "U2", "U'", "R", "R2", "R'", "B", "B2", "B'", "d", "d2", "d'", "l", "l2", "l'", "f", "f2", "f'", "u", "u2", "u'", "r", "r2", "r'", "b", "b2", "b'", "E'", "E2", "E", "M'", "M2", "M", "S", "S2", "S'"],
    ["D", "D2", "D'", "B", "B2", "B'", "L", "L2", "L'", "U", "U2", "U'", "F", "F2", "F'", "R", "R2", "R'", "d", "d2", "d'", "b", "b2", "b'", "l", "l2", "l'", "u", "u2", "u'", "f", "f2", "f'", "r", "r2", "r'", "E'", "E2", "E", "S", "S2", "S'", "M", "M2", "M'"],
    ["B", "B2", "B'", "R", "R2", "R'", "U", "U2", "U'", "F", "F2", "F'", "L", "L2", "L'", "D", "D2", "D'", "b", "b2", "b'", "r", "r2", "r'", "u", "u2", "u'", "f", "f2", "f'", "l", "l2", "l'", "d", "d2", "d'", "S", "S2", "S'", "M", "M2", "M'", "E'", "E2", "E"],
    ["B", "B2", "B'", "D", "D2", "D'", "R", "R2", "R'", "F", "F2", "F'", "U", "U2", "U'", "L", "L2", "L'", "b", "b2", "b'", "d", "d2", "d'", "r", "r2", "r'", "f", "f2", "f'", "u", "u2", "u'", "l", "l2", "l'", "S", "S2", "S'", "E'", "E2", "E", "M'", "M2", "M"],
    ["B", "B2", "B'", "L", "L2", "L'", "D", "D2", "D'", "F", "F2", "F'", "R", "R2", "R'", "U", "U2", "U'", "b", "b2", "b'", "l", "l2", "l'", "d", "d2", "d'", "f", "f2", "f'", "r", "r2", "r'", "u", "u2", "u'", "S", "S2", "S'", "M'", "M2", "M", "E", "E2", "E'"],
    ["B", "B2", "B'", "U", "U2", "U'", "L", "L2", "L'", "F", "F2", "F'", "D", "D2", "D'", "R", "R2", "R'", "b", "b2", "b'", "u", "u2", "u'", "l", "l2", "l'", "f", "f2", "f'", "d", "d2", "d'", "r", "r2", "r'", "S", "S2", "S'", "E", "E2", "E'", "M", "M2", "M'"],
    ["L", "L2", "L'", "U", "U2", "U'", "F", "F2", "F'", "R", "R2", "R'", "D", "D2", "D'", "B", "B2", "B'", "l", "l2", "l'", "u", "u2", "u'", "f", "f2", "f'", "r", "r2", "r'", "d", "d2", "d'", "b", "b2", "b'", "M'", "M2", "M", "E", "E2", "E'", "S", "S2", "S'"],
    ["L", "L2", "L'", "B", "B2", "B'", "U", "U2", "U'", "R", "R2", "R'", "F", "F2", "F'", "D", "D2", "D'", "l", "l2", "l'", "b", "b2", "b'", "u", "u2", "u'", "r", "r2", "r'", "f", "f2", "f'", "d", "d2", "d'", "M'", "M2", "M", "S", "S2", "S'", "E'", "E2", "E"],
    ["L", "L2", "L'", "D", "D2", "D'", "B", "B2", "B'", "R", "R2", "R'", "U", "U2", "U'", "F", "F2", "F'", "l", "l2", "l'", "d", "d2", "d'", "b", "b2", "b'", "r", "r2", "r'", "u", "u2", "u'", "f", "f2", "f'", "M'", "M2", "M", "E'", "E2", "E", "S'", "S2", "S"],
    ["L", "L2", "L'", "F", "F2", "F'", "D", "D2", "D'", "R", "R2", "R'", "B", "B2", "B'", "U", "U2", "U'", "l", "l2", "l'", "f", "f2", "f'", "d", "d2", "d'", "r", "r2", "r'", "b", "b2", "b'", "u", "u2", "u'", "M'", "M2", "M", "S'", "S2", "S", "E", "E2", "E'"],
    ["R", "R2", "R'", "D", "D2", "D'", "F", "F2", "F'", "L", "L2", "L'", "U", "U2", "U'", "B", "B2", "B'", "r", "r2", "r'", "d", "d2", "d'", "f", "f2", "f'", "l", "l2", "l'", "u", "u2", "u'", "b", "b2", "b'", "M", "M2", "M'", "E'", "E2", "E", "S", "S2", "S'"],
    ["R", "R2", "R'", "B", "B2", "B'", "D", "D2", "D'", "L", "L2", "L'", "F", "F2", "F'", "U", "U2", "U'", "r", "r2", "r'", "b", "b2", "b'", "d", "d2", "d'", "l", "l2", "l'", "f", "f2", "f'", "u", "u2", "u'", "M", "M2", "M'", "S", "S2", "S'", "E", "E2", "E'"],
    ["R", "R2", "R'", "U", "U2", "U'", "B", "B2", "B'", "L", "L2", "L'", "D", "D2", "D'", "F", "F2", "F'", "r", "r2", "r'", "u", "u2", "u'", "b", "b2", "b'", "l", "l2", "l'", "d", "d2", "d'", "f", "f2", "f'", "M", "M2", "M'", "E", "E2", "E'", "S'", "S2", "S"],
    ["R", "R2", "R'", "F", "F2", "F'", "U", "U2", "U'", "L", "L2", "L'", "B", "B2", "B'", "D", "D2", "D'", "r", "r2", "r'", "f", "f2", "f'", "u", "u2", "u'", "l", "l2", "l'", "b", "b2", "b'", "d", "d2", "d'", "M", "M2", "M'", "S'", "S2", "S", "E'", "E2", "E"]
  ];
  const ALG_REPLACE = {
    U: "d y",
    U2: "d2 y2",
    "U'": "d' y'",
    R: "l x",
    R2: "l2 x2",
    "R'": "l' x'",
    F: "b z",
    F2: "b2 z2",
    "F'": "b' z'",
    D: "u y'",
    D2: "u2 y2",
    "D'": "u' y",
    L: "r x'",
    L2: "r2 x2",
    "L'": "r' x",
    B: "f z'",
    B2: "f2 z2",
    "B'": "f' z",
    u: "D y",
    u2: "D2 y2",
    "u'": "D' y'",
    r: "L x",
    r2: "L2 x2",
    "r'": "L' x'",
    f: "B z",
    f2: "B2 z2",
    "f'": "B' z'",
    d: "U y'",
    d2: "U2 y2",
    "d'": "U' y",
    l: "R x'",
    l2: "R2 x2",
    "l'": "R' x",
    b: "F z'",
    b2: "F2 z2",
    "b'": "F' z",
    E: "U D' y'",
    E2: "U2 D2 y2",
    "E'": "U' D y",
    M: "L' R x'",
    M2: "L2 R2 x2",
    "M'": "L R' x",
    S: "F' B z",
    S2: "F2 B2 z2",
    "S'": "F B' z'",
  };

  function main(alg: string, ALG_ALLOWED: string[]) {
    function processMove(res: string[], rotationIndex: number) {
      let rotationIndexOut = rotationIndex;
      for (let i = 0; i < res.length; i++) {
        if (
          ROTATION_BASE.includes(res[i][0]) &&
          !ALG_ALLOWED.includes(res[i][0])
        ) {
          if (!(res[i] in ROTATION_DICT)) {
            return -1;
          }
          rotationIndexOut =
            ROTATION_DICT[res[i] as keyof typeof ROTATION_DICT][
              rotationIndexOut
            ];
        } else if (
          ROTATION_BASE.includes(res[i][0]) &&
          ALG_ALLOWED.includes(res[i][0])
        ) {
          out.push(res[i]);
        } else {
          if (MOVE.indexOf(res[i]) === -1) {
            return -1;
          }
          const moveNew = MOVE_DICT[rotationIndexOut][MOVE.indexOf(res[i])];
          if (!ALG_ALLOWED.includes(moveNew[0]) && res[i] in ALG_REPLACE) {
            const moveReplaceList =
              ALG_REPLACE[res[i] as keyof typeof ALG_REPLACE].split(" ");
            rotationIndexOut = processMove(moveReplaceList, rotationIndexOut);
          } else {
            out.push(moveNew);
          }
        }
      }
      return rotationIndexOut;
    }
    const res = commutator.expand({ algorithm: alg }).split(" ");
    for (let i = 0; i < res.length; i++) {
      if (res[i][0] === "y" || res[i][0] === "z") {
        return commutator.expand({ algorithm: res.join(" ") });
      }
    }
    let rotationIndex = 0;
    const out: string[] = [];
    rotationIndex = processMove(res, rotationIndex);
    if (rotationIndex === -1) {
      return "";
    }
    if (ROTATION[rotationIndex] === "") {
      return commutator.expand({ algorithm: out.join(" ") });
    }
    return commutator.expand({
      algorithm: "".concat(out.join(" "), " ").concat(ROTATION[rotationIndex]),
    });
  }

  function single(alg: string) {
    // prettier-ignore
    return main(alg, ["U", "R", "F", "D", "L", "B", "E", "M", "S", "y", "z"]);
  }

  function righty(alg: string) {
    // prettier-ignore
    return main(alg, ["R", "r", "U", "d", "D", "u", "F", "b", "B", "f", "E", "M", "S"]);
  }

  function mirror(alg: string, move: string): string {
    let s = `${alg} `;
    s = s.replace(/,/gu, " ,");
    s = s.replace(/:/gu, " :");
    s = s.replace(/\]/gu, " ]");
    s = s.replace(/\//gu, " /");
    s = s.replace(new RegExp(`${move}w' `, "gu"), "_ ");
    s = s.replace(new RegExp(`${move}w `, "gu"), `${move}w' `);
    s = s.replace(/_ /gu, `${move}w `);
    s = s.replace(new RegExp(`${move}w'2 `, "gu"), `${move}w2 `);
    s = s.replace(new RegExp(`${move}' `, "gu"), "_ ");
    s = s.replace(new RegExp(`${move} `, "gu"), `${move}' `);
    s = s.replace(/_ /gu, `${move} `);
    s = s.replace(new RegExp(`${move}'2 `, "gu"), `${move}2 `);
    s = s.replace(/ ,/gu, ",");
    s = s.replace(/ :/gu, ":");
    s = s.replace(/ \]/gu, "]");
    s = s.replace(/ \//gu, "/");
    return s.trim();
  }

  function mirrorChange(alg: string, move1: string, move2: string): string {
    let s = `${alg} `;
    s = s.replace(new RegExp(move1, "gu"), "_");
    s = s.replace(new RegExp(move2, "gu"), move1);
    return s.replace(/_/gu, move2).trim();
  }

  function mirrorAxis(alg: string, axis: string): string {
    let s = alg;
    if (axis === "M") {
      // prettier-ignore
      const moves = [
        "U", "D", "F", "B", "L", "R",
        "u", "d", "f", "b", "l", "r",
        "S", "E", "y", "z",
        "s", "e"
      ];
      for (const move of moves) {
        s = mirror(s, move);
      }
      s = mirrorChange(s, "L", "R");
      s = mirrorChange(s, "l", "r");
    }
    return s;
  }

  return {
    single,
    righty,
    mirrorAxis,
  };
})();

export default rewrite;
