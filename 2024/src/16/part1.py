import sys
from dataclasses import dataclass, field
from enum import Enum

from ..util.in_range import in_bounds
from ..util.problem_solver import problem_solver, write_lines


class Entity(Enum):
    WALL = "#"
    START = "S"
    GOAL = "E"
    FREE = "."

    def __repr__(self) -> str:
        return self.name


class Direction(Enum):
    NORTH = (0, -1)
    SOUTH = (0, 1)
    EAST = (1, 0)
    WEST = (-1, 0)

    def opposite(self) -> "Direction":
        match self:
            case Direction.NORTH:
                return Direction.SOUTH
            case Direction.SOUTH:
                return Direction.NORTH
            case Direction.EAST:
                return Direction.WEST
            case Direction.WEST:
                return Direction.EAST

    def __str__(self) -> str:
        match self:
            case Direction.NORTH:
                return "^"
            case Direction.SOUTH:
                return "v"
            case Direction.EAST:
                return ">"
            case Direction.WEST:
                return "<"

    def __repr__(self) -> str:
        return self.name


@dataclass
class Position:
    x: int
    y: int

    def offset(self, direction: Direction) -> "Position":
        return Position(self.x + direction.value[0], self.y + direction.value[1])

    def __repr__(self) -> str:
        return f"[{self.y}][{self.x}]"


@dataclass
class Node:
    entity: Entity
    position: Position
    neighbors: dict[Direction, "Node"] = field(default_factory=lambda: {})
    cost: int = sys.maxsize
    prev: Direction | None = None


STEP_COST = 1
TURN_COST = 1000


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

    def solve(self) -> int:
        queue = [node for row in self.grid for node in row if node.entity != Entity.WALL]
        while queue:
            queue.sort(key=lambda n: n.cost)
            node = queue.pop(0)
            if node.entity == Entity.GOAL:
                return node.cost
            for direction, neighbor in node.neighbors.items():
                is_turn = direction.opposite() != node.prev
                cost = node.cost + STEP_COST + (TURN_COST if is_turn else 0)
                if cost < neighbor.cost:
                    neighbor.cost = cost
                    neighbor.prev = direction.opposite()
        raise Exception("Found no path from start to end")


def output_path(maze: Maze) -> None:
    goal: Node = [node for row in maze.grid for node in row if node.entity == Entity.GOAL][0]
    output = [[node.entity.value for node in row] for row in maze.grid]
    queue = [goal]
    while queue:
        node = queue.pop(0)
        if node.prev is not None:
            neighbor = node.neighbors.get(node.prev, None)
            if neighbor is not None:
                output[neighbor.position.y][neighbor.position.x] = str(node.prev.opposite())
                queue.append(node.neighbors[node.prev])
    write_lines(day=16, output_nr=1, lines=["".join(row) for row in output])


def parse_lines(lines: list[str]) -> Maze:
    maze: list[list[Node]] = []
    for y, line in enumerate(lines):
        row: list[Node] = []
        for x, char in enumerate(list(line)):
            node = Node(Entity(char), Position(x, y), {})
            if node.entity == Entity.START:
                node.cost = 0
                node.prev = Direction.EAST.opposite()
            row.append(node)
        maze.append(row)
    return Maze(maze)


def solver(lines: list[str]) -> int:
    maze = parse_lines(lines)
    cost = maze.solve()
    output_path(maze)
    return cost


if __name__ == "__main__":
    problem_solver(
        day=16,
        solver=solver,
        sample_answer=11048,
    )
