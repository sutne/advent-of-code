import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

const digits = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
}

type Occurrence = {
    index: number
    digit: string
}

function solver(input: string[]): number {
    const output: string[] = []

    const answer = input.reduce((sum, line) => {
        const occurrences: Occurrence[] = []
        for (let i = 0; i < line.length; i++) {
            const char = line.charAt(i)
            const remainingString = line.substring(i)

            // check if index is number
            if (/[1-9]/.test(char)) {
                occurrences.push({ index: i, digit: char })
                continue
            }

            // check if index is start of any digit-string
            for (const [digitString, digit] of Object.entries(digits)) {
                if (remainingString.startsWith(digitString)) {
                    occurrences.push({ index: i, digit: digit })
                    break
                }
            }
        }
        // sort to find first and last number
        const sorted = occurrences.sort((a, b) => a.index - b.index)
        const first = sorted[0].digit
        const last = sorted[occurrences.length - 1].digit

        output.push(first + last + ' - ' + line)
        return sum + Number(first + last)
    }, 0)

    writeOutput({ day: 1, part: 2, output })
    return answer
}

solveCalendar({
    day: 1,
    sampleNr: 2,
    sampleAnswer: 281,
    solver, // 53855 ⭐️
})
