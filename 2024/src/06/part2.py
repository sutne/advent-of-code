from ..util.problem_solver import problem_solver
from .part1 import turn, parse_lines, find_guard_pos, Direction, free, obstacle, visited
import copy

agent = "^"


def solver(lines: list[str]) -> int:
    floor_map = parse_lines(lines)

    # brute force ftw
    count = 0
    for test_y in range(len(floor_map)):
        for test_x in range(len(floor_map[test_y])):
            floor_spot = floor_map[test_y][test_x]
            if floor_spot in [obstacle, agent]:
                continue

            test_floor = copy.deepcopy(floor_map)
            test_floor[test_y][test_x] = obstacle

            if is_loop(test_floor):
                count += 1

    return count


def is_loop(floor_map: list[list[str]]) -> bool:
    max_x, max_y = len(floor_map[0]) - 1, len(floor_map) - 1
    guard_x, guard_y, guard_direction = find_guard_pos(floor_map)

    # store guard steps so we can use them to check if we are on a loop
    guard_steps: list[list[list[Direction]]] = []
    for y in range(max_y + 1):
        guard_steps.append([])
        for _ in range(max_x + 1):
            guard_steps[y].append([])

    while True:
        if guard_direction in guard_steps[guard_y][guard_x]:
            return True  # retraced previous step, guard is looping

        guard_steps[guard_y][guard_x].append(guard_direction)

        dx, dy = guard_direction.value
        front_x, front_y = guard_x + dx, guard_y + dy

        if front_x < 0 or max_x < front_x or front_y < 0 or max_y < front_y:
            floor_map[guard_y][guard_x] = visited
            break

        if floor_map[front_y][front_x] in [free, visited]:
            floor_map[guard_y][guard_x] = visited
            guard_x, guard_y = front_x, front_y
            continue

        guard_direction = turn(guard_direction)
    return False


if __name__ == "__main__":
    problem_solver(
        day=6,
        solver=solver,
        sample_answer=6,
    )
