from ..util.problem_solver import problem_solver
from ..util.in_range import in_bounds
from typing import Tuple

DIRECTIONS = [
    (-1, 0),  # UP
    (1, 0),  # DOWN
    (0, -1),  # LEFT
    (0, 1),  # RIGHT
]


def solver(lines: list[str]) -> int:
    topographic_map = parse_lines(lines)
    trailheads = find_trailheads(topographic_map)

    trail_count = 0
    for i, j in trailheads:
        visited = [[False] * len(row) for row in topographic_map]
        head_count = find_trails(topographic_map, i, j, visited)
        trail_count += head_count
    return trail_count


def parse_lines(lines: list[str]) -> list[list[int]]:
    topographic_map: list[list[int]] = []
    for line in lines:
        topographic_map.append([int(num) for num in list(line)])
    return topographic_map


def find_trailheads(topographic_map: list[list[int]]) -> list[Tuple[int, int]]:
    trailheads: list[Tuple[int, int]] = []
    for i, row in enumerate(topographic_map):
        for j, num in enumerate(row):
            if num == 0:
                trailheads.append((i, j))
    return trailheads


def find_trails(topographic_map: list[list[int]], i: int, j: int, visited: list[list[bool]]) -> int:
    visited[i][j] = True
    if topographic_map[i][j] == 9:
        return 1
    trail_count = 0
    for di, dj in DIRECTIONS:
        new_i, new_j = i + di, j + dj
        if not in_bounds(new_i, new_j, topographic_map):
            continue
        if visited[new_i][new_j]:
            continue
        if topographic_map[new_i][new_j] - topographic_map[i][j] != 1:
            continue
        trail_count += find_trails(topographic_map, new_i, new_j, visited)
    return trail_count


if __name__ == "__main__":
    problem_solver(
        day=10,
        solver=solver,
        sample_answer=36,
    )
