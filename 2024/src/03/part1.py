from ..util.problem_solver import problem_solver
import re
from typing import Tuple


def solver(lines: list[str]) -> int:
    input = "".join(lines)
    sum = 0
    for a, b in find_multiplication_pairs(input):
        sum += a * b
    return sum


def find_multiplication_pairs(s: str) -> list[Tuple[int, int]]:
    str_nums: list[Tuple[str, str]] = re.findall(r"mul\(([0-9]{1,3}),([0-9]{1,3})\)", s)
    return [(int(a), int(b)) for a, b in str_nums]


if __name__ == "__main__":
    problem_solver(
        day=3,
        solver=solver,
        sample_nr=1,
        sample_answer=161,
    )
