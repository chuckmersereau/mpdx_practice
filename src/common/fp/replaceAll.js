import curry from 'lodash/fp/curry';
import join from 'lodash/fp/join';
import split from 'lodash/fp/split';

export default curry((param1, param2, val) => join(param1, split(param2, val)));