from ..util.problem_solver import problem_solver
from .part1 import parse_lines
from enum import Enum


class Operator(Enum):
    ADD = "+"
    MULTIPLY = "*"
    JOIN = "||"


def solver(lines: list[str]) -> int:
    calibrations = parse_lines(lines)
    valid_calibration_results = [
        result for result, numbers in calibrations if is_true_calibration(result, numbers)
    ]
    return sum(valid_calibration_results)


def is_true_calibration(result: int, numbers: list[int]) -> bool:
    if len(numbers) == 1:
        return result == numbers[0]
    for operator in Operator:
        if is_true_calibration(result, numbers=apply_operator_on_first_pair(numbers, operator)):
            return True
    return False


def apply_operator_on_first_pair(numbers: list[int], operator: Operator) -> list[int]:
    a, b = numbers[0], numbers[1]
    match operator:
        case Operator.ADD:
            return [a + b, *numbers[2:]]
        case Operator.MULTIPLY:
            return [a * b, *numbers[2:]]
        case Operator.JOIN:
            return [int(f"{a}{b}"), *numbers[2:]]


if __name__ == "__main__":
    problem_solver(
        day=7,
        solver=solver,
        sample_answer=11387,
    )
