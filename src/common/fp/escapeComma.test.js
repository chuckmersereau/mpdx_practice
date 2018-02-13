import escapeComma from './escapeComma';
import { isFunction } from 'lodash/fp';

describe('common.fp.escapeComma', () => {
    it('should curry', () => {
        expect(isFunction(escapeComma())).toEqual(true);
    });
    it('escape all commas in a string', () => {
        expect(escapeComma('a,b,c')).toEqual('a\\,b\\,c');
    });
});