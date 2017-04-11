import isEqual from 'lodash/fp/isEqual';
const reduce = require('lodash/fp/reduce').convert({ 'cap': false });

export default (target, source) => {
    return reduce((result, value, key) => {
        if (key === 'id') {
            result[key] = value;
        }
        if (!isEqual(value, target[key])) {
            result[key] = value;
        }
        return result;
    }, {}, source);
};