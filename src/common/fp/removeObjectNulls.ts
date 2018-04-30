import { curry, pickBy } from 'lodash/fp';

export default curry((collection) => pickBy((val) => val !== null, collection));