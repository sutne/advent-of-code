from ..util.problem_solver import problem_solver
from .part1 import parse_lines, access


def solver(lines: list[str]) -> int:
    matrix = parse_lines(lines)

    count = 0
    for x, row in enumerate(matrix):
        for y, center_char in enumerate(row):
            if center_char != "A":
                continue
            # make sure both diagonals contain both S and M
            diag_a = [access(matrix, x + 1, y - 1), access(matrix, x - 1, y + 1)]
            if "M" not in diag_a or "S" not in diag_a:
                continue
            diag_b = [access(matrix, x + 1, y + 1), access(matrix, x - 1, y - 1)]
            if "M" not in diag_b or "S" not in diag_b:
                continue
            count += 1
    return count


if __name__ == "__main__":
    problem_solver(
        day=4,
        solver=solver,
        sample_answer=9,
    )
