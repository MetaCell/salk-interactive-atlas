export const areAllSelected = (obj: { [x: string]: { selected: any } }) => {
   return Object.keys(obj)
        .reduce((acc, sId) => obj[sId].selected && acc, true)
}