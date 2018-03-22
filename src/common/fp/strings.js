import { curry, defaultTo, isEmpty } from 'lodash/fp';

export const split = curry((param, value) => {
    const s = defaultTo('', value);
    return isEmpty(s) ? [] : value.split(param);
});