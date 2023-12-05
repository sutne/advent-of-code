import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

/** Data for all numbers on a line */
type LineNumber = {
    /** start index of number within line */
    start: number
    /** end index (inclusive) of number within line */
    end: number
    /** numeric value */
    value: number
}

/** Data for all numbers on a line */
type Gear = {
    part1: number
    part2: number
}

function isNumber(char: string) {
    return /[0-9]/.test(char)
}

function isGear(char: string) {
    return char === '*'
}

/**
 * Find all partnumbers from line wether they are valid or not and keep track
 * of their start and end index within the line
 */
function parseLineNumbers(line: string): LineNumber[] {
    if (!line) return []

    const lineNumbers: LineNumber[] = []
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
        if (!isNumber(line.charAt(charIndex))) continue

        const numberStart = charIndex
        // keep incrementing charIndex while next character is a number
        while (isNumber(line.charAt(charIndex + 1))) charIndex++

        lineNumbers.push({
            start: numberStart,
            end: charIndex,
            value: Number(line.substring(numberStart, charIndex + 1)),
        })
    }
    return lineNumbers
}

/**
 * Find all partnumbers from line wether they are valid or not and keep track
 * of their start and end index within the line
 */
function parsePossibleGearIndices(line: string): number[] {
    const possibleGearIndices: number[] = []
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
        if (isGear(line.charAt(charIndex))) possibleGearIndices.push(charIndex)
    }
    return possibleGearIndices
}

/**
 * Return gears that have two connected parts
 */
function findGears(input: string[], lineIndex: number, possibleGearIndices: number[]): Gear[] {
    const gears: Gear[] = []

    // find all numbers that could be connected to the gears
    const possibleLineNumbers: LineNumber[] = [
        ...parseLineNumbers(input[lineIndex - 1]),
        ...parseLineNumbers(input[lineIndex]),
        ...parseLineNumbers(input[lineIndex + 1]),
    ]

    possibleGearIndices.forEach((gearIndex) => {
        const numbersConnectedToGear = possibleLineNumbers.filter((lineNumber) => {
            return lineNumber.start - 1 <= gearIndex && gearIndex <= lineNumber.end + 1
        })
        if (numbersConnectedToGear.length == 2) {
            gears.push({
                part1: numbersConnectedToGear[0].value,
                part2: numbersConnectedToGear[1].value,
            })
        }
    })
    return gears
}

function solver(input: string[]): number {
    const output: string[] = []

    const answer = input.reduce((sum, line, i) => {
        const possibleGearIndices = parsePossibleGearIndices(line)
        const gears = findGears(input, i, possibleGearIndices)
        const ratioSum = gears.reduce((sum, gear) => sum + gear.part1 * gear.part2, 0)

        output.push(line + ' - ' + gears.map((gear) => `${gear.part1}*${gear.part2}`).join(' '))
        return sum + ratioSum
    }, 0)

    writeOutput({ day: 3, part: 2, output })
    return answer
}

solveCalendar({
    day: 3,
    sampleAnswer: 467835,
    solver, // 86841457 ⭐️
})
