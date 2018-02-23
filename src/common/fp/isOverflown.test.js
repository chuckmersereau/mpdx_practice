import { isOverflown } from './isOverflown';

let element;
describe('common.fp.isOverflown', () => {
    beforeEach(() => {
        element = {};
    });
    it('should handle null', () => {
        expect(isOverflown(null)).toBeFalsy();
    });
    it('should handle undefined', () => {
        let e;
        expect(isOverflown(e)).toBeFalsy();
    });
    it('should handle scrollHeight', () => {
        element.scrollHeight = 2;
        element.clientHeight = 1;
        expect(isOverflown(element)).toBeTruthy();
    });
    it('should handle false', () => {
        element.scrollHeight = 2;
        element.clientHeight = 2;
        expect(isOverflown(element)).toBeFalsy();
    });
    it('should handle scrollWidth', () => {
        element.scrollWidth = 2;
        element.clientWidth = 1;
        expect(isOverflown(element)).toBeTruthy();
    });
    it('should handle false width', () => {
        element.scrollWidth = 2;
        element.clientWidth = 2;
        expect(isOverflown(element)).toBeFalsy();
    });
});