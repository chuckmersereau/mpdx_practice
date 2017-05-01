import assign from 'lodash/fp/assign';
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
    it('should create a patch', () => {
        expect(createPatch(initial, changed)).toEqual({id: 'a', changing: 'd'});
    });
});