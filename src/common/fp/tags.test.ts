import { convertTags, mapToName, stringToNameObjectArray } from './tags';
import { isFunction } from 'lodash/fp';

describe('common.fp.tags', () => {
    describe('convertTags', () => {
        it('should curry', () => {
            expect(isFunction((convertTags as any)())).toEqual(true);
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