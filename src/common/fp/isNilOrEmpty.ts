// return null or empty, but not numeric
import { curry, isEmpty, isNil, isNumber } from 'lodash/fp';

export default curry((target) => {
    return (isNil(target) || isEmpty(target)) && !isNumber(target);
});