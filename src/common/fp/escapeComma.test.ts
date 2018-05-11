import { isFunction } from 'lodash/fp';
import escapeComma from './escapeComma';

describe('common.fp.escapeComma', () => {
    it('should curry', () => {
        expect(isFunction(escapeComma())).toEqual(true);
    });

    it('escape all commas in a string', () => {
        expect(escapeComma('a,b,c')).toEqual('a\\,b\\,c');
    });
});