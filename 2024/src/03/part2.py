from ..util.problem_solver import problem_solver
from .part1 import solver as part1_solver
import re


def solver(lines: list[str]) -> int:
    input = "".join(lines)
    without_donts = re.sub(r"don't\(\).*?((do\(\))|$)", "", input)
    return part1_solver([without_donts])


if __name__ == "__main__":
    problem_solver(
        day=3,
        solver=solver,
        sample_nr=2,
        sample_answer=48,
    )
