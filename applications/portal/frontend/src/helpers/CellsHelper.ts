import Cell from "../models/Cell";
import {ExperimentPopulationsInner} from "../apiclient/workspaces";


export async function getCells(api: any, p: ExperimentPopulationsInner) {
    const cellsFile = await api.cellsPopulation(`${p.id}`);
    // @ts-ignore
    const cellsFileArray = cellsFile.data.split(/\r?\n/)
    if (cellsFileArray[cellsFileArray.length - 1] === '') {
        cellsFileArray.pop()
    }
    const header = cellsFileArray.shift().split(',')
    return cellsFileArray.map((csv: string) => new Cell(csv, header))
}