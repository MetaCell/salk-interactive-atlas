import {getAtlas} from "../service/AtlasService";
import {AtlasChoice} from "./constants";
import Range from "../models/Range";

export const areAllSelected = (obj: { [x: string]: { selected: any } }) => {
   return Object.keys(obj)
        .reduce((acc, sId) => obj[sId].selected && acc, true)
}

export function eqSet(set1: Set<any>, set2: Set<any>) {
   if (set1.size !== set2.size) return false;
   for (const x of set1) if (!set2.has(x)) return false;
   return true;
}

export const getAllowedRanges = (selectedAtlas: AtlasChoice, activeSubdivisions: Set<string>) => {
   const ranges : Range[] = []
   const atlas = getAtlas(selectedAtlas)
   activeSubdivisions.forEach(subdivisionId => {
      const atlasSegment = atlas.segments.find(as => as.id === subdivisionId)
      ranges.push(atlasSegment.range)
   });
   return ranges
}