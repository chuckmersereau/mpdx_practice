import { emptyArrayToNull, isEmptyArray } from './arrays';

describe('common.fp.arrays', () => {
    describe('isEmptyArray', () => {
        it('should curry', () => {
            expect(isEmptyArray([])).toBeTruthy();
        });
        it('convert tags array to a string', () => {
            expect(isEmptyArray(['a'])).toBeFalsy();
        });
    });
    describe('emptyArrayToNull', () => {
        it('should convert empty array to null', () => {
            expect(emptyArrayToNull([])).toEqual(null);
        });
        it('should pass array if not empty', () => {
            expect(emptyArrayToNull(['a'])).toEqual(['a']);
        });
    });
});