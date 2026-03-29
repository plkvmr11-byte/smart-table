export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    const applyFiltering = (query, state, action) => {
        // код с обработкой очистки поля. исправила
        if (!action || action.tagName !== 'BUTTON' || !action.dataset?.field) {
        return query;
        }

        const fieldToClear = action.dataset.field.toLowerCase();

        let elementKey = null;
        let apiField = null;

        if (fieldToClear === 'customer') {
            elementKey = 'searchByCustomer';
            apiField = 'customer';
        } else if (fieldToClear === 'date') {
            elementKey = 'searchByDate';
            apiField = 'date';
        }

        const filterElement = elements[elementKey];
        if (!filterElement) return query;

        const newQuery = { ...query };
        const value = filterElement.value?.trim();

        if (apiField === 'date') {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                delete newQuery[`filter[${apiField}]`];
            }
        } else if (apiField) {
            delete newQuery[`filter[${apiField}]`];
        }

        if (filterElement.tagName === 'SELECT') {
            filterElement.selectedIndex = 0;
        } else if (filterElement.tagName === 'INPUT') {
            filterElement.value = '';
        }

        // @todo: #4.5 — отфильтровать данные, используя компаратор
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }
} 
