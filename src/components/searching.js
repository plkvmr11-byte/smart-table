import { rules, createComparison } from "../lib/compare.js";

/**
 * Инициализация поиска по таблице
 * @param {string} searchField - имя поля фильтра в state
 * @returns {(data: Array, state: Object, action?: HTMLElement) => Array} - функция фильтрации данных
 */
export function initSearching(searchField) {
    // Настройка компаратора
    const compare = createComparison(
        ['skipEmptyTargetValues', 'skipNonExistentSourceFields'],
        [
            rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
        ]
    );

    // Возвращаем функцию фильтрации
    return (data, state, action) => {
        // Сброс поля поиска, если нажата кнопка сброса
        if (action && action.name === 'clear') {
            const parent = action.parentElement;
            const input = parent.querySelector('input');
            if (input) {
                input.value = '';
                state[searchField] = '';
            }
        }

        const searchValue = state[searchField];

        // Если поиск пустой — возвращаем все данные
        if (!searchValue) return data;

        // Фильтруем данные с помощью компаратора
        return data.filter(row => compare(row, state));
    };
}