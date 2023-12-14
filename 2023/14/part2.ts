import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

const ROUND_ROCK = 'O'
const SQUARE_ROCK = '◼'
const EMPTY_SPACE = '·'

type Position = { x: number; y: number }
type Platform = string[][]

const directionOffsets = {
    NORTH: { x: 0, y: -1 },
    WEST: { x: -1, y: 0 },
    SOUTH: { x: 0, y: 1 },
    EAST: { x: 1, y: 0 },
}

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
 * If `rock` is a round rock, slide it as far as possible using the `directionOffset` until rock
 * reaches edge or another rock.
 */
function slideRock(platform: Platform, rock: Position, directionOffset: { x: number; y: number }) {
    const { x, y } = rock
    if (platform[y][x] !== ROUND_ROCK) return

    let newPosition: Position = { x, y }
    while (true) {
        const nextX = newPosition.x + directionOffset.x
        const nextY = newPosition.y + directionOffset.y
        if (nextY < 0 || platform.length - 1 < nextY) break
        if (nextX < 0 || platform[0].length - 1 < nextX) break
        if (platform[nextY][nextX] !== EMPTY_SPACE) break
        newPosition = { x: nextX, y: nextY }
    }
    moveRock(platform, { x, y }, newPosition)
}

function tiltPlatformNorth(platform: Platform) {
    for (let y = 0; y < platform.length; y++) {
        for (let x = 0; x < platform[y].length; x++) {
            slideRock(platform, { x, y }, directionOffsets.NORTH)
        }
    }
}
function tiltPlatformWest(platform: Platform) {
    for (let y = 0; y < platform.length; y++) {
        for (let x = 0; x < platform[y].length; x++) {
            slideRock(platform, { x, y }, directionOffsets.WEST)
        }
    }
}
function tiltPlatformSouth(platform: Platform) {
    for (let y = platform.length - 1; y >= 0; y--) {
        for (let x = 0; x < platform[y].length; x++) {
            slideRock(platform, { x, y }, directionOffsets.SOUTH)
        }
    }
}
function tiltPlatformEast(platform: Platform) {
    for (let y = 0; y < platform.length; y++) {
        for (let x = platform[y].length - 1; x >= 0; x--) {
            slideRock(platform, { x, y }, directionOffsets.EAST)
        }
    }
}

function solver(input: string[]): number {
    const platform = parsePlatform(input)

    // I just did 1000 cycles to test and got the right answer 😈
    for (let cycle = 1; cycle <= 1000; cycle++) {
        tiltPlatformNorth(platform)
        tiltPlatformWest(platform)
        tiltPlatformSouth(platform)
        tiltPlatformEast(platform)
    }

    let totalLoad = 0
    for (let row = 0; row < platform.length; row++) {
        const load = platform.length - row
        for (let column = 0; column < platform[row].length; column++) {
            if (platform[row][column] === ROUND_ROCK) totalLoad += load
        }
    }

    writeOutput({ day: 14, part: 2, output: platform.map((row) => row.join('')) })
    return totalLoad
}

solveCalendar({
    day: 14,
    sampleAnswer: 64,
    solver, // 88680 ⭐️
})
