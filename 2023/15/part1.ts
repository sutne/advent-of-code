import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

type Step = string[]

function parseSteps(input: string[]): Step[] {
    const line = input.join('')
    const steps: Step[] = line.split(',').map((str) => str.split(''))
    return steps
}

function ASCII(char: string) {
    return char.charCodeAt(0)
}

function HASH(step: Step) {
    let currentValue = 0
    for (const char of step) {
        currentValue += ASCII(char)
        currentValue *= 17
        currentValue %= 256
    }
    return currentValue
}

function solver(input: string[]): number {
    const output: string[] = []

    const steps = parseSteps(input)

    let sum = 0
    for (const step of steps) {
        const hash = HASH(step)
        sum += hash
        output.push(`${step.join('').padEnd(8)} - ${hash.toString().padStart(3)}`)
    }

    writeOutput({ day: 15, part: 1, output })
    return sum
}

solveCalendar({
    day: 15,
    sampleAnswer: 1320,
    solver, // 517965 ⭐️
})
