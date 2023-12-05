import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

type Color = 'red' | 'green' | 'blue'
const maxCubeCount: Record<Color, number> = {
    red: 12,
    green: 13,
    blue: 14,
}

type ColorCount = {
    color: Color
    count: number
}

type Bundle = {
    colorCounts: ColorCount[]
}

type Game = {
    id: number
    bundles: Bundle[]
}

function parseGame(line: string): Game {
    // Game <id>: <bundle1>; <bundle2>; ...
    const [gameInfoString, allBundlesString] = line.trim().split(': ')

    const game: Game = {
        id: Number(gameInfoString.split(' ')[1]),
        bundles: allBundlesString.split('; ').map((bundleString) => {
            // <count> <color>, <count> <color>
            const colorCountStrings = bundleString.split(', ')
            const bundle: Bundle = {
                colorCounts: colorCountStrings.map((colorcounts) => {
                    // <count> <color>
                    const [count, color] = colorcounts.split(' ') as [number, Color]
                    const colorCount: ColorCount = {
                        color: color,
                        count: count,
                    }
                    return colorCount
                }),
            }
            return bundle
        }),
    }
    return game
}

function isPossible(game: Game): boolean {
    return game.bundles.every((bundle) =>
        bundle.colorCounts.every((colorCount) => colorCount.count <= maxCubeCount[colorCount.color]),
    )
}

function solver(input: string[]): number {
    const output: string[] = []

    const answer = input.reduce((sum, line) => {
        const game = parseGame(line)
        if (isPossible(game)) {
            output.push('True  - ' + line)
            return sum + game.id
        } else {
            output.push('False - ' + line)
            return sum
        }
    }, 0)

    writeOutput({ day: 2, part: 1, output })
    return answer
}

solveCalendar({
    day: 2,
    sampleAnswer: 8,
    solver, // 2685 ⭐️
})
