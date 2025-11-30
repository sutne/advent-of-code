#!/bin/bash
if [ -z "$1" ]; then
    echo "Usage: $0 <day-number>"
    exit 1
fi
DAY=$1

ORANGE='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'

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
    echo -e "${ORANGE}$PART_1_FILE already exists${NC}"
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


echo -e "\nInitialized day ${ORANGE}$DAY${NC}, run with:"
echo -e "${GREEN}python -m src.$(printf "%02d" $DAY).part1${NC}\n"

fi

