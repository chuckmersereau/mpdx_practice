import curry from 'lodash/fp/curry';
import isArray from 'lodash/fp/isArray';
import join from 'lodash/fp/join';

export default curry((val) => {
    if (isArray(val)) {
        return join(',', val);
    }
    return val;
});
