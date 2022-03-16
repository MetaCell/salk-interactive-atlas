import AtlasMesh from "./AtlasMesh"
import AtlasSegment from "./AtlasSegment"

export enum AtlasChoice {
    slk10 = "slk10",
    aln20 = "aln20",
}

export default class Atlas {
    meshes: AtlasMesh[];
    segments: AtlasSegment[]

    constructor(atlasId: AtlasChoice) {
        this.constructMeshes(atlasId)
        this.constructSegments(atlasId)
    }

    constructMeshes(atlasId: AtlasChoice){
        this.meshes = []
        const objsContext = require.context("../assets/atlas", true, /^.*\.obj$/)
        for (const filepath of objsContext.keys()){
            if (filepath.includes(atlasId)){
                const filename = filepath.replace(/^.*[\\\/]/, '')
                this.meshes.push(new AtlasMesh(filename, atlasId))
            }
        }
    }

    constructSegments(atlasId: AtlasChoice){
        this.segments = []
        const json = require("../assets/atlas/" + atlasId + '/atlas_segments.json')
        for (const entry of json){
            this.segments.push(new AtlasSegment(entry))
        }
    }
}
