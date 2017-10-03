import curry from 'lodash/fp/curry';
import pickBy from 'lodash/fp/pickBy';

export default curry((collection) => pickBy((val) => val !== null, collection));