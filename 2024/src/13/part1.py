from dataclasses import dataclass
from enum import Enum
from typing import Tuple

from ..util.problem_solver import problem_solver


class Button(Enum):
    A = 3
    B = 1


@dataclass
class Location:
    x: int
    y: int


@dataclass
class Move:
    dx: int
    dy: int


class Machine:
    prize: Location
    buttons: dict[Button, Move]

    def __init__(self):
        self.buttons = {}

    def __str__(self) -> str:
        buttons = "\n".join([f"{button}: {move}" for button, move in self.buttons.items()])
        return f"{buttons}\nPrize: {self.prize}"


def parse_lines(lines: list[str]) -> list[Machine]:
    machines = []
    curr_machine: Machine = Machine()
    for line in lines:
        if line == "":
            machines.append(curr_machine)
            curr_machine = Machine()
            continue
        if line.startswith("Button"):
            button_str, move_str = line.split(": ")
            move_x_str, move_y_str = move_str.split(", ")
            button = Button[button_str.replace("Button ", "")]
            x_len = int(move_x_str.replace("X", ""))
            y_len = int(move_y_str.replace("Y", ""))
            curr_machine.buttons[button] = Move(x_len, y_len)
            continue
        if line.startswith("Prize"):
            loc_str = line.split(": ")[1]
            loc_x_str, loc_y_str = loc_str.split(", ")
            x_loc = int(loc_x_str.replace("X=", ""))
            y_loc = int(loc_y_str.replace("Y=", ""))
            curr_machine.prize = Location(x_loc, y_loc)

    if curr_machine.prize is not None:
        machines.append(curr_machine)
    return machines


def solver(lines: list[str]) -> int:
    machines = parse_lines(lines)
    total_token_count = 0
    for machine in machines:
        machine_min_cost = find_solution(machine)
        if machine_min_cost is None:
            continue
        total_token_count += machine_min_cost
    return total_token_count


def find_solution(machine: Machine) -> None | int:
    result = solve(
        X=machine.prize.x,
        Y=machine.prize.y,
        dx_a=machine.buttons[Button.A].dx,
        dy_a=machine.buttons[Button.A].dy,
        dx_b=machine.buttons[Button.B].dx,
        dy_b=machine.buttons[Button.B].dy,
    )
    if result is None:
        return None
    A, B = result
    return A * Button.A.value + B * Button.B.value


def solve(X: int, Y: int, dx_a: int, dy_a: int, dx_b: int, dy_b: int) -> None | Tuple[int, int]:
    """Handle it as a equation set with two variables (two linear lines that cross once).

    If the A and B are both ints when these lines cross, then thats the answer, otherwise its not possible"""
    A = -(X * dy_b - dx_b * Y) / (dx_b * dy_a - dx_a * dy_b)  # "cheated" with wolframalpha
    B = -(dx_a * Y - X * dy_a) / (dx_b * dy_a - dx_a * dy_b)
    if not A.is_integer() or not B.is_integer():
        return None
    return int(A), int(B)


if __name__ == "__main__":
    problem_solver(
        day=13,
        solver=solver,
        sample_answer=480,
    )
