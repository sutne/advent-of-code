import { getFolder, readLines } from './helpers'

/** Handles reading, testing and logging answer for given calendar day */
export function solveCalendar(props: {
    /** Day to read input from, assumes file is `day/data/input.txt` if `inputNr` isn't given */
    day: number
    /** Solver that takes input from file and return the answer for that day */
    solver: (input: string[]) => number
    /** When given, solver will be tested against `day/data/sample.txt` before running on full input */
    sampleAnswer?: number
    /** Specify a input file if day has several, assumes files are named `day/data/input-{inputNr}.txt` */
    inputNr?: number
    /** Specify a sample input if day has several, assumes file is `day/data/input-{sampleNr}.txt` */
    sampleNr?: number
}): void {
    if (props.sampleAnswer !== undefined) {
        // make sure solver has correct answer for sample
        const samplePath = `${getFolder(props.day)}/data/sample${props.sampleNr ? `-${props.sampleNr}` : ''}.txt`
        const sampleInput = readLines(samplePath)
        const sampleAnswer = props.solver(sampleInput)
        if (sampleAnswer !== props.sampleAnswer) {
            let error = `\nWrong sample answer '${sampleAnswer}'`
            if (sampleAnswer < props.sampleAnswer) error += ', too low ⬇️❗️'
            if (sampleAnswer > props.sampleAnswer) error += ', too high ⬆️❗️'
            console.error(error + '\n')
            return
        }
        console.log('\n✅ Sample Solved! solving full input...')
    }

    // Solve full input and print answer
    const inputPath = `${getFolder(props.day)}/data/input${props.inputNr ? `-${props.inputNr}` : ''}.txt`
    const input = readLines(inputPath)
    const answer = props.solver(input)
    console.log(`\n${answer} ⭐️\n`)
}
