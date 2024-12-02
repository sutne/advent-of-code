from ..util.problem_solver import problem_solver


def solver(lines: list[str]) -> int:
    reports: list[list[int]] = []
    for line in lines:
        levels = [int(level) for level in line.split()]
        reports.append(levels)

    safe_count = 0
    for report in reports:
        if is_safe(report):
            safe_count += 1
    return safe_count


def is_safe(report: list[int]) -> bool:
    for i in range(len(report)):
        sub_report = [level for j, level in enumerate(report) if i != j]
        if _is_sub_safe(sub_report):
            return True
    return False


def _is_sub_safe(report: list[int]) -> bool:
    is_ascending: bool | None = None
    for i in range(len(report) - 1):
        j = i + 1
        level_a = report[i]
        level_b = report[j]
        diff = level_b - level_a
        if diff == 0:
            return False
        if abs(diff) > 3:
            return False
        if is_ascending is None:
            is_ascending = diff > 0
        elif is_ascending != (diff > 0):
            return False
    return True


if __name__ == "__main__":
    problem_solver(
        day=2,
        solver=solver,
        sample_answer=6,
    )
