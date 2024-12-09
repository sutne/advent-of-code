from ..util.problem_solver import problem_solver


def solver(lines: list[str]) -> int:
    disc: list[int] = [int(char) for char in list(lines[0])]
    expanded = expand(disc)
    reordered = reorder(expanded)
    return checksum(reordered)


def expand(disc: list[int]) -> list[int | None]:
    expanded: list[int | None] = []
    id_count = 0
    for i, num in enumerate(disc):
        if i % 2 == 0:
            expanded.extend([id_count] * num)
            id_count += 1
        else:
            expanded.extend([None] * num)
    return expanded


def reorder(expanded_disc: list[int | None]) -> list[int | None]:
    ordered_disc = [val for val in expanded_disc]
    i, j = 0, len(ordered_disc) - 1
    while i < j:
        if ordered_disc[i] is not None:
            i += 1
            continue
        if ordered_disc[j] is None:
            j -= 1
            continue
        ordered_disc[i] = ordered_disc[j]
        ordered_disc[j] = None
        i += 1
        j -= 1
    return ordered_disc


def checksum(ordered_disc: list[int | None]) -> int:
    checksum = 0
    for i, num in enumerate(ordered_disc):
        if num is None:
            continue
        checksum += i * num
    return checksum


if __name__ == "__main__":
    problem_solver(
        day=9,
        solver=solver,
        sample_answer=1928,
    )
