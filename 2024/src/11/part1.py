from ..util.problem_solver import problem_solver


def solver(lines: list[str]) -> int:
    stones: list[int] = [int(num) for num in lines[0].split()]
    for _ in range(25):
        stones = blink(stones)
    return len(stones)


def blink(stones: list[int]) -> list[int]:
    new_stones = []
    for stone in stones:
        if stone == 0:
            new_stones.append(1)
            continue
        stone_str = str(stone)
        stone_str_digit_count = len(stone_str)
        if stone_str_digit_count % 2 == 0:
            new_stones.append(int(stone_str[: stone_str_digit_count // 2]))
            new_stones.append(int(stone_str[stone_str_digit_count // 2 :]))
            continue
        new_stones.append(2024 * stone)
    return new_stones


if __name__ == "__main__":
    problem_solver(
        day=11,
        solver=solver,
        sample_answer=55312,
    )
