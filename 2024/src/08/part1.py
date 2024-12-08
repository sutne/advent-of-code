from ..util.problem_solver import problem_solver, write_lines
from typing import Tuple


EMPTY = "."
ANTINODE = "#"


def parse_lines(lines: list[str]) -> Tuple[list[list[str]], dict[str, list[Tuple[int, int]]]]:
    char_matrix = []
    for line in lines:
        chars = list(line)
        char_matrix.append(chars)

    frequency_locations: dict[str, list[Tuple[int, int]]] = {}
    for i in range(len(char_matrix)):
        for j in range(len(char_matrix[i])):
            char = char_matrix[i][j]
            if char == EMPTY:
                continue
            if frequency_locations.get(char):
                frequency_locations[char].append((i, j))
                continue
            frequency_locations[char] = [(i, j)]

    return char_matrix, frequency_locations


def solver(lines: list[str]) -> int:
    char_matrix, frequency_locations = parse_lines(lines)
    antinode_matrix = [["."] * len(row) for row in char_matrix]

    def place_antinode(*, i: int, j: int):
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
                place_antinode(
                    i=b_i + (b_i - a_i),
                    j=b_j + (b_j - a_j),
                )

    write_char_matrix(char_matrix)
    return count_antinode_locations(antinode_matrix)


def count_antinode_locations(char_matrix: list[list[str]]) -> int:
    count = 0
    for row in char_matrix:
        for char in row:
            if char == ANTINODE:
                count += 1
    return count


def write_char_matrix(char_matrix: list[list[str]]) -> None:
    write_lines(day=8, output_nr=1, lines=["".join(row) for row in char_matrix])


if __name__ == "__main__":
    problem_solver(
        day=8,
        solver=solver,
        sample_answer=14,
    )
