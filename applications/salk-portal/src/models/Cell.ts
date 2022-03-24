import {ExperimentCells} from "../apiclient/workspaces";

export default class Cell implements ExperimentCells {
    x: number;
    y: number;
    z: number;

    constructor(cellCSV: string) {
        const values = cellCSV.split(',')
        this.x = parseFloat(values[0])
        this.y = parseFloat(values[1])
        this.z = parseFloat(values[2])
    }
}