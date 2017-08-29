import fixed from './fixed';
import isFunction from 'lodash/fp/isFunction';

describe('common.fp.fixed', () => {
    it('should curry', () => {
        expect(isFunction(fixed())).toEqual(true);
        expect(isFunction(fixed(2))).toEqual(true);
    });
    it('should handle precision', () => {
        expect(fixed(2, 2.323)).toEqual('2.32');
    });
    it('should handle no precision', () => {
        expect(fixed(2, 2)).toEqual('2.00');
    });
});