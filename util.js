export function isPlainObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}

export function isFunction(value) {
    return typeof value === "function";
}

export function assertIsObject(value, error) {
    if (isPlainObject(value)) return true;

    throw new TypeError(error);
}

export function assertIsFunction(value, error) {
    if (isFunction(value)) return true;

    throw new TypeError(error);
}