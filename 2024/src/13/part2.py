from ..util.problem_solver import problem_solver
from .part1 import find_solution, parse_lines


def solver(lines: list[str]) -> int:
    machines = parse_lines(lines)
    for machine in machines:
        machine.prize.x += 10000000000000
        machine.prize.y += 10000000000000

    total_token_count = 0
    for machine in machines:
        machine_min_cost = find_solution(machine)
        if machine_min_cost is None:
            continue
        total_token_count += machine_min_cost
    return total_token_count


if __name__ == "__main__":
    problem_solver(
        day=13,
        solver=solver,
    )
