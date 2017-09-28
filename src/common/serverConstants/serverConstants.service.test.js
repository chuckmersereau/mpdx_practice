import service from './serverConstants.service';

describe('contacts.service', () => {
    let api, serverConstants;
    beforeEach(() => {
        angular.mock.module(service);
        inject((_api_, _serverConstants_) => {
            api = _api_;
            serverConstants = _serverConstants_;
        });
    });
    describe('constructor', () => {
        it('should set data to an empty object', () => {
            expect(serverConstants.data).toEqual({});
        });
    });
    describe('load', () => {
        it('should get constants', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            serverConstants.load(['a', 'b']);
            expect(api.get).toHaveBeenCalledWith('constants', {
                fields: {
                    constant_list: 'a,b'
                }
            });
        });
        it('should only get new constants', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            serverConstants.data = { a: {} };
            serverConstants.load(['a', 'b']);
            expect(api.get).toHaveBeenCalledWith('constants', {
                fields: {
                    constant_list: 'b'
                }
            });
        });
        it('should exit if nothing to get', () => {
            spyOn(api, 'get').and.callFake(() => Promise.reject());
            serverConstants.load([]);
            expect(api.get).not.toHaveBeenCalled();
        });
    });
    describe('handleSpecialKeys', () => {
        it('should mapUnderscore languages', () => {
            expect(serverConstants.handleSpecialKeys('languages', { a_r: {} })).toEqual({ 'a-r': {} });
        });
        it('should mapUnderscore locales', () => {
            expect(serverConstants.handleSpecialKeys('locales', { a_r: {} })).toEqual({ 'a-r': {} });
        });
        it('should mapUnderscore organizations_attributes', () => {
            expect(serverConstants.handleSpecialKeys('organizations_attributes', { a_r: {} })).toEqual({ 'a-r': {} });
        });
        it('should mapFrequencies pledge_frequency_hashes', () => {
            expect(serverConstants.handleSpecialKeys('pledge_frequency_hashes', [{ key: '1.1' }])).toEqual([{ key: 1.1 }]);
        });
    });
    describe('getPledgeFrequency', () => {
        it('should return a pledge frequency object', () => {
            serverConstants.data = {
                pledge_frequency_hashes: [
                    { key: 1, value: 'a' }
                ]
            };
            expect(serverConstants.getPledgeFrequency('1')).toEqual({ key: 1, value: 'a' });
        });
    });
    describe('getPledgeFrequencyValue', () => {
        it('should return a pledge frequency value', () => {
            serverConstants.data = {
                pledge_frequency_hashes: [
                    { key: 1, value: 'a' }
                ]
            };
            expect(serverConstants.getPledgeFrequencyValue('1')).toEqual('a');
        });
        it('should handle nulls', () => {
            serverConstants.data = {
                pledge_frequency_hashes: [
                    { key: 1, value: 'a' }
                ]
            };
            expect(serverConstants.getPledgeFrequencyValue('2')).toBeUndefined();
        });
    });
});