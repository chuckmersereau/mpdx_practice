import isArray from 'lodash/fp/isArray';
import reduce from 'lodash/fp/reduce';

export default (keys) => {
    if (!isArray(keys)) {
        keys = [keys];
    }
    return reduce((result, key) => {
        result[key] = {
            valueForRelationship: (relationship) => {
                return {
                    id: relationship.id
                };
            }
        };
        return result;
    }, {}, keys);
};