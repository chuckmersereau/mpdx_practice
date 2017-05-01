import curry from 'lodash/fp/curry';
import isEqual from 'lodash/fp/isEqual';
import reduceObject from './reduceObject';

export default curry((target, source) => {
    return reduceObject((result, value, key) => {
        if (key === 'id') {
            result[key] = value;
        }
        if (!isEqual(value, target[key])) {
            result[key] = value;
        }
        return result;
    }, {}, source);
});