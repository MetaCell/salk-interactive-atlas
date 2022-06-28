import AtlasInstance from "./AtlasInstance"
import AtlasSegment from "./AtlasSegment"
import {AtlasChoice} from "../utilities/constants";



export default class Atlas {
    instances: AtlasInstance[];
    segments: AtlasSegment[]
    laminas: string[]
    name: string
    id: AtlasChoice;

    constructor(atlasId: AtlasChoice, name: string) {
        this.name = name
        this.id = atlasId
        this.constructInstances()
        this.constructSegments()
        this.laminas = this._getLaminas().sort()
    }

    constructInstances(){
        this.instances = []
        const objsContext = require.context("../assets/atlas", true, /^.*\.obj$/)
        for (const filepath of objsContext.keys()){
            if (filepath.includes(this.id)){
                const filename = filepath.replace(/^.*[\\\/]/, '')
                this.instances.push(new AtlasInstance(filename, this.id))
            }
        }
    }

    constructSegments(){
        this.segments = []
        const json = require("../assets/atlas/" + this.id + '/atlas_segments.json')
        for (const entry of json){
            this.segments.push(new AtlasSegment(entry))
        }
    }

    _getLaminas(){
        return require("../assets/atlas/" + this.id + '/atlas_laminas.json')
    }

    getAnnotationImageSrc(segment: string){
        try{
            return require("../assets/atlas/" + this.id + '/annotations/' + segment + ".png").default
        }catch (e){
            return null
        }
    }
}
