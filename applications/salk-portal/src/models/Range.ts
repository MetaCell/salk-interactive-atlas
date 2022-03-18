export default class Range{
    start: number;
    end: number;

    constructor(start: number, end: number) {
        this.start = start
        this.end = end
    }

    public includes(num: number) : boolean{
        return num >= this.start && num <= this.end
    }

}