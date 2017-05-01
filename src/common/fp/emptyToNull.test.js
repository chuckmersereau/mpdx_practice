import emptyToNull from './emptyToNull';

describe('common.fp.emptyToNull', () => {
    it('should make an empty value null', () => {
        expect(emptyToNull('')).toEqual(null);
    });
    it(`shouldn't change a value`, () => {
        expect(emptyToNull('abc')).toEqual('abc');
    });
});
