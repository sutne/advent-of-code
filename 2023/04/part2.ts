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

/** Recursively find winners */
function findTotalWinnerCount(card: Card, allCards: Card[], currentCount = 0): number {
    const winCount = card.myNumbers.filter((num) => card.winningNumbers.includes(num)).length
    const wonCards = allCards.slice(card.id, card.id + winCount) // id is index + 1!

    return wonCards.reduce(
        (newCount, wonCard) => newCount + findTotalWinnerCount(wonCard, allCards, currentCount),
        winCount + currentCount,
    )
}

function solver(input: string[]): number {
    const output: string[] = []

    const cards = input.map(parseCard)

    let totalScratchCards = 0
    for (const card of cards) {
        const wonCardCount = findTotalWinnerCount(card, cards)
        totalScratchCards += 1 + wonCardCount
        output.push(`${input[card.id - 1]} - 1+${wonCardCount}`)
    }

    writeOutput({ day: 4, part: 2, output })
    return totalScratchCards
}

solveCalendar({
    day: 4,
    sampleAnswer: 30,
    solver, // 6420979 ⭐️
})
