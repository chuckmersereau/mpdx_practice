import findIndex from 'lodash/fp/findIndex';
import cloneDeep from 'lodash/fp/cloneDeep';

export default (iteratee, object, collection) => {
    let returnable = cloneDeep(collection);
    const index = findIndex([iteratee, object[iteratee]], returnable);
    if (index >= 0) {
        returnable.splice(index, 1, object);
    } else {
        returnable.push(object);
    }
    return returnable;
};
