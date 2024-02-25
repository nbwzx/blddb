from rubikscubennnsolver.RubiksCube555 import RubiksCube555
edge_ch_default = "GHABCDEFOPKLQRSTYZIJWXMN"
corner_ch_default = "JKLGHIABCDEFXYZWMNRSTOPQ"

moves_555 = (
    "U", "U'", "U2", "Uw", "Uw'", "Uw2", "3Uw", "3Uw'", "3Uw2", "4Uw", "4Uw'", "4Uw2",
    "L", "L'", "L2", "Lw", "Lw'", "Lw2", "3Lw", "3Lw'", "3Lw2", "4Lw", "4Lw'", "4Lw2",
    "F", "F'", "F2", "Fw", "Fw'", "Fw2", "3Fw", "3Fw'", "3Fw2", "4Fw", "4Fw'", "4Fw2",
    "R", "R'", "R2", "Rw", "Rw'", "Rw2", "3Rw", "3Rw'", "3Rw2", "4Rw", "4Rw'", "4Rw2",
    "B", "B'", "B2", "Bw", "Bw'", "Bw2", "3Bw", "3Bw'", "3Bw2", "4Bw", "4Bw'", "4Bw2",
    "D", "D'", "D2", "Dw", "Dw'", "Dw2", "3Dw", "3Dw'", "3Dw2", "4Dw", "4Dw'", "4Dw2",
    "2U", "2U'", "2U2", "2D", "2D'", "2D2",
    "2L", "2L'", "2L2", "2R", "2R'", "2R2",
    "2F", "2F'", "2F2", "2B", "2B'", "2B2",
    "3U", "3U'", "3U2", "3D", "3D'", "3D2",
    "3L", "3L'", "3L2", "3R", "3R'", "3R2",
    "3F", "3F'", "3F2", "3B", "3B'", "3B2",
    "x", "y", "z", "x'", "y'", "z'", "x2", "y2", "z2"
)

solved_555 = \
    "DEE G DEGGCCUGGCAAJ A AAJ\
EDD C EDCTXXLTTXQLM Q LLM\
BBB L BBLQSSFQQSNJY N JJY\
KHH I KHIZRRRZZRZPS Z PPS\
HFF F HFFWYYBWWYTNP T NNP\
WII X WIXOKKDOOKOMR O MMR"
# ULFRBD


track_dict = {
    "wing": [2, 10, 16, 24, 27, 35, 41, 49, 52, 60, 66, 74, 77, 85, 91, 99, 102, 110, 116, 124, 127, 135, 141, 149],
    "midge": [3, 11, 15, 23, 28, 36, 40, 48, 53, 61, 65, 73, 78, 86, 90, 98, 103, 111, 115, 123, 128, 136, 140, 148],
    "xcenter": [7, 9, 17, 19, 32, 34, 42, 44, 57, 59, 67, 69, 82, 84, 92, 94, 107, 109, 117, 119, 132, 134, 142, 144],
    "tcenter": [8, 12, 14, 18, 33, 37, 39, 43, 58, 62, 64, 68, 83, 87, 89, 93, 108, 112, 114, 118, 133, 137, 139, 143],
    "corner": [1, 5, 21, 25, 26, 30, 46, 50, 51, 55, 71, 75, 76, 80, 96, 100, 101, 105, 121, 125, 126, 130, 146, 150]
}

track_map = {
    key: {solved_555[x - 1]: x for x in track_dict[key]} for key in track_dict}


def stm(s1: str) -> int:
    return s1.count(" ") + 1


def qtm(s1: str) -> int:
    return s1.count(" ") + s1.count("2") + 1


def track(code_type: str, track_s1: str, a: str) -> str:
    return a[track_map[code_type][track_s1]]


def area_tcenter(track_s1: str) -> int:
    return int(track_map["tcenter"][track_s1] / 25)


def sequence_to_state(sequence: str) -> str:
    rr = RubiksCube555(solved_555, 'ULFRBD')
    moves = [x for x in sequence.split(" ") if x]

    # Apply this sequence to the cube
    for move in moves:
        if move[0].islower() and move[0] in ['r', 'u', 'd', 'l', 'f', 'b']:
            move = '2' + move.upper()
        if move[0] == 'e':
            move = '3' + move.replace('e', 'D')
        if move[0] == 'm':
            move = '3' + move.replace('m', 'L')
        if move[0] == 's':
            move = '3' + move.replace('s', 'F')
        if move[0] in ['E', 'M', 'S']:
            if move[0] == 'E':
                if (move.replace('E', 'Dw') not in moves_555) or (move.replace('E', 'D') not in moves_555):
                    continue
                rr.rotate('4' + move.replace('E', 'Dw'))
                rr.rotate(move.replace('E', 'D'))
                rr.rotate(move.replace('E', 'D'))
                rr.rotate(move.replace('E', 'D'))
            if move[0] == 'M':
                if (move.replace('M', 'Lw') not in moves_555) or (move.replace('M', 'L') not in moves_555):
                    continue
                rr.rotate('4' + move.replace('M', 'Lw'))
                rr.rotate(move.replace('M', 'L'))
                rr.rotate(move.replace('M', 'L'))
                rr.rotate(move.replace('M', 'L'))
            if move[0] == 'S':
                if (move.replace('S', 'Fw') not in moves_555) or (move.replace('S', 'F') not in moves_555):
                    continue
                rr.rotate('4' + move.replace('S', 'Fw'))
                rr.rotate(move.replace('S', 'F'))
                rr.rotate(move.replace('S', 'F'))
                rr.rotate(move.replace('S', 'F'))
        elif move in moves_555:
            rr.rotate(move)
    state = "".join(rr.state)
    return state


