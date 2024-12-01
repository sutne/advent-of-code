import fs from 'fs'

/** get folder directory for 2023 calendar day */
export function getFolder(day: number): string {
    return `${(day < 10 ? '0' : '') + day}`
}

/** Read and return all lines from `path` */
export function readLines(path: string): string[] {
    const lines = fs.readFileSync(path, 'utf8').split('\n')
    if (!lines[lines.length - 1]) lines.splice(lines.length - 1, 1)
    return lines
}

/** Write all `lines` into file `path` */
export function writeLines(path: string, lines: string[]): void {
    fs.writeFileSync(path, lines.join('\n'), 'utf8')
}
