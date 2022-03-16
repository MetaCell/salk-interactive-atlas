import AtlasMesh from "./AtlasMesh"
import AtlasSegment from "./AtlasSegment"
import {AtlasChoice} from "../utilities/constants";



export default class Atlas {
    meshes: AtlasMesh[];
    segments: AtlasSegment[]
    name: string

    constructor(atlasId: AtlasChoice, name: string) {
        this.constructMeshes(atlasId)
        this.constructSegments(atlasId)
        this.name = name
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
