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

function isNumber(char: string) {
    return /[0-9]/.test(char)
}

function isSymbol(char: string) {
    if (!char || isNumber(char)) return false
    return char !== '.'
}

/**
 * Find all partnumbers from line wether they are valid or not and keep track
 * of their start and end index within the line
 */
function parseLineNumbers(line: string): LineNumber[] {
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
 * Only return line numbers that have a symbol as neighbor:
 * .............
 * ....XXXXX....
 * ....X123X....
 * ....XXXXX....
 * .............
 */
function findPartNumbers(input: string[], lineIndex: number, lineNumbers: LineNumber[]): LineNumber[] {
    return lineNumbers.filter((part) => {
        let neighborChars: string[] = []

        const start = Math.max(0, part.start - 1)
        const end = Math.min(input[lineIndex].length - 1, part.end + 1)

        // previous line
        const previousLineSection = input[lineIndex - 1]?.substring(start, end + 1)
        neighborChars = neighborChars.concat(previousLineSection?.split(''))
        // current line
        neighborChars.push(input[lineIndex].charAt(start))
        neighborChars.push(input[lineIndex].charAt(end))
        // next line
        const nextLineSection = input[lineIndex + 1]?.substring(start, end + 1)
        neighborChars = neighborChars.concat(nextLineSection?.split(''))

        return neighborChars.some(isSymbol)
    })
}

function solver(input: string[]): number {
    const output: string[] = []

    let answer = 0
    for (let i = 0; i < input.length; i++) {
        const line = input[i]
        const lineNumbers = parseLineNumbers(line)
        const partNumbers = findPartNumbers(input, i, lineNumbers)

        output.push(line + ' - ' + partNumbers.map((part) => part.value).join(' '))
        answer += partNumbers.reduce((newSum, part) => newSum + part.value, 0)
    }

    writeOutput({ day: 3, part: 1, output })
    return answer
}

solveCalendar({
    day: 3,
    sampleAnswer: 4361,
    solver, // 559667 ⭐️
})
