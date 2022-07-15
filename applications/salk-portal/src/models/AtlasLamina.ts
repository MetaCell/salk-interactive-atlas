
export default class AtlasLamina {
    id: string;
    minY: number
    defaultShade: string

    constructor(id: string, minY: number) {
        this.id = id
        this.minY = minY
    }

    setDefaultShade(color: string){
        this.defaultShade = color
    }

}