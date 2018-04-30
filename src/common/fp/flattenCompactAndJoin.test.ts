import flattenCompactAndJoin from './flattenCompactAndJoin';

describe('common.fp.flattenCompactAndJoin', () => {
    it('should flatten > compact > join an array', () => {
        expect(flattenCompactAndJoin((val) => val, [['a'], null, undefined, 'b'])).toEqual('a,b');
    });
});