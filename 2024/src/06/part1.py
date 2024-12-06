from ..util.problem_solver import problem_solver, write_lines
from typing import Tuple
from enum import Enum
# import time

free = "."
obstacle = "#"
visited = "X"


class Direction(Enum):
    UP = (0, -1)
    DOWN = (0, 1)
    LEFT = (-1, 0)
    RIGHT = (1, 0)


def parse_lines(lines: list[str]) -> list[list[str]]:
    return [list(line) for line in lines]


def solver(lines: list[str]) -> int:
    floor_map = parse_lines(lines)
    max_x, max_y = len(floor_map[0]) - 1, len(floor_map) - 1

    guard_x, guard_y, guard_direction = find_guard_pos(floor_map)

    while True:
        # to animeate the movement in the output file
        # write_map(floor_map)
        # time.sleep(0.1)

        dx, dy = guard_direction.value
        front_x, front_y = guard_x + dx, guard_y + dy

        if front_x < 0 or max_x < front_x or front_y < 0 or max_y < front_y:
            floor_map[guard_y][guard_x] = visited
            write_map(floor_map)
            break  # guard left the floor

        if floor_map[front_y][front_x] in [free, visited]:
            floor_map[guard_y][guard_x] = visited
            guard_x, guard_y = front_x, front_y
            continue

        # object in front must be an obstacle, so turn and continue
        guard_direction = turn(guard_direction)

    return count_visited_spots(floor_map)


def find_guard_pos(floor_map: list[list[str]]) -> Tuple[int, int, Direction]:
    for y in range(len(floor_map)):
        for x in range(len(floor_map[y])):
            if floor_map[y][x] not in [free, obstacle]:
                return (x, y, Direction.UP)
    raise RuntimeError("Could not find the guard 😳")


def turn(direction: Direction):
    match direction:
        case Direction.UP:
            return Direction.RIGHT
        case Direction.RIGHT:
            return Direction.DOWN
        case Direction.DOWN:
            return Direction.LEFT
        case Direction.LEFT:
            return Direction.UP


def count_visited_spots(floor_map: list[list[str]]) -> int:
    visited_count = 0
    for y in range(len(floor_map)):
        for x in range(len(floor_map[y])):
            if floor_map[y][x] == visited:
                visited_count += 1
    return visited_count


def write_map(floor_map: list[list[str]]) -> None:
    lines = ["".join(row) for row in floor_map]
    lines = [line.replace(".", " ") for line in lines]
    lines = [line.replace("#", "⏺") for line in lines]
    write_lines(day=6, output_nr=1, lines=lines)


if __name__ == "__main__":
    problem_solver(
        day=6,
        solver=solver,
        sample_answer=41,
    )
