from ..util.problem_solver import problem_solver

search_str = ["X", "M", "A", "S"]
offset_directions = [
    (0, 1),
    (1, 1),
    (1, 0),
    (1, -1),
    (0, -1),
    (-1, -1),
    (-1, 0),
    (-1, 1),
]


def parse_lines(lines: list[str]) -> list[list[str]]:
    rows = []
    for line in lines:
        col = list(line)
        rows.append(col)
    return rows


def solver(lines: list[str]) -> int:
    matrix = parse_lines(lines)
    count = 0
    for x, row in enumerate(matrix):
        for y, start_char in enumerate(row):
            if start_char != search_str[0]:
                continue
            for direction in offset_directions:
                x_offset, y_offset = direction
                for i in range(1, len(search_str)):
                    char_x, char_y = x + (i * x_offset), y + (i * y_offset)
                    char = access(matrix, char_x, char_y)
                    if char != search_str[i]:
                        break  # skips the else block
                else:
                    count += 1
    return count


def access(matrix: list[list[str]], i: int, j: int) -> str | None:
    if i < 0 or len(matrix) <= i:
        return None
    if j < 0 or len(matrix[i]) <= j:
        return None
    return matrix[i][j]


if __name__ == "__main__":
    problem_solver(
        day=4,
        solver=solver,
        sample_answer=18,
    )
