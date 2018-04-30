import replaceUnderscore from './replaceUnderscore';
import { isFunction } from 'lodash/fp';

describe('common.fp.replaceUnderscore', () => {
    it('should curry', () => {
        expect(isFunction(replaceUnderscore())).toEqual(true);
    });
    it('escape all commas in a string', () => {
        expect(replaceUnderscore('a_b_c')).toEqual('a-b-c');
    });
});