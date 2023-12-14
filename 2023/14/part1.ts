import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

const ROUND_ROCK = 'O'
const SQUARE_ROCK = '◼'
const EMPTY_SPACE = '·'

type Position = { x: number; y: number }
type Platform = string[][]

/** Convert input to 2D array and map characters */
function parsePlatform(input: string[]): Platform {
    return input.map((line) =>
        line.split('').map((char) => {
            if (char === 'O') return ROUND_ROCK
            if (char === '#') return SQUARE_ROCK
            return EMPTY_SPACE
        })
    )
}

/**
 * Move round rock in `platform` to new position, throw error if `from` isn't a rock,
 * or if `to` is already occupied
 */
function moveRock(platform: Platform, from: Position, to: Position) {
    if (to.x === from.x && to.y === from.y) return // rock is already in this position
    if (platform[from.y][from.x] !== ROUND_ROCK) throw new Error(`Thats not a round rock!`)
    if (platform[to.y][to.x] !== EMPTY_SPACE) throw new Error(`Space occupied!`)

    platform[from.y][from.x] = EMPTY_SPACE
    platform[to.y][to.x] = ROUND_ROCK
}

/**
 * If `rock` is not a round rock do nothing, otherwise attempt to slide the rock
 * as far as possible north before hitting edge or another rock.
 */
function slideRockNorth(platform: Platform, rock: Position) {
    const { x, y } = rock
    if (platform[y][x] !== ROUND_ROCK) return

    let newPosition: Position = { x, y }
    while (true) {
        const nextY = newPosition.y - 1 // north is in negative y direction
        if (nextY < 0 || platform.length - 1 < nextY) break
        if (platform[nextY][x] !== EMPTY_SPACE) break
        newPosition = { x: x, y: nextY }
    }
    moveRock(platform, { x, y }, newPosition)
}

/**
 * Start with northern-most row and move rocks as far north (to as low y-index) as possible.
 */
function tiltPlatformNorth(platform: Platform) {
    for (let y = 0; y < platform.length; y++) {
        for (let x = 0; x < platform[y].length; x++) {
            slideRockNorth(platform, { x, y })
        }
    }
}

function solver(input: string[]): number {
    const platform = parsePlatform(input)
    tiltPlatformNorth(platform)

    let totalLoad = 0
    for (let row = 0; row < platform.length; row++) {
        const load = platform.length - row
        for (let column = 0; column < platform[row].length; column++) {
            if (platform[row][column] === ROUND_ROCK) totalLoad += load
        }
    }

    writeOutput({ day: 14, part: 1, output: platform.map((row) => row.join('')) })
    return totalLoad
}

solveCalendar({
    day: 14,
    sampleAnswer: 136,
    solver, // 105249 ⭐️
})
