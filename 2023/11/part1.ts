import { solveCalendar } from '../util/solveCalendar'

type Position = {
    x: number
    y: number
}

type Galaxy = {
    id: number
    position: Position
}

/** Insert `value` at `index` in `arr` */
function insert<T>(arr: T[], index: number, value: T): void {
    arr.splice(index, 0, value)
}

/** Create exact duplicate of `arr` without referencing to `arr` */
function copy<T>(arr: T[][]): T[][] {
    return [...arr.map((row) => [...row])]
}

/** Convert lines to 2D char array */
function parseImage(input: string[]) {
    return input.map((line) => line.split(''))
}

/** Double empty rows and columns and return expanded image */
function expandImage(image: string[][]): string[][] {
    const expandedImage: string[][] = copy(image)
    // expand rows
    for (let r = 0; r < expandedImage.length; r++) {
        const row = expandedImage[r]
        if (row.some((char) => char !== '.')) continue

        insert(expandedImage, r, [...row])
        r++ // skip added row
    }
    // expand columns
    for (let c = 0; c < expandedImage[0].length; c++) {
        const column = expandedImage.map((row) => row[c])
        if (column.some((char) => char !== '.')) continue

        expandedImage.forEach((row) => insert(row, c, '.'))
        c++ // skip added column
    }
    return expandedImage
}

/** Find and return all galaxies with their position in `image` */
function findGalaxies(image: string[][]): Galaxy[] {
    const galaxies: Galaxy[] = []
    for (let y = 0; y < image.length; y++) {
        for (let x = 0; x < image[y].length; x++) {
            if (image[y][x] !== '#') continue
            galaxies.push({
                id: galaxies.length + 1,
                position: { x, y },
            })
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
    const image = expandImage(originalImage)
    const galaxies = findGalaxies(image)

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
    sampleAnswer: 374,
    solver, // 9648398 ⭐️
})
