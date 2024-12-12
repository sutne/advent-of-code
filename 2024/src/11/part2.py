from ..util.problem_solver import problem_solver
from functools import cache


def solver(lines: list[str]) -> int:
    stones: list[int] = [int(num) for num in lines[0].split()]
    count = 0
    for stone in stones:
        count += apply_rules(stone, 75)
    return count


@cache
def apply_rules(stone: int, remaining_steps: int) -> int:
    if remaining_steps == 0:
        return 1
    if stone == 0:
        return apply_rules(1, remaining_steps - 1)
    stone_str = str(stone)
    stone_str_digit_count = len(stone_str)
    if stone_str_digit_count % 2 == 0:
        a = apply_rules(int(stone_str[: stone_str_digit_count // 2]), remaining_steps - 1)
        b = apply_rules(int(stone_str[stone_str_digit_count // 2 :]), remaining_steps - 1)
        return a + b
    return apply_rules(2024 * stone, remaining_steps - 1)


if __name__ == "__main__":
    problem_solver(
        day=11,
        solver=solver,
    )
