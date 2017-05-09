import curry from 'lodash/fp/curry';
import unionBy from 'lodash/fp/unionBy';

export default curry((iteratee, object, collection) => unionBy(iteratee, collection, [object]));
