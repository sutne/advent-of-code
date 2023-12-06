import { solveCalendar } from '../util/solveCalendar'

type Race = {
    time: number
    distance: number
}

function parseNumbers(str: string): number[] {
    const values: string[] = str.trim().split(/\s+/)
    return values.map((value) => Number(value))
}

function parseRaces(input: string[]): Race[] {
    const [timesStr, distancesStr] = input
    const times = parseNumbers(timesStr.split(':')[1])
    const distances = parseNumbers(distancesStr.split(':')[1])
    return times.map((time, i) => {
        const distance = distances[i]
        return { time, distance } as Race
    })
}

function findTravelDistance(holdTime: number, totalTime: number): number {
    const speed = holdTime
    const time = totalTime - holdTime
    return speed * time
}

function possibleHoldTimeCount(race: Race): number {
    let count = 0
    for (let holdTime = 1; holdTime < race.time; holdTime++) {
        const travelDistance = findTravelDistance(holdTime, race.time)
        if (travelDistance < race.distance && count !== 0) break
        if (race.distance < travelDistance) count++
    }
    return count
}

function solver(input: string[]): number {
    const races = parseRaces(input)
    return races.reduce((product, race) => product * possibleHoldTimeCount(race), 1)
}

solveCalendar({
    day: 6,
    sampleAnswer: 288,
    solver, // 861300 ⭐️
})
