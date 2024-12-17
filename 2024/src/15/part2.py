from enum import Enum
from typing import Tuple

from ..util.problem_solver import problem_solver, write_lines
from .part1 import Direction, Position


class InputEntity(Enum):
    ROBOT = "@"
    WALL = "#"
    BOX = "O"
    FREE = "."


class Entity(Enum):
    ROBOT = "@"
    WALL = "#"
    FREE = "."
    BOX_LEFT = "["
    BOX_RIGHT = "]"


class Warehouse:
    robot: Position
    overview: list[list[Entity]]

    def __init__(self):
        self.overview = []

    def _get(self, pos: Position) -> Entity:
        return self.overview[pos.y][pos.x]

    def _swap(self, a: Position, b: Position):
        temp = self.overview[a.y][a.x]
        self.overview[a.y][a.x] = self.overview[b.y][b.x]
        self.overview[b.y][b.x] = temp

    def move_robot(self, direction: Direction) -> None:
        new_pos = self.robot.offset(direction)
        front_entity = self._get(new_pos)
        if front_entity == Entity.WALL:
            return
        if front_entity == Entity.FREE:
            self._swap(self.robot, new_pos)
            self.robot = new_pos
            return

        to_check_queue = [new_pos]
        to_move_stack = [self.robot]
        while to_check_queue:
            curr_pos = to_check_queue.pop(0)
            curr_entity = self._get(curr_pos)
            if curr_entity == Entity.WALL:
                return
            if curr_entity == Entity.BOX_LEFT:
                to_move_stack.append(curr_pos)
                if direction in [Direction.UP, Direction.DOWN]:
                    right_box = curr_pos.offset(Direction.RIGHT)
                    if right_box not in to_move_stack and right_box not in to_check_queue:
                        to_check_queue.append(right_box)
                to_check_queue.append(curr_pos.offset(direction))
            if curr_entity == Entity.BOX_RIGHT:
                to_move_stack.append(curr_pos)
                if direction in [Direction.UP, Direction.DOWN]:
                    left_box = curr_pos.offset(Direction.LEFT)
                    if left_box not in to_move_stack and left_box not in to_check_queue:
                        to_check_queue.append(left_box)
                to_check_queue.append(curr_pos.offset(direction))

        # if we haven't returned yet, we know its safe to move all the connected boxes one step forward
        for pos in reversed(to_move_stack):
            self._swap(pos, pos.offset(direction))
        self.robot = new_pos

    def sum_gps_coordinates(self) -> int:
        sum = 0
        for y, row in enumerate(self.overview):
            for x, entity in enumerate(row):
                if entity != Entity.BOX_LEFT:
                    continue
                sum += x + (100 * y)
        return sum

    def write(self):
        write_lines(day=15, output_nr=2, lines=[str(self)], sleep=0)

    def __str__(self):
        return "\n".join(["".join([entity.value for entity in row]) for row in self.overview])


def parse_lines(lines: list[str]) -> Tuple[Warehouse, list[Direction]]:
    warehouse = Warehouse()
    i = 0
    while lines[i] != "":
        line = lines[i]
        chars = list(line)
        input_row = [InputEntity(char) for char in chars]
        row = []
        for entity in input_row:
            match entity:
                case InputEntity.WALL:
                    row.extend([Entity.WALL, Entity.WALL])
                case InputEntity.FREE:
                    row.extend([Entity.FREE, Entity.FREE])
                case InputEntity.ROBOT:
                    row.extend([Entity.ROBOT, Entity.FREE])
                case InputEntity.BOX:
                    row.extend([Entity.BOX_LEFT, Entity.BOX_RIGHT])
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
        warehouse.write()
        warehouse.move_robot(direction)
    return warehouse.sum_gps_coordinates()


if __name__ == "__main__":
    problem_solver(
        day=15,
        solver=solver,
        sample_answer=9021,
    )
