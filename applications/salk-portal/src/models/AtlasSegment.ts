export default class AtlasSegment {
    start: number;
    end: number;
    id: string;

    constructor(entry: any) {
        this.start = parseInt(entry.Start, 10)
        this.end = parseInt(entry.End, 10)
        this.id = entry.Segment
    }

}