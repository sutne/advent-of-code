import os
import time
from typing import Callable


def problem_solver(
    *,
    day: int,
    solver: Callable[[list[str]], int],
    sample_answer: int | None = None,
    input_nr: int | None = None,
    sample_nr: int | None = None,
):
    input_path = _get_input_path(day, input_nr)
    if not os.path.isfile(input_path):
        print("\n📂 No input file!\n")
        exit(1)

    if sample_answer is not None:
        sample_path = _get_sample_path(day, sample_nr)
        if not os.path.isfile(sample_path):
            print("\n📂 No sample file!\n")
            exit(1)
        sample_input = _read_lines(sample_path)
        solved_sample_answer = solver(sample_input)
        if solved_sample_answer != sample_answer:
            error = f"\n❌ Wrong sample answer '{solved_sample_answer}'"
            if solved_sample_answer < sample_answer:
                error += ", too low ↗️"
            if solved_sample_answer > sample_answer:
                error += ", too high ↘️"
            print(error + "\n")
            return
        print("\n✅ Sample Solved! solving full input...")

    # Solve full input and print answer
    input = _read_lines(input_path)
    start_time = time.perf_counter_ns()
    answer = solver(input)
    end_time = time.perf_counter_ns()
    print(f"\n{answer} ⭐️ in {_get_elapsed(start_time, end_time)} \n")


def _get_sample_path(day: int, sample_nr: int | None):
    return f"{_get_data_folder(day)}/sample{'' if sample_nr is None else f'-{sample_nr}'}.txt"


def get_output_path(day: int, output_nr: int | None):
    return f"{_get_data_folder(day)}/output{'' if output_nr is None else f'-{output_nr}'}.txt"


def _get_input_path(day: int, input_nr: int | None):
    return f"{_get_data_folder(day)}/input{'' if input_nr is None else f'-{input_nr}'}.txt"


def _get_data_folder(day: int) -> str:
    return f"src/{f"0{day}" if day < 10 else str(day)}/data"


def _read_lines(path: str) -> list[str]:
    with open(path, "r") as f:
        return f.read().splitlines()


def _get_elapsed(start_ns: int, end_ns: int) -> str:
    elapsed_ns = end_ns - start_ns
    elapsed_ms = elapsed_ns // 1_000_000
    elapsed_s = elapsed_ms // 1_000

    minutes, seconds = divmod(elapsed_s, 60)
    if minutes > 0:
        return f"{minutes} minutes {seconds} seconds"
    elif seconds > 0:
        return f"{seconds} seconds"
    else:
        return f"{elapsed_ms} ms"


def write_lines(
    *,
    day: int,
    lines: list[str],
    output_nr: int | None = None,
    sleep: float | None = None,
    append: bool = False,
):
    output_path = get_output_path(day, output_nr)
    with open(output_path, "a" if append else "w") as f:
        for line in lines:
            f.write(f"{line}\n")
    if sleep is not None:
        time.sleep(sleep)
