from ..util.problem_solver import problem_solver


def solver(lines: list[str]) -> int:
    left_list: list[int] = []
    right_list: list[int] = []
    for line in lines:
        left, right = line.split()
        left_list.append(int(left))
        right_list.append(int(right))

    left_list.sort()
    right_list.sort()

    sum = 0
    for left, right in zip(left_list, right_list):
        sum += abs(left - right)
    return sum


if __name__ == "__main__":
    problem_solver(
        day=1,
        solver=solver,
        sample_answer=11,
    )
