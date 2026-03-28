
/**
 * Инициализация поиска по таблице
 * @param {string} searchField - имя поля фильтра в state
 * @returns {(data: Array, state: Object, action?: HTMLElement) => Array} - функция фильтрации данных
 */
export function initSearching(searchField) {
    
     return (query, state, action) => { 
    return state[searchField] ? Object.assign({}, query, { 
        search: state[searchField] 
    }) : query; 
}

}