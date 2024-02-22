from rubikscubennnsolver.RubiksCube333 import RubiksCube333
edge_ch_default = "GHABCDEFOPKLQRSTYZIJWXMN"
corner_ch_default = "JKLGHIABCDEFXYZWMNRSTOPQ"

moves_333 = (
    "U", "U'", "U2",
    "L", "L'", "L2",
    "F", "F'", "F2",
    "R", "R'", "R2",
    "B", "B'", "B2",
    "D", "D'", "D2",
    "2U", "2U'", "2U2", "2D", "2D'", "2D2",
    "2L", "2L'", "2L2", "2R", "2R'", "2R2",
    "2F", "2F'", "2F2", "2B", "2B'", "2B2",
    "x", "y", "z", "x'", "y'", "z'", "x2", "y2", "z2"
)

solved_333: str = \
    "DEGCUGAAJ\
EDCXLTQLM\
BBLSFQNJY\
KHIRRZZPS\
HFFYBWTNP\
WIXKDOOMR"
# ULFRBD

track_dict = {
    "edge": [2, 4, 6, 8, 11, 13, 15, 17, 20, 22, 24, 26, 29, 31, 33, 35, 38, 40, 42, 44, 47, 49, 51, 53],
    "corner": [1, 3, 7, 9, 10, 12, 16, 18, 19, 21, 25, 27, 28, 30, 34, 36, 37, 39, 43, 45, 46, 48, 52, 54]
}

track_map = {
    key: {solved_333[x - 1]: x for x in track_dict[key]} for key in track_dict}


def stm(s1: str) -> int:
    return s1.count(" ") + 1


def qtm(s1: str) -> int:
    return s1.count(" ") + s1.count("2") + 1


def track(code_type: str, track_s1: str, a: str) -> str:
    return a[track_map[code_type][track_s1]]


def sequence_to_state(sequence: str) -> str:
    rr = RubiksCube333(solved_333, 'ULFRBD')
    moves = [x for x in sequence.split(" ") if x]

    # Apply this sequence to the cube
    for move in moves:
        if move[0].islower() and move[0] in ['r', 'u', 'd', 'l', 'f', 'b']:
            if (move.upper() not in moves_333):
                continue
            rr.rotate('2' + move.upper())
            rr.rotate(move.upper())
        if move[0] == 'E':
            move = '2' + move.replace('E', 'D')
        if move[0] == 'M':
            move = '2' + move.replace('M', 'L')
        if move[0] == 'S':
            move = '2' + move.replace('S', 'F')
        if move in moves_333:
            rr.rotate(move)
    state = "".join(rr.state)
    return state


def get_raw_code(code_type: str, sequence: str) -> str:
    full_char = ""
    state = sequence_to_state(sequence)
    steps_dict = {
        "edge": 2,
        "corner": 3
    }
    code_order_dict = {
        "edge": edge_ch_default,
        "corner": corner_ch_default
    }
    code_order = code_order_dict[code_type]
    steps = steps_dict[code_type]
    for i in range(0, 24, steps):
        if not any(code_order[i + j] in full_char for j in range(steps)):
            part_char = code_order[i]
            while track(code_type, part_char[-1], state) != part_char[0]:
                part_char = part_char + track(code_type, part_char[-1], state)
            if part_char != code_order[i]:
                full_char = full_char + part_char + code_order[i]
    return full_char


def centersolved(sequence: str) -> bool:
    if sequence == "":
        return False
    for strs in sequence:
        if strs not in "RUDFBLrudfblEMSwxyz23' ":
            return False
    if sequence[0] in "1234567890' ":
        return False
    state = sequence_to_state(sequence)
    if (state[5] == "U") and (state[23] == "F"):
        return True
    return False


def get_code_auto(x: str) -> tuple:
    if centersolved(x) == False:
        return ("", "")
    code_json = {}
    code_json["edge"] = get_raw_code("edge", x)
    code_json["corner"] = get_raw_code("corner", x)
    if len(code_json["edge"]) == 4 and len(code_json["corner"]) == 0:
        return ("edge", code_json["edge"][0] + code_json["edge"][2] + code_json["edge"][1])
    if len(code_json["edge"]) == 0 and len(code_json["corner"]) == 4:
        return ("corner", code_json["corner"][0] + code_json["corner"][2] + code_json["corner"][1])
    return ("", "")
