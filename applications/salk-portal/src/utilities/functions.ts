export const areAllSelected = (obj: { [x: string]: { selected: any } }) => {
   return Object.keys(obj)
        .reduce((acc, sId) => obj[sId].selected && acc, true)
}

export function eqSet(set1: Set<any>, set2: Set<any>) {
   if (set1.size !== set2.size) return false;
   for (const x of set1) if (!set2.has(x)) return false;
   return true;
}