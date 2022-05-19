import {getAtlas} from "../service/AtlasService";
import {AtlasChoice} from "./constants";
import Range from "../models/Range";

export const areAllSelected = (obj: { [x: string]: { selected: any } }) : boolean => {
   return Object.keys(obj)
        .reduce((acc, sId) => obj[sId].selected && acc, true)
}

export function eqSet(set1: Set<any>, set2: Set<any>) : boolean {
   if (set1.size !== set2.size) return false;
   for (const x of set1) if (!set2.has(x)) return false;
   return true;
}

export const getAllowedRanges = (selectedAtlas: AtlasChoice, activeSubdivisions: Set<string>) : Range[] => {
   const ranges : Range[] = []
   const atlas = getAtlas(selectedAtlas)
   activeSubdivisions.forEach(subdivisionId => {
      const atlasSegment = atlas.segments.find(as => as.id === subdivisionId)
      ranges.push(atlasSegment.range)
   });
   return ranges
}

export function hexToRgb(hex: string) {
   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
   return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
   } : null;
}

export function getRGBAFromHexAlpha(hex: string, opacity: number){
   const rgb = hexToRgb(hex)
   return rgb ? {...rgb, a: opacity} : {r: 0, g: 0, b: 0, a: 1}
}

export function getRGBAString(rgba: { r: number; g: number; b: number; a: number; }){
   return `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`
}