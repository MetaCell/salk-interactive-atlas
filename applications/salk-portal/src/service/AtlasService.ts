import Atlas, {AtlasChoice} from "../models/Atlas"


const AtlasMap = new Map<AtlasChoice, Atlas>([
    [AtlasChoice.slk10, new Atlas(AtlasChoice.slk10)],
    ]
)

export function getAtlas(atlasChoice: AtlasChoice): Atlas {
    return AtlasMap.get(atlasChoice)
}
