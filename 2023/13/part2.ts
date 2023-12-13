import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

type Pattern = string[][]
type SmudgeMirror = { row: number; smudgeCount: number }

/** Split input on empty lines and convert patterns to 2D array for easy indexing */
function parsePatterns(input: string[]): Pattern[] {
    const patterns: Pattern[] = []
    let pattern: string[][] = []
    for (const line of [...input, '']) {
        if (line === '') {
            patterns.push(pattern)
            pattern = []
            continue
        }
        pattern.push(line.split('').map((char) => (char === '.' ? '░' : '█')))
    }
    return patterns
}

/**
 * Mirror must have identical lines (or up to 1 mismatch) next to eachother, find those
 * (if mirror is between 2|3, duplicate is returned as 3 because that is also
 * equal to number of rows above this potential mirror)
 */
function findDuplicateRows(pattern: Pattern): SmudgeMirror[] {
    const possibleRows: SmudgeMirror[] = []
    for (let row = 1; row < pattern.length; row++) {
        let smudgeCount = 0
        for (let col = 0; col < pattern[row].length; col++) {
            if (pattern[row][col] !== pattern[row - 1][col]) {
                smudgeCount++
                if (smudgeCount > 1) break
            }
            if (col === pattern[row].length - 1) possibleRows.push({ row, smudgeCount })
        }
    }
    return possibleRows
}

/**
 * Assuming `row` and `row-1` is duplicate, expand outwards and compare rows
 * until out of bound, or if there is a mismatch
 */
function isMirrorRow(pattern: Pattern, possibleSmudgeRow: SmudgeMirror): boolean {
    for (let diff = 1; 0 <= possibleSmudgeRow.row - diff - 1 && diff + possibleSmudgeRow.row < pattern.length; diff++) {
        const rowA = pattern[possibleSmudgeRow.row + diff]
        const rowB = pattern[possibleSmudgeRow.row - diff - 1]
        for (let col = 0; col < pattern[0].length; col++) {
            if (rowA[col] !== rowB[col]) {
                possibleSmudgeRow.smudgeCount++
                if (possibleSmudgeRow.smudgeCount > 1) return false
            }
        }
    }
    return possibleSmudgeRow.smudgeCount === 1 // smudgy mirror MUST have exactly one smudge
}

/** if mirror is horizontal, return the row of the mirror  */
function findHorizontalMirror(pattern: Pattern): number {
    const possibleRows = findDuplicateRows(pattern)
    for (const possibleRow of possibleRows) {
        if (isMirrorRow(pattern, possibleRow)) return possibleRow.row
    }
    return undefined
}

/** Simply transpose and use `findHorizontalMirror` */
function findVerticalMirror(pattern: Pattern): number {
    const transposed = pattern[0].map((_, col) => pattern.map((row) => row[col]))
    return findHorizontalMirror(transposed)
}

function solver(input: string[]): number {
    const output: string[] = []
    const patterns = parsePatterns(input)

    let sum = 0
    patterns.forEach((pattern) => {
        const row = findHorizontalMirror(pattern)
        if (row === undefined) {
            const col = findVerticalMirror(pattern)
            sum += col

            // write output
            pattern.forEach((row) => row.splice(col, 0, '┃')) // add vertical mirror
            const rows = pattern.map((row) => row.join(''))
            output.push(rows.join('\n') + '\n\n\n')
        } else {
            sum += 100 * row

            // write output
            const rows = pattern.map((row) => row.join(''))
            rows.splice(row, 0, '━'.repeat(pattern[0].length)) // add horizontal mirror
            output.push(rows.join('\n') + '\n\n\n')
        }
    })

    writeOutput({ day: 13, part: 2, output })
    return sum
}

solveCalendar({
    day: 13,
    sampleAnswer: 400,
    solver, // 23479 ⭐️
})
