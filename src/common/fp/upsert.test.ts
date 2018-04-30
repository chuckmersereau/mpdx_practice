import upsert from './upsert';
import { concat, isFunction } from 'lodash/fp';

const arr = [{
    id: 1,
    name: 'a'
}];

describe('common.fp.upsert', () => {
    it('should curry', () => {
        expect(isFunction(upsert())).toEqual(true);
    });
    it('should insert a new record', () => {
        const record = { id: 2, name: 'b' };
        expect(upsert('id', record, arr)).toEqual(concat(arr, record));
    });
    it('should update an existing record', () => {
        const record = { id: 1, name: 'a' };
        expect(upsert('id', record, arr)).toEqual([record]);
    });
});