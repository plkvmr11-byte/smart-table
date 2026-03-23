import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison({
        [searchField]: rules.searchMultipleFields(
            searchField,
            ['date', 'customer', 'seller'],
            false
        )
    }, 'skipEmptyTargetValues');
    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
       if (action && action.name === 'clear') {
            const parent = action.parentElement;
            const input = parent.querySelector('input');
            if (input) {
                input.value = '';
                const fieldName = action.dataset.field;
                state[fieldName] = '';
            }
        }

        const searchValue = state[searchField];

        // Если нет поискового запроса — возвращаем все данные
        if (!searchValue) {
            return data;
        }

        // Фильтруем данные по поисковому запросу
        return data.filter(row => compare(row, state));
    };
}