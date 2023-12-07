import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

type Card = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'
const cardValue: Record<Card, number> = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2,
}

enum Type {
    FiveOfAKind = 6,
    FourOfAKind = 5,
    FullHouse = 4,
    ThreeOfAKind = 3,
    TwoPair = 2,
    OnePair = 1,
    HighCard = 0,
}

type Hand = {
    cards: [Card, Card, Card, Card, Card]
    type: Type
    bid: number
}

function findHandType(cards: Card[]): Type {
    const cardCounts: Partial<Record<Card, number>> = {}
    for (const card of cards) {
        cardCounts[card] ? (cardCounts[card] += 1) : (cardCounts[card] = 1)
    }
    const counts = Object.values(cardCounts)

    if (counts.some((count) => count === 5)) return Type.FiveOfAKind
    if (counts.some((count) => count === 4)) return Type.FourOfAKind
    if (counts.length === 2) return Type.FullHouse
    if (counts.some((count) => count === 3)) return Type.ThreeOfAKind
    if (counts.filter((count) => count === 2).length === 2) return Type.TwoPair
    if (counts.some((count) => count === 2)) return Type.OnePair
    return Type.HighCard
}

function compareHands(a: Hand, b: Hand): number {
    let diff = b.type - a.type
    if (diff !== 0) return diff
    for (let i = 0; i < 5; i++) {
        diff = cardValue[b.cards[i]] - cardValue[a.cards[i]]
        if (diff !== 0) break
    }
    return diff
}

function parseHands(input: string[]): Hand[] {
    return input.map((line) => {
        const [cardsStr, bidStr] = line.split(' ')
        const cards = cardsStr.split('') as [Card, Card, Card, Card, Card]
        const bid = Number(bidStr)
        const type = findHandType(cards)
        return { cards, bid, type }
    })
}

function solver(input: string[]): number {
    const output: string[] = []
    const hands = parseHands(input)
    hands.sort(compareHands)

    const answer = hands.reduce((ans, hand, i) => {
        const rank = hands.length - i
        output.push(`${rank} \t${hand.cards.join('')} ${Type[hand.type]}`)
        return ans + hand.bid * rank
    }, 0)

    writeOutput({ day: 7, part: 1, output })
    return answer
}

solveCalendar({
    day: 7,
    sampleAnswer: 6440,
    solver, // 253933213 ⭐️
})
