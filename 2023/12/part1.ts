import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

enum Condition {
    DAMAGED = 1,
    OPERATIONAL = 2,
}

const conditions = {
    '#': Condition.DAMAGED,
    '.': Condition.OPERATIONAL,
    '?': undefined,
}

type Record = {
    springs: string
    groups: number[]
}

function parseRecord(line: string): Record {
    const [springs, groupsStr] = line.split(' ')
    const groups: number[] = groupsStr.split(',').map((value) => Number(value))
    return { springs, groups }
}

/** Return true if visible damaged springs satisfy the groups
 */
function isPossible(record: Record): boolean {
    const numGroups = record.groups.length
    const groups = record.springs.split(/\.+/).filter((v) => v)
    const groupCount = groups.length
    if (numGroups < groupCount) return false
    const numDamaged = record.groups.reduce((sum, group) => sum + group, 0)
    const damagedCount = record.springs.split('').filter((char) => char === '#').length
    if (numDamaged < damagedCount) return false
    const unkownCount = record.springs.split('').filter((char) => char === '?').length
    if (damagedCount + unkownCount < numDamaged) return false
    if (unkownCount === 0 && numGroups !== groupCount) return false
    if (groups.some((group, i) => group.length < record.groups[i])) return false
    if (groups.some((group, i) => group.length - unkownCount > record.groups[i])) return false
    return true
}

/** set first unknown spring condition to `condition` */
function withFirst(record: Record, condition: Condition): Record {
    for (let i = 0; i < record.springs.length; i++) {
        if (!conditions[record.springs.charAt(i)]) {
            const char = condition === Condition.DAMAGED ? '#' : '.'
            return {
                springs: record.springs.substring(0, i) + char + record.springs.substring(i + 1),
                groups: [...record.groups],
            }
        }
    }
}

function countPossibilities(record: Record, currentCount = 0) {
    console.log({ checking: record.springs })
    if (!isPossible(record)) return 0
    if (!record.springs.includes('?')) {
        console.log({ valid: record.springs })
        return 1
    }
    return (
        countPossibilities(withFirst(record, Condition.DAMAGED), currentCount) +
        countPossibilities(withFirst(record, Condition.OPERATIONAL), currentCount)
    )
}

function solver(input: string[]): number {
    const records = input.map((line) => parseRecord(line))

    console.log(isPossible({ springs: '.??.###', groups: [1, 1, 3] }))

    records.forEach((record) => console.log({ record, count: countPossibilities(record) }, '\n'))

    writeOutput({ day: 12, part: 1, output: [] })
    return undefined
}

solveCalendar({
    day: 12,
    sampleAnswer: 21,
    solver,
})
