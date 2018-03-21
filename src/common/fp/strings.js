import { curry, defaultTo } from 'lodash/fp';

export const split = curry((param, value) => defaultTo('', value).split(param));