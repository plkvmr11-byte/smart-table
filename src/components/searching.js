import { rules, createComparison } from "../lib/compare.js";

/**
 * Инициализация поиска по таблице
 * @param {string} searchField - имя поля фильтра в state
 * @returns {(data: Array, state: Object, action?: HTMLElement) => Array} - функция фильтрации данных
 */
import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
    const compare = createComparison(
        [
            'skipEmptyTargetValues',
            'skipNonExistentSourceFields'
        ],
        [
            rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
        ]
    );

    return (data, state, action) => {
        if (action && action.name === 'clear') {
            const parent = action.parentElement;
            const input = parent.querySelector('input');
            if (input) {
                input.value = '';
                state[searchField] = '';
            }
        }

        const searchValue = state[searchField];
        if (!searchValue) return data;
        
        return data.filter(row => compare(row, state));
    };
}