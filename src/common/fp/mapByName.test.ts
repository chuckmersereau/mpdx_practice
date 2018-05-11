import { isFunction } from 'lodash/fp';
import mapByName from './mapByName';

const arr = [{
    name: 'a',
    id: 'b'
}, {
    name: 'c'
}];

describe('common.fp.mapByName', () => {
    it('should curry', () => {
        expect(isFunction((mapByName as any)())).toEqual(true);
    });

    it('should map an array by name property', () => {
        expect(mapByName(arr)).toEqual(['a', 'c']);
    });
});