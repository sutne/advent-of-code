from ..util.problem_solver import problem_solver
from ..util.in_range import in_bounds
from typing import Tuple

DIRECTIONS = [(-1, 0), (1, 0), (0, -1), (0, 1)]


def solver(lines: list[str]) -> int:
    farm: list[list[str]] = [list(line) for line in lines]
    covered: list[list[bool]] = [[False] * (len(row)) for row in farm]

    price = 0
    for i in range(len(farm)):
        for j in range(len(farm[i])):
            if covered[i][j]:
                continue
            region, perimiter = bfs(farm, i, j)
            for plot_i, plot_j in region:
                covered[plot_i][plot_j] = True
            area = len(region)

            price += area * perimiter

    return price


# use BFS, area is all nodes taken from queue, perimiter is equal to how
# many neighbors were NOT added to the queue (or is not inside the plot)
def bfs(farm: list[list[str]], start_i: int, start_j: int) -> Tuple[list[Tuple[int, int]], int]:
    region: list[Tuple[int, int]] = []
    perimeter = 0

    queue: set[Tuple[int, int]] = set()
    queue.add((start_i, start_j))
    visited: list[list[bool]] = [[False] * (len(row)) for row in farm]
    while len(queue) > 0:
        i, j = queue.pop()
        region.append((i, j))
        visited[i][j] = True

        for di, dj in DIRECTIONS:
            next_i, next_j = i + di, j + dj
            if not in_bounds(next_i, next_j, farm):
                perimeter += 1
                continue
            if visited[next_i][next_j]:
                continue  # already checked and counted
            if farm[next_i][next_j] != farm[start_i][start_j]:
                perimeter += 1
                continue
            queue.add((next_i, next_j))
    return region, perimeter


if __name__ == "__main__":
    problem_solver(
        day=12,
        solver=solver,
        sample_answer=1930,
    )
