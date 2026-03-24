import { createComparison, defaultRules } from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)
        .forEach((elementName) => {
            const selectElement = elements[elementName];
            if (selectElement) {
                selectElement.innerHTML = '<option value="">Все</option>';
                const options = Object.values(indexes[elementName])
                    .map(name => {
                        const option = document.createElement('option');
                        option.value = name;
                        option.textContent = name;
                        return option;
                    });
                selectElement.append(...options);
            }
        });

    // @todo: #4.3 — настроить компаратор
    const extendedRules = {
        ...defaultRules,
        totalFrom: (value, target) => {
            if (!target) return true;
            const numValue = parseFloat(value);
            const numTarget = parseFloat(target);
            return !isNaN(numValue) && !isNaN(numTarget) && numValue >= numTarget;
        },
        totalTo: (value, target) => {
            if (!target) return true;
            const numValue = parseFloat(value);
            const numTarget = parseFloat(target);
            return !isNaN(numValue) && !isNaN(numTarget) && numValue <= numTarget;
        }
    };
    const compare = createComparison(extendedRules);

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку полей
        if (action && action.name === 'clear') {
            const parent = action.parentElement;
            const input = parent.querySelector('input');
            if (input) {
                input.value = '';
                const fieldName = action.dataset.field;
                state[fieldName] = '';
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    };
}
