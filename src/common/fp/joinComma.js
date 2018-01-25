import { curry, isArray, join } from 'lodash/fp';

export default curry((val) => {
    if (isArray(val)) {
        return join(',', val);
    }
    return val;
});
