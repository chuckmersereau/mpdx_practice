import replaceAll from './replaceAll';
import isFunction from 'lodash/fp/isFunction';

describe('common.fp.replaceAll', () => {
    it('should curry', () => {
        expect(isFunction(replaceAll())).toEqual(true);
    });
    it('replace all instances in a string', () => {
        expect(replaceAll(',', '', 'a,b,c')).toEqual('abc');
    });
});