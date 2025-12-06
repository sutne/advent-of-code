from dataclasses import dataclass
from typing import Literal, cast

from ..util.problem_solver import UnexpectedInputError, problem_solver


@dataclass
class Rotation:
    direction: Literal["R", "L"]
    distance: int


def parse(lines: list[str]) -> list[Rotation]:
    rotations = []
    for line in lines:
        direction: Literal["R", "L"] = cast(Literal["R", "L"], line[0])
        if direction not in ["R", "L"]:
            raise UnexpectedInputError(line)
        distance = int(line[1:])
        rotations.append(Rotation(direction, distance))
    return rotations


def solver(lines: list[str]) -> int:
    rotations = parse(lines)

    dial = 50
    count = 0
    for rotation in rotations:
        if rotation.direction == "R":
            change = rotation.distance
        if rotation.direction == "L":
            change = -rotation.distance

        dial = (dial + change) % 100

        if dial == 0:
            count += 1

    return count


if __name__ == "__main__":
    problem_solver(
        day=1,
        solver=solver,
        sample_answer=3,
    )
