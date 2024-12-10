#!/bin/bash
if [ -z "$1" ]; then
    echo "Usage: $0 <day-number>"
    exit 1
fi
DAY=$1

# Create folder structure
DAY_DIR="src/$(printf "%02d" $DAY)"
DATA_DIR="$DAY_DIR/data"
mkdir -p $DATA_DIR

# init files
touch "$DAY_DIR/part2.py"
touch "$DATA_DIR/sample.txt"
# init part1.py with boilerplate
PART_1_FILE="$DAY_DIR/part1.py"
if [ -f "$PART_1_FILE" ]; then
    echo "$PART_1_FILE already exists"
else
    cat >"$PART_1_FILE" <<EOF
from ..util.problem_solver import problem_solver


def solver(lines: list[str]) -> int:
    return 0


if __name__ == "__main__":
    problem_solver(
        day=$DAY,
        solver=solver,
        sample_answer=,
    )
EOF
fi

echo "Initialized day $DAY, run with:"
echo "python -m src.$(printf "%02d" $DAY).part1"
