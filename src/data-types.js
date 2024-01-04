const NUMERIC = [
    "DECIMAL",
    "DOUBLE",
    "FLOAT",
    "INTEGER",
    "LONG",
];
const OTHERS = [
    "BINARY",
    "CHARACTER",
    "DATE",
    "DATETIME",

    "TEXT",
    "TIME",
    "TIMESTAMP",
    "VECTOR",
];
function isNumeric(dataType) {
    return NUMERIC.includes(dataType);
}
export {isNumeric};