import {AtlasChoice} from "../utilities/constants";
import {createSimpleInstance} from "../utilities/instancesHelper";

export default class AtlasInstance {
    depth: number;
    segment: string;
    structure: string;
    id: string

    constructor(filename: string, atlasId: AtlasChoice) {
        const fileData = filename.split('_')
        this.depth = parseInt(fileData[0], 10)
        this.segment = fileData[1]
        this.structure = fileData[2].split('.')[0]
        const fileLocation = atlasId + '/' + filename
        import("../assets/atlas/" + fileLocation).then(module => {
                const obj = module.default
                this.id = atlasId + "_" + this.depth + "_" + this.segment + "_" + this.structure
                createSimpleInstance(this.id, this.id, obj)
            }
        )
    }
}
