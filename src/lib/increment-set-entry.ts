export function incrementSetEntry(object: any, property: any, defaultProperty: string): void {
    if (property == '') {
        object[defaultProperty] = (object[defaultProperty] || 0) + 1;
    } else {
        object[property] = (object[property] || 0) + 1;
    }
}
