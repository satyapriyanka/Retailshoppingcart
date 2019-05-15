export function getKeyByValue<T>(enumValue: T, objectType) {
    return Array.prototype.find.call(Object.keys(objectType), (o) => {
        return objectType[o] === enumValue;
    })
}