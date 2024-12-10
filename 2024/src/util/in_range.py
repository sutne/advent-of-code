from typing import Any


def in_range(x: int, start: int, end: int) -> bool:
    """inclusive start, exclusive end"""
    return start <= x and x < end


def in_bounds(i: int, j: int, arr: list[list[Any]]) -> bool:
    return in_range(i, 0, len(arr)) and in_range(j, 0, len(arr[i]))
