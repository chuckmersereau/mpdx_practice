import { curry, unionBy } from 'lodash/fp';

export default curry((iteratee, object, collection) => unionBy(iteratee, collection, [object]));
