import fs from 'fs'
import { getFolder } from './helpers'

export function writeOutput(props: { day: number; part: number; output: string[] }) {
    const outputPath = `${getFolder(props.day)}/data/output-${props.part}.txt`
    fs.writeFileSync(outputPath, props.output.join('\n'))
}
