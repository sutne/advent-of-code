from ..util.problem_solver import problem_solver
from typing import Tuple


def parse_lines(lines: list[str]) -> Tuple[list[Tuple[int, int]], list[list[int]]]:
    rules: list[Tuple[int, int]] = []
    updates: list[list[int]] = []
    i = 0
    line = lines[i]
    while line != "":
        str_nums = line.split("|")
        nums = [int(val) for val in str_nums]
        rules.append((nums[0], nums[1]))
        i += 1
        line = lines[i]
    i += 1  # skip empty line
    while i < len(lines):
        line = lines[i]
        i += 1
        updates.append([int(val) for val in line.split(",")])
    return rules, updates


def solver(lines: list[str]) -> int:
    rules, updates = parse_lines(lines)
    valid_updates = [update for update in updates if is_valid(rules, update)]
    middle_update_pages = [update[len(update) // 2] for update in valid_updates]
    return sum(middle_update_pages)


def is_valid(rules: list[Tuple[int, int]], update: list[int]) -> bool:
    blocked_pages: set[int] = set()
    for page in update:
        if page in blocked_pages:
            return False
        for rule in rules:
            x, y = rule
            if page == y:
                blocked_pages.add(x)
    return True


if __name__ == "__main__":
    problem_solver(
        day=5,
        solver=solver,
        sample_answer=143,
    )
