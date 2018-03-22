import { isFunction } from 'lodash/fp';
import { split } from './strings';

describe('common.fp.strings', () => {
    describe('split', () => {
        it('should curry', () => {
            expect(isFunction(split(','))).toEqual(true);
        });
        it('convert split string', () => {
            expect(split(',', 'a,b')).toEqual(['a', 'b']);
        });
        it('convert handle empty', () => {
            expect(split(',', '')).toEqual([]);
        });
    });
});