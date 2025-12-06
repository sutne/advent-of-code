from ..util.problem_solver import problem_solver
from .part1 import parse


def solver(lines: list[str]) -> int:
    rotations = parse(lines)

    dial = 50
    count = 0
    for rotation in rotations:
        for _ in range(rotation.distance):
            if rotation.direction == "R":
                change = 1
            if rotation.direction == "L":
                change = -1

            dial = (dial + change) % 100
            if dial == 0:
                count += 1

    return count


if __name__ == "__main__":
    problem_solver(
        day=1,
        solver=solver,
        sample_answer=6,
    )
