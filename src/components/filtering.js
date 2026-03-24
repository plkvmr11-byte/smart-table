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
    const compare = createComparison(defaultRules);

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

        // Преобразуем totalFrom и totalTo в массив для правила arrayAsRange
        const filterState = { ...state };
        
        if (filterState.totalFrom || filterState.totalTo) {
            const from = filterState.totalFrom ? parseFloat(filterState.totalFrom) : '';
            const to = filterState.totalTo ? parseFloat(filterState.totalTo) : '';
            filterState.total = [from, to];
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, filterState));
    };
}
