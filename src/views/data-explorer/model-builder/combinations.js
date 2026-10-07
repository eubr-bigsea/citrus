// How many values the grid search will try for a single parameter.
// An untouched parameter keeps its default, so it counts as one.
const valuesForField = (entry) => {
    const value = entry?.value;
    if (value === null || value === undefined || value === '') {
        return 1;
    }
    if (value.type === 'range') {
        const quantity = Number(value.quantity);
        return quantity > 0 ? quantity : 1;
    }
    const list = Array.isArray(value) ? value : value.list;
    return Array.isArray(list) && list.length ? list.length : 1;
};

// Number of models trained for one algorithm: the product of the values
// chosen for each of its parameters.
export const countCombinations = (operation, forms) => (operation?.forms || []).reduce(
    (total, opForm) => opForm.fields.reduce(
        (acc, field) => acc * valuesForField(forms?.[field.name]), total),
    1);
