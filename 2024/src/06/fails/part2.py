from src.util.problem_solver import problem_solver
from ..part1 import turn, parse_lines, find_guard_pos, Direction, free, obstacle, visited


# reframed question: while the guard is walking along their route, how
# many times would turning cause the guard to hit an obstacle the same
# way they have before
# (or turn in direcion where guard retraces their own steps)


# doesn't work, as guard could end up retracing their steps after making the first turn
def solver(lines: list[str]) -> int:
    floor_map = parse_lines(lines)
    max_x, max_y = len(floor_map[0]) - 1, len(floor_map) - 1

    guard_x, guard_y, guard_direction = find_guard_pos(floor_map)

    guard_steps: list[list[list[Direction]]] = []
    for y in range(max_y + 1):
        guard_steps.append([])
        for _ in range(max_x + 1):
            guard_steps[y].append([])

    count = 0
    while True:
        # to animeate the movement in the output file
        # write_map(floor_map)
        # time.sleep(0.1)
        guard_steps[guard_y][guard_x].append(guard_direction)

        dx, dy = guard_direction.value
        front_x, front_y = guard_x + dx, guard_y + dy

        turn_direction = turn(guard_direction)
        turn_dx, turn_dy = turn_direction.value
        trace_x, trace_y = guard_x + turn_dx, guard_y + turn_dy
        while 0 <= trace_x <= max_x and 0 <= trace_y <= max_y:
            if floor_map[trace_y][trace_x] == obstacle:
                previous_trace_directions = guard_steps[trace_y - turn_dy][trace_x - turn_dx]
                if (
                    turn_direction in previous_trace_directions
                    or turn(turn_direction) in previous_trace_directions
                ):
                    count += 1
                break
            trace_x, trace_y = trace_x + turn_dx, trace_y + turn_dy

        if front_x < 0 or max_x < front_x or front_y < 0 or max_y < front_y:
            floor_map[guard_y][guard_x] = visited
            break

        if floor_map[front_y][front_x] in [free, visited]:
            floor_map[guard_y][guard_x] = visited
            guard_x, guard_y = front_x, front_y
            continue

        guard_direction = turn(guard_direction)

    return count


if __name__ == "__main__":
    problem_solver(
        day=6,
        solver=solver,
        sample_answer=6,
    )
