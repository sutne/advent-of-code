import { solveCalendar } from '../util/solveCalendar'
import { writeOutput } from '../util/writeOutput'

type Lens = {
    label: string
    focalLength?: number
}

type BoxNode = {
    lens: Lens
    next?: BoxNode
}
/** Custom Linked List class for lenses */
class Box {
    front?: BoxNode

    /**
     * - If box is empty, new lens is placed at the front.
     * - If box contains lens with same label, replace old lens with the new one
     * - Otherwise place new lens behind all other lenses
     */
    add(lens: Lens) {
        if (!this.front) {
            this.front = { lens }
            return
        }
        let parent = this.front
        while (true) {
            if (parent.lens.label === lens.label) {
                parent.lens.focalLength = lens.focalLength
                return
            }
            if (parent.next === undefined) break
            parent = parent.next
        }
        parent.next = { lens }
    }

    /**
     * - If box is empty, or box doesn't contain lens with same label, does nothing
     * - Otherwise removes lens with this label, keeping the order of all other labels
     */
    remove(lens: Lens) {
        if (!this.front) return
        if (this.front.lens.label === lens.label) {
            this.front = this.front.next
            return
        }
        let prev = this.front
        while (prev.next !== undefined) {
            if (prev.next.lens.label === lens.label) {
                prev.next = prev.next.next
                return
            }
            prev = prev.next
        }
    }

    /**
     * Iterate over all lenses in the box, along with its slot (1-indexed)
     */
    forEach(callbackfn: (lens: Lens, slot?: number) => void) {
        let node = this.front
        let slot = 1
        while (node !== undefined) {
            callbackfn(node.lens, slot)
            node = node.next
            slot++
        }
    }

    toString(): string {
        const lenses: string[] = []
        this.forEach((lens) => lenses.push(`[${lens.label} ${lens.focalLength}]`))
        return lenses.join(' ')
    }
}

/**
 * Parses lenses from the input file, we can ignore the `=` and `-` operations and instead
 * leave the `focalLength` undefined to know wether the lens should be added or removed.
 */
function parseLenses(input: string[]): Lens[] {
    const line = input.join('')
    const lenses: Lens[] = line.split(',').map((str) => {
        const [label, focalLengthStr] = str.split(/=|-/)
        return { label, focalLength: focalLengthStr ? Number(focalLengthStr) : undefined }
    })
    return lenses
}

function ASCII(char: string) {
    return char.charCodeAt(0)
}

function HASH(lens: Lens) {
    let currentValue = 0
    for (const char of lens.label.split('')) {
        currentValue += ASCII(char)
        currentValue *= 17
        currentValue %= 256
    }
    return currentValue
}

function solver(input: string[]): number {
    const lenses = parseLenses(input)
    const boxes: Box[] = Array(256)
        .fill(null)
        .map((_) => new Box())

    for (const lens of lenses) {
        const index = HASH(lens)
        if (lens.focalLength !== undefined) {
            boxes[index].add(lens)
        } else {
            boxes[index].remove(lens)
        }
    }

    let focusingPower = 0
    for (const [boxNr, box] of boxes.entries()) {
        box.forEach((lens, slot) => {
            focusingPower += (boxNr + 1) * slot * lens.focalLength
        })
    }

    writeOutput({
        day: 15,
        part: 2,
        output: boxes.map((box, i) => `Box ${i.toString().padStart(3)}: ${box}`),
    })
    return focusingPower
}

solveCalendar({
    day: 15,
    sampleAnswer: 145,
    solver, // 267372 ⭐️
})
