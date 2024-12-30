import sys
from dataclasses import dataclass, field

from ..util.in_range import in_bounds
from ..util.problem_solver import problem_solver, write_lines
from .part1 import STEP_COST, TURN_COST, Direction, Entity, Position


@dataclass
class Node:
    entity: Entity
    position: Position
    neighbors: dict[Direction, "Node"] = field(default_factory=lambda: {})
    prev: list[Direction] = field(default_factory=lambda: [])
    cost: int = sys.maxsize

    def __repr__(self) -> str:
        return f"'{self.entity.value}' {self.position}: {self.cost}"


class Maze:
    grid: list[list[Node]]

    def __init__(self, grid: list[list[Node]]):
        self.grid = grid
        for row in self.grid:
            for node in row:
                for direction in list(Direction):
                    neighbor_pos = node.position.offset(direction)
                    if not in_bounds(neighbor_pos.y, neighbor_pos.x, self.grid):
                        continue
                    neighbor = self.grid[neighbor_pos.y][neighbor_pos.x]
                    if neighbor.entity != Entity.WALL:
                        node.neighbors[direction] = neighbor

    def solve(self) -> None:
        queue = [node for row in self.grid for node in row if node.entity != Entity.WALL]
        while queue:
            queue.sort(key=lambda n: n.cost)
            node = queue.pop(0)
            if node.entity == Entity.GOAL:
                return
            for direction, neighbor in node.neighbors.items():
                is_turn = direction.opposite() not in node.prev
                cost = node.cost + STEP_COST + (TURN_COST if is_turn else 0)
                # problem in sample:
                # node at [7][15] has cost as 10042, so it doesn't get [8][15] as neighbor
                # as cost from it gives 11042, however both of these should be valid, as the "next"
                # step from [7][15] to [6][15] will have cost 11043 for both "prev"
                if cost == neighbor.cost:
                    neighbor.prev.append(direction.opposite())
                    neighbor.cost = cost
                if cost < neighbor.cost:
                    neighbor.cost = cost
                    neighbor.prev = [direction.opposite()]
        raise Exception("Found no path from start to end")


def output_paths(maze: Maze) -> int:
    goal: Node = [node for row in maze.grid for node in row if node.entity == Entity.GOAL][0]
    output = [[node.entity.value for node in row] for row in maze.grid]
    tile_count = 0
    queue = [goal]
    while queue:
        node = queue.pop(0)
        tile_count += 1
        output[node.position.y][node.position.x] = "O"
        for dir in node.prev:
            neighbor = node.neighbors.get(dir)
            if neighbor:
                queue.append(neighbor)
    write_lines(day=16, output_nr=2, lines=["".join(row) for row in output])
    return tile_count


def parse_lines(lines: list[str]) -> Maze:
    maze: list[list[Node]] = []
    for y, line in enumerate(lines):
        row: list[Node] = []
        for x, char in enumerate(list(line)):
            node = Node(Entity(char), Position(x, y))
            if node.entity == Entity.START:
                node.cost = 0
                node.prev = [Direction.EAST.opposite()]
            row.append(node)
        maze.append(row)
    return Maze(maze)


def solver(lines: list[str]) -> int:
    maze = parse_lines(lines)
    maze.solve()
    paths_tile_count = output_paths(maze)
    return paths_tile_count


if __name__ == "__main__":
    problem_solver(
        day=16,
        solver=solver,
        sample_answer=64,
    )
