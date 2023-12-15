import { solveCalendar } from '../util/solveCalendar'

type Condition = '#' | '.' | '?'

const DAMAGED = '#'
const OPERATIONAL = '.'
const UNKNOWN = '?'

type Record = {
    target: {
        groups: readonly number[]
        damagedCount: number
    }
    springs: Condition[]
    unknownCount: number
    damagedCount: number
}

function parseRecord(line: string): Record {
    const [springsStr, groupsStr] = line.split(' ')
    const springs = springsStr.split('') as Condition[]
    const groups = groupsStr.split(',').map((value) => Number(value))
    return {
        target: {
            groups,
            damagedCount: groups.reduce((sum, count) => sum + count, 0),
        },
        springs,
        unknownCount: springs.reduce((count, spring) => count + Number(spring === UNKNOWN), 0),
        damagedCount: springs.reduce((count, spring) => count + Number(spring === DAMAGED), 0),
    }
}

/**
 * Alright so part1 would take forever as checking the entire spring array each time, instead we can split the
 * spring array into subgroups, and find how many possibilities that group has (groups with counts), we could
 * then store these subgroups in a Record to not have to recalculate the same subgroups each time.
 */
function isStillPossible(record: Record): boolean {
    const groups: number[] = record.springs
        .reduce(
            (groups, spring) => {
                if (spring === DAMAGED) groups[groups.length - 1]++
                if (spring === OPERATIONAL && groups[groups.length - 1] > 0) groups.push(0)
                return groups
            },
            [0]
        )
        .filter((count) => count !== 0)

    /* Prune branches while there is still unknowns */
    // too many damaged
    if (record.damagedCount > record.target.damagedCount) return false
    // too few damaged + unknown
    if (record.damagedCount + record.unknownCount < record.target.damagedCount) return false
    // too many groups
    if (groups.length > record.target.groups.length) return false
    // groups already have a count too large
    if (groups.length === record.target.groups.length) {
        if (groups.some((count, i) => count > record.target.groups[i])) return false
    }
    /* Done with pruning */

    if (record.unknownCount > 0) return true

    // Make sure groups are correct
    if (groups.length !== record.target.groups.length) return false
    if (!groups.every((count, i) => count === record.target.groups[i])) return false

    return true
}

/** set first unknown spring condition to `condition` */
function withFirstUnkownAs(record: Record, condition: Condition): Record {
    for (let i = 0; i < record.springs.length; i++) {
        if (record.springs[i] !== UNKNOWN) continue
        return {
            target: record.target,
            springs: record.springs.toSpliced(i, 1, condition),
            unknownCount: record.unknownCount - 1,
            damagedCount: record.damagedCount + Number(condition === DAMAGED),
        }
    }
}

function countPossibilities(record: Record) {
    if (!isStillPossible(record)) return 0
    if (record.unknownCount === 0) return 1
    return (
        countPossibilities(withFirstUnkownAs(record, DAMAGED)) +
        countPossibilities(withFirstUnkownAs(record, OPERATIONAL))
    )
}

function solver(input: string[]): number {
    const records = input.map((line) => parseRecord(line))
    return records.reduce((sum, record) => {
        return sum + countPossibilities(record)
    }, 0)
}

solveCalendar({
    day: 12,
    sampleAnswer: 525152,
    solver, //
})
