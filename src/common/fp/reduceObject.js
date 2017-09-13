import curry from 'lodash/fp/curry';

const reduce = require('lodash/fp/reduce').convert({ 'cap': false });

export default curry((a, b, c) => reduce(a, b, c));