import { isFunction } from 'lodash/fp';
import emptyToNull from './emptyToNull';

describe('common.fp.emptyToNull', () => {
    it('should curry', () => {
        expect(isFunction(emptyToNull())).toEqual(true);
    });

    it('should make an empty value null', () => {
        expect(emptyToNull('')).toEqual(null);
    });

    it('shouldn\'t change a value', () => {
        expect(emptyToNull('abc')).toEqual('abc');
    });
});
