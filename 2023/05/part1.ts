import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'
const output: string[] = []

type Category = 'seed' | 'soil' | 'fertilizer' | 'water' | 'light' | 'temperature' | 'humidity' | 'location'
type MapRange = {
    /** source start */
    start: number
    /** source start + range length (exclusive) */
    end: number
    /** destination start - source start */
    offset: number
}
type Map = {
    source: Category
    destination: Category
    ranges: MapRange[]
}

function parseNumbers(str: string): number[] {
    return str
        .trim()
        .split(' ')
        .map((value) => Number(value))
}

function parseMaps(input: string[]): Map[] {
    const joinedInput = input.slice(2).join('\n') // to split content on double newline and skip starting seeds
    const mapSecions: string[][] = joinedInput.split('\n\n').map((section) => section.split('\n'))
    return mapSecions.map((mapSection) => {
        const [source, destination] = mapSection[0].split(' ')[0].split('-to-') as [Category, Category]
        const ranges: MapRange[] = mapSection.slice(1).map((line) => {
            const [destinationStart, sourceStart, length] = parseNumbers(line)
            return {
                start: sourceStart,
                end: sourceStart + length,
                offset: destinationStart - sourceStart,
            }
        })
        return { source, destination, ranges }
    })
}

/** Recursively find value when transcending maps until there is no map from `source` */
function transcend(source: Category, sourceValue: number, maps: Map[]): number {
    output.push(`${source} ${sourceValue}`)

    const map = maps.find((map) => map.source === source)
    if (!map) return sourceValue // no maps map from this category

    for (const range of map.ranges) {
        if (range.start <= sourceValue && sourceValue < range.end) {
            return transcend(map.destination, sourceValue + range.offset, maps)
        }
    }
    return transcend(map.destination, sourceValue, maps)
}

function solver(input: string[]): number {
    const seeds: number[] = parseNumbers(input[0].split(':')[1])
    const maps: Map[] = parseMaps(input)

    // find seed that gives lowest location value
    const lowestLocation = seeds.reduce((lowestLocation, seed) => {
        const location = transcend('seed', seed, maps)
        output.push('')
        return Math.min(lowestLocation, location)
    }, Infinity)

    writeOutput({ day: 5, part: 1, output })
    return lowestLocation
}

solveCalendar({
    day: 5,
    sampleAnswer: 35,
    solver, // 340994526 ⭐️
})
