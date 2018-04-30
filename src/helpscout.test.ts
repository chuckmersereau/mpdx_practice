require('./helpscout');

describe('helpscout', () => {
    it('should load helpscout', () => {
        expect((<any>window).HS.beacon).toBeDefined();
        expect((<any>window).HSCW).toBeDefined();
    });
});