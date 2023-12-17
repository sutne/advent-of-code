import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}
const directionMap: Record<Direction, string> = {
    [Direction.UP]: '⇧',
    [Direction.DOWN]: '⇩',
    [Direction.LEFT]: '⇦',
    [Direction.RIGHT]: '⇨',
}

type TileChar = '/' | '\\' | '|' | '-' | ' '
const LEAN_RIGHT = '/'
const LEAN_LEFT = '\\'
const VERTICAL = '|'
const HORIZONTAL = '-'
const EMPTY = ' '
const charMap: Record<string, TileChar> = {
    '/': LEAN_RIGHT,
    '\\': LEAN_LEFT,
    '|': VERTICAL,
    '-': HORIZONTAL,
    '.': EMPTY,
}

type Position = {
    x: number
    y: number
}

class Beam {
    position: Position
    direction: Direction

    constructor(position: Position, direction: Direction) {
        this.position = position
        this.direction = direction
    }

    /** Move one step forward in beams current direction */
    step() {
        if (this.direction === Direction.UP) this.position.y -= 1
        if (this.direction === Direction.DOWN) this.position.y += 1
        if (this.direction === Direction.LEFT) this.position.x -= 1
        if (this.direction === Direction.RIGHT) this.position.x += 1
    }
}

class Tile {
    char: TileChar
    checkedDirections: Direction[]

    constructor(char: TileChar) {
        this.char = char
        this.checkedDirections = []
    }

    isEnergized() {
        return this.checkedDirections.length > 0
    }

    getExitDirections(entry: Direction): Direction[] {
        switch (this.char) {
            case EMPTY:
                return [entry]
            case LEAN_LEFT:
                if (entry === Direction.UP) return [Direction.LEFT]
                if (entry === Direction.DOWN) return [Direction.RIGHT]
                if (entry === Direction.LEFT) return [Direction.UP]
                if (entry === Direction.RIGHT) return [Direction.DOWN]
            case LEAN_RIGHT:
                if (entry === Direction.UP) return [Direction.RIGHT]
                if (entry === Direction.DOWN) return [Direction.LEFT]
                if (entry === Direction.LEFT) return [Direction.DOWN]
                if (entry === Direction.RIGHT) return [Direction.UP]
            case VERTICAL:
                if (entry === Direction.UP || entry === Direction.DOWN) return [entry]
                if (entry === Direction.LEFT || entry === Direction.RIGHT) return [Direction.UP, Direction.DOWN]
            case HORIZONTAL:
                if (entry === Direction.UP || entry === Direction.DOWN) return [Direction.LEFT, Direction.RIGHT]
                if (entry === Direction.LEFT || entry === Direction.RIGHT) return [entry]
        }
    }

    hasCheckedDirection(direction: Direction): boolean {
        return this.checkedDirections.includes(direction)
    }

    toString() {
        if (this.char !== EMPTY) return this.char
        if (this.checkedDirections.length > 1) return this.checkedDirections.length
        if (this.checkedDirections.length === 1) return directionMap[this.checkedDirections[0]]
        return EMPTY
    }
}

class Grid {
    tiles: Tile[][]

    constructor(input: string[]) {
        this.tiles = []
        input.forEach((line) => this.tiles.push(line.split('').map((char) => new Tile(charMap[char]))))
    }

    isPositionInside(position: Position): boolean {
        if (position.y < 0 || this.tiles.length - 1 < position.y) return false
        if (position.x < 0 || this.tiles[position.y].length - 1 < position.x) return false
        return true
    }

    // Trace beams path, splitting and redirecting until all paths have been checked
    // Returning the number of tiles that were energized by this path
    async traceBeam(start: Beam, animate = false): Promise<number> {
        this.tiles = [...this.tiles.map((row) => [...row.map((tile) => new Tile(tile.char))])] // copy to not cross-contaminate traces

        const beams: Beam[] = [start]
        while (beams.length > 0) {
            if (animate) {
                writeOutput({
                    day: 16,
                    part: 2,
                    output: [this.toString()],
                })
                await new Promise((res) => setTimeout(res, 200))
            }

            const beam = beams.pop()
            // make sure beam is inside grid
            if (!this.isPositionInside(beam.position)) continue

            // Get new direction(s) for beam
            const tile = this.tiles[beam.position.y][beam.position.x]
            const directions = tile.getExitDirections(beam.direction)
            // filter away directions that have already been explored from this tile
            const newDirections = directions.filter((direction) => !tile.hasCheckedDirection(direction))
            if (newDirections.length === 0) continue // no new beams to trace

            // save directions we have explored for this tile
            tile.checkedDirections.push(...newDirections)
            // update our beams by (re-)adding to queue
            for (const direction of newDirections) {
                const newBeam = new Beam({ ...beam.position }, direction)
                newBeam.step()
                beams.push(newBeam)
            }
        }

        let energizedCount = 0
        for (const row of this.tiles) {
            for (const tile of row) {
                energizedCount += Number(tile.isEnergized())
            }
        }
        return energizedCount
    }

    toString() {
        return this.tiles.map((row) => row.map((tile) => tile.toString()).join('')).join('\n')
    }
}

async function solver(input: string[]): Promise<number> {
    const grid = new Grid(input)

    type Condition = { x: number; y: number; direction: Direction }
    let bestCondition: Condition = undefined
    let max = 0

    async function run(startCondition: Condition) {
        const energized = await grid.traceBeam(
            new Beam({ x: startCondition.x, y: startCondition.y }, startCondition.direction),
            false
        )
        if (max < energized) {
            max = energized
            bestCondition = startCondition
        }
    }

    for (let x = 0; x < grid.tiles[0].length; x++) await run({ x, y: 0, direction: Direction.DOWN })
    for (let x = 0; x < grid.tiles[0].length; x++) await run({ x, y: grid.tiles.length - 1, direction: Direction.UP })
    for (let y = 0; y < grid.tiles.length; y++) await run({ x: 0, y, direction: Direction.RIGHT })
    for (let y = 0; y < grid.tiles.length; y++) await run({ x: grid.tiles[0].length - 1, y, direction: Direction.LEFT })

    console.log(
        `row: ${bestCondition.y + 1}, column: ${bestCondition.x + 1}, direction: ${Direction[bestCondition.direction]}`
    )
    await grid.traceBeam(new Beam({ x: bestCondition.x, y: bestCondition.y }, bestCondition.direction), false)
    writeOutput({ day: 16, part: 2, output: [grid.toString()] })
    return max
}

solveCalendar({
    day: 16,
    sampleAnswer: 51,
    solver, // 7741 ⭐️
})

// Optimal starting condition (1-indexed): row: 59, column: 1, direction: RIGHT
