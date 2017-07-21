import curry from 'lodash/fp/curry';
const map = require('lodash/fp/map').convert({ 'cap': false });

export default curry((a, b) => map(a, b));