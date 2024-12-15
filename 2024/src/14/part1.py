from dataclasses import dataclass
from typing import Tuple

from ..util.problem_solver import problem_solver, write_lines


@dataclass
class Position:
    x: int
    y: int


@dataclass
class Velocity:
    dx: int
    dy: int


@dataclass
class Robot:
    position: Position
    velocity: Velocity


def parse_lines(lines: list[str]) -> list[Robot]:
    robots: list[Robot] = []
    for line in lines:
        p, v = line.split(" ")
        px, py = p.replace("p=", "").split(",")
        vx, vy = v.replace("v=", "").split(",")
        robot = Robot(
            position=Position(int(px), int(py)),
            velocity=Velocity(int(vx), int(vy)),
        )
        robots.append(robot)
    return robots


def solver(lines: list[str]) -> int:
    robots = parse_lines(lines)
    for _ in range(100):
        pass_time(robots)

    write_map(robots)
    a, b, c, d = find_quadrant_counts(robots)
    return a * b * c * d


def pass_time(robots: list[Robot]) -> None:
    for robot in robots:
        robot.position.x = (robot.position.x + robot.velocity.dx) % SPACE_WIDTH
        robot.position.y = (robot.position.y + robot.velocity.dy) % SPACE_HEIGHT


def find_quadrant_counts(robots: list[Robot]) -> Tuple[int, int, int, int]:
    a, b, c, d = 0, 0, 0, 0
    for robot in robots:
        if robot.position.y < SPACE_HEIGHT // 2:
            if robot.position.x < SPACE_WIDTH // 2:
                a += 1
            if robot.position.x > SPACE_WIDTH // 2:
                b += 1
        if robot.position.y > SPACE_HEIGHT // 2:
            if robot.position.x < SPACE_WIDTH // 2:
                c += 1
            if robot.position.x > SPACE_WIDTH // 2:
                d += 1
    return a, b, c, d


def write_map(robots: list[Robot]) -> None:
    overview = [[0] * SPACE_WIDTH for _ in range(SPACE_HEIGHT)]
    for robot in robots:
        overview[robot.position.y][robot.position.x] += 1
    write_lines(
        day=14,
        output_nr=1,
        lines=["".join(["." if count == 0 else str(count) for count in row]) for row in overview],
    )


if __name__ == "__main__":
    # sample
    # SPACE_WIDTH = 11
    # SPACE_HEIGHT = 7
    # problem_solver(day=14, solver=solver, sample_answer=12)

    # input
    SPACE_WIDTH = 101
    SPACE_HEIGHT = 103
    problem_solver(day=14, solver=solver)
