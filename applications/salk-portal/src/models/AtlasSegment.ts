import Range from './Range'

export default class AtlasSegment {
    range: Range
    id: string;

    constructor(entry: any) {
        const start = parseInt(entry.Start, 10)
        const end = parseInt(entry.End, 10)
        this.range = new Range(start, end)
        this.id = entry.Segment
    }

}