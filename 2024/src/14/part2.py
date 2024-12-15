from ..util.problem_solver import get_output_path, problem_solver, write_lines
from .part1 import SPACE_HEIGHT, SPACE_WIDTH, Robot, parse_lines, pass_time

output_path = get_output_path(day=14, output_nr=2)


def solver(lines: list[str]) -> int:
    robots = parse_lines(lines)
    seconds_passed = 0
    while True:
        if might_be_christmas_tree(robots):
            write_map(robots)
            answer = input(f"Does {output_path} contain a christmas tree (y/n)? ")
            if answer == "y":
                break
        pass_time(robots)
        seconds_passed += 1
    return seconds_passed


def might_be_christmas_tree(robots: list[Robot]) -> bool:
    # thought first it might be "symmetrical" across the center vertical (nope)
    # a, b, c, d = find_quadrant_counts(robots)
    # return a == b and c == d

    robot_flags = [[False] * SPACE_WIDTH for _ in range(SPACE_HEIGHT)]
    for robot in robots:
        robot_flags[robot.position.y][robot.position.x] = True

    # check for long horizontal lines (probably bottom of tree)
    for row in robot_flags:
        count = 0
        for has_robot in row:
            if has_robot:
                count += 1
            else:
                count = 0
            if count >= 10:  # success on first match!
                return True
    return False


def write_map(robots: list[Robot]) -> None:
    overview = [[0] * SPACE_WIDTH for _ in range(SPACE_HEIGHT)]
    for robot in robots:
        overview[robot.position.y][robot.position.x] += 1
    write_lines(
        day=14,
        output_nr=2,
        lines=["".join(["█" if count > 0 else "░" for count in row]) for row in overview],
    )


if __name__ == "__main__":
    problem_solver(
        day=14,
        solver=solver,
    )
