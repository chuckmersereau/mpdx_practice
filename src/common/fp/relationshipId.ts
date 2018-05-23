import { isArray, reduce } from 'lodash/fp';

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