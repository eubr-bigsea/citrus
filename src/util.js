import {
    toRaw,
    isRef,
    isReactive,
    isProxy,
} from 'vue';

export function debounce(fn, delay) {
    var timeoutID = null;
    return function () {
        clearTimeout(timeoutID);
        var args = arguments;
        var that = this;
        timeoutID = setTimeout(function () {
            fn.apply(that, args);
        }, delay);
    };
}
export function deepToRaw(sourceObj) {
    const objectIterator = (input) => {
        if (Array.isArray(input)) {
            return input.map((item) => objectIterator(item));
        } if (isRef(input) || isReactive(input) || isProxy(input)) {
            return objectIterator(toRaw(input));
        } if (input && typeof input === 'object') {
            return Object.keys(input).reduce((acc, key) => {
                acc[key] = objectIterator(input[key]);
                return acc;
            }, {});
        }
        return input;
    };

    return objectIterator(sourceObj);
}