from ..util.problem_solver import problem_solver
from .part1 import parse_lines, is_valid
from typing import Tuple
from functools import cmp_to_key


def solver(lines: list[str]) -> int:
    rules, updates = parse_lines(lines)
    invalid_updates = [update for update in updates if not is_valid(rules, update)]
    ordered_updates = [
        sorted(update, key=cmp_to_key(lambda a, b: comparator(rules, a, b)))
        for update in invalid_updates
    ]
    middle_update_pages = [update[len(update) // 2] for update in ordered_updates]
    return sum(middle_update_pages)


def comparator(rules: list[Tuple[int, int]], a: int, b: int) -> int:
    """Sort the list, by swapping whenever two pages are in an invalid order"""
    for rule in rules:
        x, y = rule
        if x == a and y == b:
            return -1  # a must come before b (they are correct)
        if x == b and y == a:
            return 1  # b must come before a
    return 0  # no need to change order


if __name__ == "__main__":
    problem_solver(
        day=5,
        solver=solver,
        sample_answer=123,
    )
