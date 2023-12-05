import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

function solver(input: string[]) {
    const output: string[] = []

    const answer = input.reduce((sum, line) => {
        const numbers = line.split('').filter((char) => /[1-9]/.test(char))
        const first = numbers[0]
        const last = numbers[numbers.length - 1]

        output.push(first + last + ' - ' + line)
        return sum + Number(first + last)
    }, 0)

    writeOutput({ day: 1, part: 1, output })
    return answer
}

solveCalendar({
    day: 1,
    sampleNr: 1,
    sampleAnswer: 142,
    solver, // 54634 ⭐️
})
