from ..util.problem_solver import problem_solver


def solver(lines: list[str]) -> int:
    left_list: list[int] = []
    right_list: list[int] = []
    for line in lines:
        left, right = line.split()
        left_list.append(int(left))
        right_list.append(int(right))

    similarity_score = 0
    for left in left_list:
        num_right_occurrences = right_list.count(left)
        similarity_score += left * num_right_occurrences
    return similarity_score


if __name__ == "__main__":
    problem_solver(
        day=1,
        solver=solver,
        sample_answer=31,
    )
