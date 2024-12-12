from ..util.problem_solver import problem_solver, write_lines
from ..util.in_range import in_bounds
from .part1 import DIRECTIONS
from typing import Tuple
from enum import Enum


class Side(Enum):
    INSIDE = 1
    OUTSIDE = 2


def solver(lines: list[str]) -> int:
    write_lines(day=12, output_nr=2, lines=[])  # clear file, for appending later

    farm: list[list[str]] = [list(line) for line in lines]
    covered: list[list[bool]] = [[False] * (len(row)) for row in farm]

    price = 0
    for i in range(len(farm)):
        for j in range(len(farm[i])):
            if covered[i][j]:
                continue
            region = bfs(farm, i, j)
            area = len(region)
            side_count = count_sides(region)
            for plot_i, plot_j in region:
                covered[plot_i][plot_j] = True

            price += area * side_count

    return price


def count_sides(region: list[Tuple[int, int]]) -> int:
    i_values = [i for i, j in region]
    j_values = [j for i, j in region]
    min_i, max_i = min(i_values), max(i_values)
    min_j, max_j = min(j_values), max(j_values)
    i_count = max_i + 1 - min_i
    j_count = max_j + 1 - min_j

    region_map: list[list[bool]] = [[False] * j_count for _ in range(i_count)]
    for i, j in region:
        region_map[i - min_i][j - min_j] = True

    horizontal_side_count = 0
    for i in range(i_count + 1):
        above_i = i - 1
        active_side: Side | None = None
        for j in range(j_count):
            column_value = region_map[i][j] if i < i_count else False
            above_value = region_map[above_i][j] if 0 <= above_i else False

            new_active_side: Side | None = None
            if column_value and not above_value:
                new_active_side = Side.INSIDE
            if not column_value and above_value:
                new_active_side = Side.OUTSIDE
            if active_side != new_active_side:
                if active_side is not None:
                    horizontal_side_count += 1
                active_side = new_active_side
        if active_side is not None:
            horizontal_side_count += 1

    # number of horizontal and vertical sides will always be the same!
    vertical_side_count = horizontal_side_count
    side_count = horizontal_side_count + vertical_side_count

    write_lines(
        day=12,
        output_nr=2,
        lines=[
            *["".join(["█" if flag else "░" for flag in row]) for row in region_map],
            f"side count: {side_count}\n",
        ],
        append=True,
    )

    return side_count


def bfs(farm: list[list[str]], start_i: int, start_j: int) -> list[Tuple[int, int]]:
    area: list[Tuple[int, int]] = []

    queue: set[Tuple[int, int]] = set()
    queue.add((start_i, start_j))
    visited: list[list[bool]] = [[False] * (len(row)) for row in farm]
    while len(queue) > 0:
        i, j = queue.pop()
        area.append((i, j))
        visited[i][j] = True

        for di, dj in DIRECTIONS:
            next_i, next_j = i + di, j + dj
            if not in_bounds(next_i, next_j, farm):
                continue
            if visited[next_i][next_j]:
                continue
            if farm[next_i][next_j] != farm[start_i][start_j]:
                continue
            queue.add((next_i, next_j))
    return area


if __name__ == "__main__":
    problem_solver(
        day=12,
        solver=solver,
        sample_answer=1206,
    )
