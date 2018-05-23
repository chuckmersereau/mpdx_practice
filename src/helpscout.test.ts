require('./helpscout');

describe('helpscout', () => {
    it('should load helpscout', () => {
        expect((window as any).HS.beacon).toBeDefined();
        expect((window as any).HSCW).toBeDefined();
    });
});