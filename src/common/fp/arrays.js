import { isArray } from 'lodash/fp';

export const isEmptyArray = (array) => isArray(array) && array.length === 0;
export const emptyArrayToNull = (array) => isEmptyArray(array) ? null : array;