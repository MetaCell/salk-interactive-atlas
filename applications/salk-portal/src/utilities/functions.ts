import {getAtlas} from "../service/AtlasService";
import {AtlasChoice, POPULATION_FINISHED_STATE} from "./constants";
import Range from "../models/Range";

export const areAllSelected = (obj: { [x: string]: {
      status: string;
      selected: any } }) : boolean => {
   return Object.keys(obj).reduce((acc, pId) => obj[pId].selected && acc, true)
}

export function eqSet(set1: Set<any>, set2: Set<any>) : boolean {
   if (set1.size !== set2.size) return false;
   for (const x of set1) if (!set2.has(x)) return false;
   return true;
}

export function differenceSet(set1: Set<any>, set2: Set<any>) : Set<any> {
   return new Set([...set1].filter(x => !set2.has(x)));
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

export function areEqual(obj1: any, obj2: any){
   return  JSON.stringify(obj1) === JSON.stringify(obj2)
}

function mod(n: number, m: number) : number {
   return ((n % m) + m) % m;
}

export function scrollStop (element: any, onEvent: (arg0: any) => void, callback: () => void , refresh = 300) {

   // Make sure a valid callback was provided
   if (!callback || typeof callback !== 'function') return;

   // Setup scrolling variable
   let isScrolling : any;

   // Listen for wheel events
   element.addEventListener('wheel', (event: any) => {
      onEvent(event)

      // Clear our timeout throughout the scroll
      clearTimeout(isScrolling);

      // Set a timeout to run after scrolling ends
      isScrolling = setTimeout(() => callback(), refresh);

   }, false);

}

export const onWheel = (event: { deltaY: number; }, currentRef: { current: number; }, len: number, callback: (arg0: number) => void) => {
   const direction = Math.sign(event.deltaY) * -1
   const nextCursor = mod(currentRef.current + direction, len)
   callback(nextCursor)
   currentRef.current = nextCursor
}