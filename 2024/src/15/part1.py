from dataclasses import dataclass
from enum import Enum
from typing import Tuple

from ..util.in_range import in_bounds
from ..util.problem_solver import problem_solver, write_lines


class Entity(Enum):
    ROBOT = "@"
    WALL = "#"
    BOX = "O"
    FREE = "."


class Direction(Enum):
    UP = "^"
    DOWN = "v"
    LEFT = "<"
    RIGHT = ">"


MOVEMENT = {
    Direction.UP: (0, -1),
    Direction.DOWN: (0, 1),
    Direction.LEFT: (-1, 0),
    Direction.RIGHT: (1, 0),
}


@dataclass
class Position:
    x: int
    y: int

    def offset(self, direction: Direction, count: int = 1) -> "Position":
        dx, dy = MOVEMENT[direction]
        return Position(self.x + count * dx, self.y + count * dy)


class Warehouse:
    robot: Position
    overview: list[list[Entity]]

    def __init__(self):
        self.overview = []

    def _get(self, pos: Position) -> Entity | None:
        if not in_bounds(pos.y, pos.x, self.overview):
            return None
        return self.overview[pos.y][pos.x]

    def _swap(self, a: Position, b: Position):
        temp = self.overview[a.y][a.x]
        self.overview[a.y][a.x] = self.overview[b.y][b.x]
        self.overview[b.y][b.x] = temp

    def move_robot(self, direction: Direction) -> None:
        new_pos = self.robot.offset(direction)
        front_entity = self._get(new_pos)
        if front_entity in [None, Entity.WALL]:
            return
        if front_entity == Entity.FREE:
            self._swap(self.robot, new_pos)
            self.robot = new_pos
            return

        # box in front, find first in front that isn't a box
        step_count = 2
        while self._get(self.robot.offset(direction, count=step_count)) == Entity.BOX:
            step_count += 1

        if self._get(self.robot.offset(direction, count=step_count)) == Entity.FREE:
            self._swap(self.robot.offset(direction), self.robot.offset(direction, count=step_count))
            self._swap(self.robot, self.robot.offset(direction))
            self.robot = self.robot.offset(direction)

    def sum_gps_coordinates(self) -> int:
        sum = 0
        for y, row in enumerate(self.overview):
            for x, entity in enumerate(row):
                if entity != Entity.BOX:
                    continue
                sum += x + (100 * y)
        return sum

    def write(self):
        write_lines(day=15, output_nr=1, lines=[str(self)])

    def __str__(self):
        return "\n".join(["".join([entity.value for entity in row]) for row in self.overview])


def parse_lines(lines: list[str]) -> Tuple[Warehouse, list[Direction]]:
    warehouse = Warehouse()
    i = 0
    while lines[i] != "":
        line = lines[i]
        chars = list(line)
        row = [Entity(char) for char in chars]
        warehouse.overview.append(row)
        for j, entity in enumerate(row):
            if entity == Entity.ROBOT:
                warehouse.robot = Position(j, i)
        i += 1
    i += 1
    directions = []
    while i < len(lines):
        line = lines[i]
        chars = list(line)
        directions.extend([Direction(char) for char in chars])
        i += 1
    return warehouse, directions


def solver(lines: list[str]) -> int:
    warehouse, directions = parse_lines(lines)
    for direction in directions:
        warehouse.move_robot(direction)
    warehouse.write()
    return warehouse.sum_gps_coordinates()


if __name__ == "__main__":
    problem_solver(
        day=15,
        solver=solver,
        sample_answer=10092,
    )
