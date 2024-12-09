from ..util.problem_solver import problem_solver
from typing import Tuple
from .part1 import checksum


def solver(lines: list[str]) -> int:
    disc: list[int] = [int(char) for char in list(lines[0])]
    file_locations = expand(disc)
    reordered_files = reorder(file_locations)
    ordered_disc = to_disc(reordered_files)
    return checksum(ordered_disc)


def expand(
    disc: list[int],
) -> list[Tuple[int | None, int, int]]:
    """Returns: list[(id/empty, start_index, count)]"""
    file_locations: list[Tuple[int | None, int, int]] = []
    id_count = 0
    current_length = 0
    for i, num in enumerate(disc):
        if i % 2 == 0:
            file_locations.append((id_count, current_length, num))
            id_count += 1
        else:
            file_locations.append((None, current_length, num))
        current_length += num
    return file_locations


def reorder(
    file_locations: list[Tuple[int | None, int, int]],
) -> list[Tuple[int | None, int, int]]:
    ordered_files = [file_data for file_data in file_locations]
    i = len(file_locations) - 1
    while i >= 0:
        (i_id, i_start, i_count) = ordered_files[i]

        if i_id is None:
            i -= 1
            continue
        for j, (j_id, j_start, j_count) in enumerate(ordered_files):
            if j >= i:
                i -= 1
                break
            if j_id is not None:
                continue
            if j_count < i_count:
                continue

            if j_count == i_count:
                # simply "swap" locations
                ordered_files[j] = (i_id, j_start, j_count)
                ordered_files[i] = (None, i_start, i_count)
                i -= 1
            else:
                # must "split" empty file area (j) after swapping
                ordered_files[j] = (i_id, j_start, i_count)
                ordered_files[i] = (None, i_start, i_count)
                left_over_empty_space_count = j_count - i_count
                ordered_files.insert(j + 1, (None, j_start + i_count, left_over_empty_space_count))
                # dont decrease "i" because of inserted element
            break

    return ordered_files


def to_disc(file_locations: list[Tuple[int | None, int, int]]) -> list[int | None]:
    array: list[int | None] = []
    for id, _, length in file_locations:
        array.extend([id] * length)
    return array


if __name__ == "__main__":
    problem_solver(
        day=9,
        solver=solver,
        sample_answer=2858,
    )
