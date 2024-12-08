from ..util.problem_solver import problem_solver, write_lines
from .part1 import parse_lines, count_antinode_locations, EMPTY, ANTINODE


def solver(lines: list[str]) -> int:
    char_matrix, frequency_locations = parse_lines(lines)
    antinode_matrix = [["."] * len(row) for row in char_matrix]

    def place_antinode(i: int, j: int):
        if i < 0 or len(char_matrix) <= i or j < 0 or len(char_matrix[i]) <= j:
            return  # out of map
        antinode_matrix[i][j] = ANTINODE
        if char_matrix[i][j] == EMPTY:
            char_matrix[i][j] = ANTINODE

    for char, locations in frequency_locations.items():
        for location_a in locations:
            for location_b in locations:
                a_i, a_j = location_a
                b_i, b_j = location_b
                if a_i == b_i and a_j == b_j:
                    continue  # a and b are same location

                offset_i, offset_j = (b_i - a_i), (b_j - a_j)

                i, j = a_i, a_j
                while 0 <= i and i < len(char_matrix) and 0 <= j and j < len(char_matrix[i]):
                    i += offset_i
                    j += offset_j
                    place_antinode(i, j)

    write_char_matrix(char_matrix)
    return count_antinode_locations(antinode_matrix)


def write_char_matrix(char_matrix: list[list[str]]) -> None:
    write_lines(day=8, output_nr=2, lines=["".join(row) for row in char_matrix])


if __name__ == "__main__":
    problem_solver(
        day=8,
        solver=solver,
        sample_answer=34,
    )
