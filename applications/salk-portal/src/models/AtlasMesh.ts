import {AtlasChoice} from "./Atlas";

export default class AtlasMesh {
    depth: number;
    segment: string;
    structure: string;
    uri: string

    constructor(filename : string, atlasId: AtlasChoice) {
        const fileData = filename.split('_')
        this.depth = parseInt(fileData[0], 10)
        this.segment = fileData[1]
        this.structure = fileData[2]
        const fileLocation = atlasId + '/' + filename
        import("../assets/atlas/" + fileLocation).then(module => this.uri = module.default)
    }
}
