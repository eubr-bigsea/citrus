import {
    toRaw,
    isRef,
    isReactive,
    isProxy,
} from 'vue';

export const pad = (num, places, ch) => String(num).padStart(places, ch);

// re-number a draggable-reordered list's `order` field in place
export function reorder(list) {
    list.forEach((item, index) => { item.order = index + 1; });
}

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