import Atlas from "../models/Atlas"
import {AtlasChoice, atlasMap} from "../utilities/constants";

export function getAtlas(atlasChoice: AtlasChoice): Atlas {
    return atlasMap.get(atlasChoice)
}