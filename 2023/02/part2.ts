import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

type Color = 'red' | 'green' | 'blue'

type CubeCount = {
    color: Color
    count: number
}

type Bundle = {
    cubeCounts: CubeCount[]
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
                cubeCounts: colorCountStrings.map((colorcounts) => {
                    // <count> <color>
                    const [count, color] = colorcounts.split(' ') as [number, Color]
                    const colorCount: CubeCount = {
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

type RequiredCubeCounts = Record<Color, number>
function requiredCubeCounts(game: Game): RequiredCubeCounts {
    return game.bundles.reduce(
        (maxCounts, bundle) => {
            bundle.cubeCounts.forEach((cubeCount) => {
                maxCounts[cubeCount.color] = Math.max(maxCounts[cubeCount.color], cubeCount.count)
            })
            return maxCounts
        },
        {
            red: 0,
            green: 0,
            blue: 0,
        },
    )
}

function solver(input: string[]): number {
    const output: string[] = []

    const answer = input.reduce((sum, line) => {
        const game = parseGame(line)
        const minimumCubeCount = requiredCubeCounts(game)
        const gamePower = Object.entries(minimumCubeCount).reduce((power, [color, count]) => power * count, 1)
        output.push(
            `power=${gamePower}\t red=${minimumCubeCount.red}\t green=${minimumCubeCount.green}\t blue=${minimumCubeCount.blue} \t -  ${line}`,
        )
        return sum + gamePower
    }, 0)

    writeOutput({ day: 2, part: 2, output })
    return answer
}

solveCalendar({
    day: 2,
    sampleAnswer: 2286,
    solver, // 559667 ⭐️
})
