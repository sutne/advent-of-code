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

// brute force FTL, this took way too long so had to find alternative solution
function bruteForce(input: string[]): number {
    const directions = parseDirections(input[0])
    const nodes = parseNodes(input.slice(2))

    let stepCount = 0
    let myLocations: string[] = Object.keys(nodes).filter((location) => location.endsWith('A'))
    while (!myLocations.every((location) => location.endsWith('Z'))) {
        const direction = directions[stepCount++ % directions.length]
        myLocations = myLocations.map((location) => nodes[location][direction])
    }

    return stepCount
}

// Had to get tip online about the ghost's movements where
// - each ghost movements are looped (makes sense because the directions loops)
// - none of the loops overlap
// - each ghost loop only encounters the goal (z) once
function solver(input: string[]): number {
    const directions = parseDirections(input[0])
    const nodes = parseNodes(input.slice(2))

    let ghosts: string[] = Object.keys(nodes).filter((location) => location.endsWith('A'))
    const cycles: number[] = ghosts.map((location) => {
        let length = 0
        while (!location.endsWith('Z')) {
            const direction = directions[length++ % directions.length]
            location = nodes[location][direction]
        }
        return length
    })

    // I looked these up
    const gcd = (a: number, b: number) => (!b ? a : gcd(b, a % b))
    const lcm = (a: number, b: number) => (a * b) / gcd(a, b)

    return cycles.reduce((l, cycle) => lcm(l, cycle), 1)
}

solveCalendar({
    day: 8,
    sampleNr: 2,
    sampleAnswer: 6,
    solver, // 10 371 555 451 871 ⭐️
})
