import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

function parseSequences(input: string[]): number[][] {
    return input.map((line) => line.split(' ').map((value) => Number(value)))
}

/** Return array of difference between each entry in `sequence` */
function findDifferences(sequence: number[]): number[] {
    const differences: number[] = []
    for (let i = 1; i < sequence.length; i++) {
        differences.push(sequence[i] - sequence[i - 1])
    }
    return differences
}

function solver(input: string[]): number {
    const output: string[] = []

    const sequences = parseSequences(input)
    const answer = sequences.reduce((sum, sequence) => {
        // find all subsequences (differences) until final sequence has all diffs = 0
        const subsequences = [sequence]
        while (!subsequences.at(-1).every((value) => value === 0)) {
            subsequences.push(findDifferences(subsequences.at(-1)))
        }

        // propegate diff in reverse from bottom to find prediction
        const prediction = subsequences.reverse().reduce((prediction, diff) => diff[0] - prediction, 0)

        output.push(`${prediction} <- ${sequence.join(' ')}`)
        return sum + prediction
    }, 0)

    writeOutput({ day: 9, part: 2, output })
    return answer
}

solveCalendar({
    day: 9,
    sampleAnswer: 2,
    solver, // 995 ⭐️
})
