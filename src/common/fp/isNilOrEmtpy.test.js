import isNilOrEmpty from './isNilOrEmpty';
import isFunction from 'lodash/fp/isFunction';

describe('common.fp.joinComma', () => {
    it('should curry', () => {
        expect(isFunction(isNilOrEmpty())).toEqual(true);
    });
    it('should handle null', () => {
        expect(isNilOrEmpty(null)).toEqual(true);
    });
    it('should handle undefined', () => {
        let e;
        expect(isNilOrEmpty(e)).toEqual(true);
    });
    it('should handle empty', () => {
        expect(isNilOrEmpty('')).toEqual(true);
    });
    it('should handle false', () => {
        expect(isNilOrEmpty('0')).toEqual(false);
    });
    it('should handle falsey', () => {
        expect(isNilOrEmpty(0)).toEqual(false);
    });
});