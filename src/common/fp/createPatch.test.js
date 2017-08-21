import assign from 'lodash/fp/assign';
import isFunction from 'lodash/fp/isFunction';
import createPatch from './createPatch';

const initial = {
    id: 'a',
    notChanging: 'b',
    changing: 'c'
};

const changed = assign(initial, {
    changing: 'd'
});

describe('common.fp.createPatch', () => {
    it('should curry', () => {
        expect(isFunction(createPatch())).toEqual(true);
    });
    it('should create a patch', () => {
        expect(createPatch(initial, changed)).toEqual({ id: 'a', changing: 'd' });
    });
});