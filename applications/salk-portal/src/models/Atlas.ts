import AtlasInstance from "./AtlasInstance"
import AtlasSegment from "./AtlasSegment"
import {AtlasChoice} from "../utilities/constants";



export default class Atlas {
    instances: AtlasInstance[];
    segments: AtlasSegment[]
    name: string

    constructor(atlasId: AtlasChoice, name: string) {
        this.constructInstances(atlasId)
        this.constructSegments(atlasId)
        this.name = name
    }

    constructInstances(atlasId: AtlasChoice){
        this.instances = []
        const objsContext = require.context("../assets/atlas", true, /^.*\.obj$/)
        for (const filepath of objsContext.keys()){
            if (filepath.includes(atlasId)){
                const filename = filepath.replace(/^.*[\\\/]/, '')
                this.instances.push(new AtlasInstance(filename, atlasId))
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
