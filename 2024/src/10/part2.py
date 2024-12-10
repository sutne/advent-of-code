from ..util.problem_solver import problem_solver
from ..util.in_range import in_bounds
from .part1 import parse_lines, find_trailheads, DIRECTIONS


# same as part1, just removed "visited"
def solver(lines: list[str]) -> int:
    topographic_map = parse_lines(lines)
    trailheads = find_trailheads(topographic_map)

    trail_count = 0
    for i, j in trailheads:
        head_count = find_trails(topographic_map, i, j)
        trail_count += head_count
    return trail_count


def find_trails(topographic_map: list[list[int]], i: int, j: int) -> int:
    if topographic_map[i][j] == 9:
        return 1
    trail_count = 0
    for di, dj in DIRECTIONS:
        new_i, new_j = i + di, j + dj
        if not in_bounds(new_i, new_j, topographic_map):
            continue
        if topographic_map[new_i][new_j] - topographic_map[i][j] != 1:
            continue
        trail_count += find_trails(topographic_map, new_i, new_j)
    return trail_count


if __name__ == "__main__":
    problem_solver(
        day=10,
        solver=solver,
        sample_answer=81,
    )
