require('./helpscout');

describe('helpscout', () => {
    it('should load helpscout', () => {
        expect(window.HS.beacon).toBeDefined();
        expect(window.HSCW).toBeDefined();
    });
});