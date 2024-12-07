from ..util.problem_solver import problem_solver
from enum import Enum
from typing import Tuple


class Operator(Enum):
    ADD = "+"
    MULTIPLY = "*"


def parse_lines(lines: list[str]) -> list[Tuple[int, list[int]]]:
    calibrations = []
    for line in lines:
        result_str, numbers_str = line.split(": ")
        number_strs = numbers_str.split()
        calibrations.append((int(result_str), [int(num) for num in number_strs]))
    return calibrations


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


if __name__ == "__main__":
    problem_solver(
        day=7,
        solver=solver,
        sample_answer=3749,
    )
