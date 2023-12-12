import { solveCalendar } from '../util/solveCalendar'

type Position = {
    x: number
    y: number
}

type Galaxy = {
    id: number
    position: Position
    originalPosition: Position
}

/** Convert lines to 2D char array */
function parseImage(input: string[]) {
    return input.map((line) => line.split(''))
}

/** Find and return all galaxies with their position in `image` */
function findGalaxies(image: string[][]): Galaxy[] {
    const galaxies: Galaxy[] = []
    for (let y = 0; y < image.length; y++) {
        for (let x = 0; x < image[y].length; x++) {
            if (image[y][x] === '#') {
                galaxies.push({
                    id: galaxies.length + 1,
                    position: { x, y },
                    originalPosition: { x, y },
                })
            }
        }
    }
    return galaxies
}

/** Expand empty row/column into 1 000 000 */
function expandUniverse(image: string[][], galaxies: Galaxy[], expansion = 1_000_000): Galaxy[] {
    // expand rows
    for (let y = 0; y < image.length; y++) {
        const row = image[y]
        if (row.some((char) => char !== '.')) continue

        for (const galaxy of galaxies) {
            if (y <= galaxy.originalPosition.y) {
                galaxy.position.y += expansion - 1
            }
        }
    }
    // expand columns
    for (let x = 0; x < image[0].length; x++) {
        const column = image.map((row) => row[x])
        if (column.some((char) => char !== '.')) continue

        for (const galaxy of galaxies) {
            if (x <= galaxy.originalPosition.x) {
                galaxy.position.x += expansion - 1
            }
        }
    }
    return galaxies
}

/** Calculate distance between `a` and `b` assuming one can not move diagonally */
function findDistance(a: Position, b: Position) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function solver(input: string[]): number {
    const originalImage = parseImage(input)
    const originalGalaxies = findGalaxies(originalImage)
    const galaxies = expandUniverse(originalImage, originalGalaxies)

    let sum = 0
    for (let a = 0; a < galaxies.length; a++) {
        for (let b = a + 1; b < galaxies.length; b++) {
            sum += findDistance(galaxies[a].position, galaxies[b].position)
        }
    }

    return sum
}

solveCalendar({
    day: 11,
    // sampleAnswer: 1030, // expansion = 10
    // sampleAnswer: 8410, // expansion = 100
    sampleAnswer: 82000210, // expansion = 1_000_000
    solver, // 618800410814 ⭐️
})
