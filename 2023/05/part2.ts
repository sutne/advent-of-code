import { solveCalendar } from '../util/solveCalendar'

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
type SeedRange = {
    start: number
    /** exclusive */
    end: number
}

function parseNumbers(str: string): number[] {
    return str
        .trim()
        .split(' ')
        .map((value) => Number(value))
}

function parseSeedRanges(str: string): SeedRange[] {
    const numbers: number[] = parseNumbers(str)
    const seedRanges: SeedRange[] = []
    while (numbers.length) {
        // remove start and length from numbers until empty
        const [start, length] = numbers.splice(0, 2)
        seedRanges.push({ start, end: start + length })
    }
    return seedRanges
}

function parseMaps(input: string[]): Map[] {
    const joinedInput = input.slice(2).join('\n')
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
    const seedRanges: SeedRange[] = parseSeedRanges(input[0].split(':')[1])

    const maps: Map[] = parseMaps(input)

    let lowestLocation = Infinity
    for (const seedRange of seedRanges) {
        let lowestRangeLocation = Infinity
        for (let seed = seedRange.start; seed < seedRange.end; seed++) {
            const location = transcend('seed', seed, maps)
            lowestRangeLocation = Math.min(lowestRangeLocation, location)
        }
        lowestLocation = Math.min(lowestLocation, lowestRangeLocation)
    }
    return lowestLocation
}

// this took 15 mins
solveCalendar({
    day: 5,
    sampleAnswer: 46,
    solver, // 52210644 ⭐️
})
