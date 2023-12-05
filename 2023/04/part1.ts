import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

type Card = {
    id: number
    winningNumbers: number[]
    myNumbers: number[]
}

/** Split on any number of spaces */
function splitSpaces(str: string): string[] {
    return str.split(/\s+/)
}

/** return all numbers from str */
function parseNumbers(str: string): number[] {
    return splitSpaces(str.trim()).map((value) => Number(value))
}

/** Read cardnumber, winning, and drawn numbers */
function parseCard(line: string): Card {
    const [cardInfo, allNumbers] = line.split(':')
    const [winningNumbersString, myNumbersString] = allNumbers.split('|')
    return {
        id: Number(splitSpaces(cardInfo)[1]),
        winningNumbers: parseNumbers(winningNumbersString),
        myNumbers: parseNumbers(myNumbersString),
    }
}

function solver(input: string[]): number {
    const output: string[] = []

    const cards = input.map(parseCard)

    let totalScore = 0
    for (const card of cards) {
        const winningNumbers = card.myNumbers.filter((num) => card.winningNumbers.includes(num))
        const cardScore = !winningNumbers.length ? 0 : Math.pow(2, winningNumbers.length - 1)

        output.push(`${input[card.id - 1]} - ${winningNumbers.join(' ')}${cardScore > 0 ? ` : ${cardScore}` : ''}`)
        totalScore += cardScore
    }

    writeOutput({ day: 4, part: 1, output })
    return totalScore
}

solveCalendar({
    day: 4,
    sampleAnswer: 13,
    solver, // 25174 ⭐️
})
