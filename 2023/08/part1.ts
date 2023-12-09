import { solveCalendar } from '../util/solveCalendar'

type Direction = 'L' | 'R'
type Node = {
    L: string
    R: string
}

function parseDirections(str: string): Direction[] {
    return str.split('') as Direction[]
}

function parseNodes(lines: string[]): Record<string, Node> {
    return lines.reduce((nodes, line) => {
        const [location, childrenStr] = line.replace(/\(|\)/g, '').split(' = ')
        const [L, R] = childrenStr.split(', ')
        nodes[location] = { L, R }
        return nodes
    }, {})
}

function solver(input: string[]): number {
    const directions = parseDirections(input[0])
    const nodes = parseNodes(input.slice(2))

    let stepCount = 0
    let myLocation = 'AAA'
    while (myLocation !== 'ZZZ') {
        const direction = directions[stepCount++ % directions.length]
        myLocation = nodes[myLocation][direction]
    }

    return stepCount
}

solveCalendar({
    day: 8,
    sampleNr: 1,
    sampleAnswer: 6,
    solver, // 22357 ⭐️
})
