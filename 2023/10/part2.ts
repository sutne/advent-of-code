import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

// for prettier output
const charMap: Record<string, string> = {
    '.': ' ',
    '-': '━',
    '|': '┃',
    '7': '┓',
    L: '┗',
    J: '┛',
    F: '┏',
    S: '╬',
}
type Pipe = '━' | '┃' | '┓' | '┗' | '┛' | '┏'

enum Direction {
    NORTH,
    EAST,
    SOUTH,
    WEST,
}
const oppsite: Record<Direction, Direction> = {
    [Direction.NORTH]: Direction.SOUTH,
    [Direction.EAST]: Direction.WEST,
    [Direction.SOUTH]: Direction.NORTH,
    [Direction.WEST]: Direction.EAST,
}
const pipeDirections: Record<Pipe, [Direction, Direction]> = {
    '━': [Direction.EAST, Direction.WEST],
    '┗': [Direction.NORTH, Direction.EAST],
    '┛': [Direction.NORTH, Direction.WEST],
    '┃': [Direction.NORTH, Direction.SOUTH],
    '┓': [Direction.WEST, Direction.SOUTH],
    '┏': [Direction.EAST, Direction.SOUTH],
}
type Position = {
    x: number
    y: number
}

/** Move 1 tile in `direction` from `from` position and return new position  */
function move(from: Position, direction: Direction): Position {
    switch (direction) {
        case Direction.NORTH:
            return { ...from, y: from.y - 1 }
        case Direction.EAST:
            return { ...from, x: from.x + 1 }
        case Direction.SOUTH:
            return { ...from, y: from.y + 1 }
        case Direction.WEST:
            return { ...from, x: from.x - 1 }
    }
}

class Map {
    pipes: Pipe[][]
    start: Position
    isMainPipe: boolean[][]
    isInside: boolean[][]

    constructor(input: string[]) {
        this.pipes = []
        input.forEach((line, y) => {
            const startX = line.indexOf('S')
            if (startX !== -1) this.start = { x: startX, y }

            const lineSymbols = line.split('').map((char) => charMap[char])
            this.pipes.push(
                lineSymbols.map((symbol) => {
                    if (Object.keys(pipeDirections).includes(symbol)) {
                        return symbol as Pipe
                    } else {
                        return undefined
                    }
                })
            )
        })
        const startDirections = []
        for (const direction of [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST]) {
            const position = move(this.start, direction)
            const pipe = this.pipes[position.y]?.[position.x]
            if (pipeDirections[pipe]?.includes(oppsite[direction])) {
                startDirections.push(direction)
            }
        }
        const startPipe = Object.entries(pipeDirections).find(([pipe, directions]) =>
            startDirections.every((startDir) => directions.includes(startDir))
        )
        this.pipes[this.start.y][this.start.x] = startPipe[0] as Pipe
    }

    /** follow pipe-loop from start and return final length of the main pipe */
    traceMainPipe(): number {
        this.isMainPipe = Array(this.pipes.length)
            .fill(null)
            .map((_) => Array(this.pipes[0].length).fill(false))

        const setVisited = (pos: Position) => (this.isMainPipe[pos.y][pos.x] = true)
        const isVisited = (pos: Position) => this.isMainPipe[pos.y][pos.x]

        setVisited(this.start)
        const queue: Position[] = [this.start]
        let stepCount = 0
        while (queue.length > 0) {
            const position = queue.pop()
            setVisited(position)
            stepCount++
            for (const direction of pipeDirections[this.pipes[position.y][position.x]]) {
                const newPosition = move(position, direction)
                if (isVisited(newPosition)) continue
                queue.push(newPosition)
            }
        }
        return stepCount - 1 // original start doesn't count
    }

    findMainPipeFillCount(): number {
        this.isInside = Array(this.pipes.length)
            .fill(null)
            .map((_) => Array(this.pipes[0].length).fill(false))

        let prevCorner: Pipe
        let insideCount = 0
        for (let y = 0; y < this.pipes.length; y++) {
            let currentlyInside = false
            for (let x = 0; x < this.pipes[0].length; x++) {
                const isPipe = this.isMainPipe[y][x]
                if (!isPipe) {
                    if (currentlyInside) {
                        insideCount++
                        this.isInside[y][x] = true
                    }
                    continue
                }
                const pipe = this.pipes[y][x]
                switch (pipe) {
                    case '━':
                        break
                    case '┃':
                        currentlyInside = !currentlyInside
                        prevCorner = undefined
                        break
                    case '┛':
                        if (prevCorner === '┏') currentlyInside = !currentlyInside
                        prevCorner = undefined
                        break
                    case '┓':
                        if (prevCorner === '┗') currentlyInside = !currentlyInside
                        prevCorner = undefined
                        break
                    case '┏':
                        prevCorner = '┏'
                        break
                    case '┗':
                        prevCorner = '┗'
                        break
                }
            }
        }
        return insideCount
    }

    /**
     * Write prettified pipe to file, excluding parts not part of the main pipe, and showing "O" for bits outside the
     * loop, and "I" for bits inside the loop.
     */
    writeToFile() {
        const output: string[] = []
        for (let y = 0; y < this.pipes.length; y++) {
            const row = []
            for (let x = 0; x < this.pipes[0].length; x++) {
                if (this.isMainPipe[y][x]) {
                    row.push(this.pipes[y][x])
                } else if (this.isInside[y][x]) {
                    row.push('I')
                } else {
                    row.push('O')
                }
            }
            output.push(row.join(''))
        }
        writeOutput({ day: 10, part: 2, output })
    }
}

function solver(input: string[]): number {
    const map = new Map(input)
    map.traceMainPipe()
    const answer = map.findMainPipeFillCount()
    map.writeToFile()
    return answer
}

solveCalendar({
    day: 10,
    sampleNr: 2,
    sampleAnswer: 10,
    solver, // 423 ⭐️
})
