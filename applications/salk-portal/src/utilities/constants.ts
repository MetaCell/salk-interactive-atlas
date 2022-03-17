import Atlas from "../models/Atlas";

export enum AtlasChoice {
    slk10 = "slk10",
    aln20 = "aln20",
}

const SLK10 = new Atlas(AtlasChoice.slk10, "Salk Cord 10um")

export const atlasMap = new Map<AtlasChoice, Atlas>([
        [AtlasChoice.slk10, SLK10],
    ]
)
