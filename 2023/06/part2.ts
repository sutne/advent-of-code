import { solveCalendar } from '../util/solveCalendar'

type Race = {
    time: number
    distance: number
}

function parseNumber(str: string): number {
    const noSpaces = str.replace(/\s/g, '')
    return Number(noSpaces)
}

function parseRace(input: string[]): Race {
    const [timeStr, distanceStr] = input
    const time = parseNumber(timeStr.split(':')[1])
    const distance = parseNumber(distanceStr.split(':')[1])
    return { time, distance }
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
    const race = parseRace(input)
    return possibleHoldTimeCount(race)
}

solveCalendar({
    day: 6,
    sampleAnswer: 71503,
    solver, // 28101347 ⭐️
})