def get_raw_code(code_type: str, sequence: str) -> str:
    full_char = ""
    state = sequence_to_state(sequence)
    steps_dict = {
        "wing": 1,
        "midge": 2,
        "tcenter": 1,
        "xcenter": 1,
        "corner": 3
    }
    code_order_dict = {
        "wing": edge_ch_default,
        "midge": edge_ch_default,
        "tcenter": edge_ch_default,
        "xcenter": corner_ch_default,
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
        if strs not in "RUDFBLrudfblEMSemswxyz234' ":
            return False
    if sequence[0] in "12567890' ":
        return False
    state = sequence_to_state(sequence)
    if (state[13] == "U") and (state[63] == "F"):
        return True
    return False


def midgesolved(sequence: str, edge_ch=edge_ch_default) -> bool:
    full_char = ""
    state = sequence_to_state(sequence)
    for i in range(0, 24, 1):
        if not ((edge_ch[i] in full_char)):
            edgepart_char = edge_ch[i]
            while track("tcenter", edgepart_char[-1], state) != edgepart_char[0]:
                if area_tcenter(track("tcenter", edgepart_char[-1], state)) != area_tcenter(edgepart_char[0]):
                    return False
                edgepart_char = edgepart_char + \
                    track("tcenter", edgepart_char[-1], state)
            if edgepart_char != edge_ch[i]:
                full_char = full_char + edgepart_char + edge_ch[i]
    return True


def get_code(code_type: str, x: str) -> str:
    if code_type == "wing":
        if get_raw_code("xcenter", x) != "" or get_raw_code("tcenter", x) != "" or get_raw_code("midge", x) != "" or get_raw_code("corner", x) != "" or centersolved(x) == False:
            return ""
        cf = get_raw_code("wing", x)
        if len(cf) == 4:
            return cf[0] + cf[2] + cf[1]
        return ""
    if code_type == "midge":
        if get_raw_code("xcenter", x) != "" or get_raw_code("wing", x) != "" or get_raw_code("corner", x) != "" or centersolved(x) == False or midgesolved(x) == False:
            return ""
        cf = get_raw_code("midge", x)
        if len(cf) == 4:
            return cf[0] + cf[2] + cf[1]
        return ""
    if code_type == "xcenter":
        if get_raw_code("wing", x) != "" or get_raw_code("tcenter", x) != "" or get_raw_code("midge", x) != "" or get_raw_code("corner", x) != "" or centersolved(x) == False:
            return ""
        cf = get_raw_code("xcenter", x)
        if len(cf) == 4:
            return cf[0] + cf[2] + cf[1]
        return ""
    if code_type == "tcenter":
        if get_raw_code("wing", x) != "" or get_raw_code("xcenter", x) != "" or get_raw_code("midge", x) != "" or get_raw_code("corner", x) != "" or centersolved(x) == False:
            return ""
        cf = get_raw_code("tcenter", x)
        if len(cf) == 4:
            return cf[0] + cf[2] + cf[1]
        return ""
    return ""


def get_code_auto(x: str) -> str:
    if centersolved(x) == False:
        return ("", "")
    code_json = {}
    code_json["wing"] = get_raw_code("wing", x)
    code_json["midge"] = get_raw_code("midge", x)
    code_json["xcenter"] = get_raw_code("xcenter", x)
    code_json["tcenter"] = get_raw_code("tcenter", x)
    code_json["corner"] = get_raw_code("corner", x)
    code_json["midgesolved"] = midgesolved(x)
    if code_json["xcenter"] == "" and code_json["tcenter"] == "" and code_json["midge"] == "" and code_json["corner"] == "" and len(code_json["wing"]) == 4:
        return ("wing", code_json["wing"][0] + code_json["wing"][2] + code_json["wing"][1])
    if code_json["xcenter"] == "" and code_json["wing"] == "" and code_json["corner"] == "" and code_json["midgesolved"] and len(code_json["midge"]) == 4:
        return ("midge", code_json["midge"][0] + code_json["midge"][2] + code_json["midge"][1])
    if code_json["wing"] == "" and code_json["tcenter"] == "" and code_json["midge"] == "" and code_json["corner"] == "" and len(code_json["xcenter"]) == 4:
        return ("xcenter", code_json["xcenter"][0] + code_json["xcenter"][2] + code_json["xcenter"][1])
    if code_json["wing"] == "" and code_json["xcenter"] == "" and code_json["midge"] == "" and code_json["corner"] == "" and len(code_json["tcenter"]) == 4:
        return ("tcenter", code_json["tcenter"][0] + code_json["tcenter"][2] + code_json["tcenter"][1])
    return ("", "")
