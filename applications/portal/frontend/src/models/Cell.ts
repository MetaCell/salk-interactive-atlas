import {ExperimentCells} from "../apiclient/workspaces";
import {dictZip} from "../utilities/functions";

export default class Cell implements ExperimentCells {
    x: number;
    y: number;
    z: number;

    constructor(cellCSV: string, header: string[]) {
        const values = dictZip(header, cellCSV.split(',')) as {x: string, y: string, z: string}
        // Converts cordmap coordinates to threejs coordinates
        this.x = parseFloat(values.z)
        this.y = parseFloat(values.x)
        this.z = parseFloat(values.y)
    }
}