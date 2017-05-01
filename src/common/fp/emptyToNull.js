import curry from 'lodash/fp/curry';
import isEmpty from 'lodash/fp/isEmpty';

export default curry(val => isEmpty(val) ? null : val);