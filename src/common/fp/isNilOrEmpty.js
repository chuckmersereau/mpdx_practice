//return null or empty, but not numeric
import curry from 'lodash/fp/curry';
import isEmpty from 'lodash/fp/isEmpty';
import isNil from 'lodash/fp/isNil';
import isNumber from 'lodash/fp/isNumber';

export default curry(target => {
    return (isNil(target) || isEmpty(target)) && !isNumber(target);
});