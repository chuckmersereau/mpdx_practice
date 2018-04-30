import joinComma from './joinComma';
import { isFunction } from 'lodash/fp';

describe('common.fp.joinComma', () => {
    it('should curry', () => {
        expect(isFunction(joinComma())).toEqual(true);
    });
    it('should join an arry', () => {
        expect(joinComma(['a', 'b', 'c'])).toEqual('a,b,c');
    });
    it('shouldn\'t join a string', () => {
        expect(joinComma('abc')).toEqual('abc');
    });
});