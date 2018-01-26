import { curry, reduce } from 'lodash/fp';

const reduceO = reduce.convert({ 'cap': false });

export default curry((a, b, c) => reduceO(a, b, c));