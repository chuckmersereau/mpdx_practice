import { isFunction } from 'lodash/fp';
import { convertTags, mapToName, stringToNameObjectArray } from './tags';

describe('common.fp.tags', () => {
    describe('convertTags', () => {
        it('should curry', () => {
            expect(isFunction((<any>convertTags)())).toEqual(true);
        });
        it('convert tags array to a string', () => {
            expect(convertTags([{ name: 'a' }, null, { name: 'b' }])).toEqual('a,,b');
        });
    });
    describe('stringToNameObjectArray', () => {
        it('convert tags string to a object array', () => {
            expect(stringToNameObjectArray('a,b')).toEqual([{ name: 'a' }, { name: 'b' }]);
        });
    });
    describe('mapToName', () => {
        it('convert tags string to a object array', () => {
            expect(mapToName(['a', 'b'])).toEqual([{ name: 'a' }, { name: 'b' }]);
        });
    });
});