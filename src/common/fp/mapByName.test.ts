import mapByName from './mapByName';
import { isFunction } from 'lodash/fp';

const arr = [{
    name: 'a',
    id: 'b'
}, {
    name: 'c'
}];

describe('common.fp.mapByName', () => {
    it('should curry', () => {
        expect(isFunction((<any>mapByName)())).toEqual(true);
    });
    it('should map an array by name property', () => {
        expect(mapByName(arr)).toEqual(['a', 'c']);
    });
});