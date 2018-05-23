import { isFunction } from 'lodash/fp';
import mapObject from './mapObject';

const obj = {
    a: 'b'
};

describe('common.fp.mapObject', () => {
    it('should curry', () => {
        expect(isFunction(mapObject())).toEqual(true);
    });

    it('should map an object', () => {
        expect(mapObject((value, key) => {
            return `${key} ${value}`;
        }, obj)).toEqual(['a b']);
    });
});