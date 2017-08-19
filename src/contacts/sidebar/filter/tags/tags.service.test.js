import service from './tags.service';

const accountListId = 123;
const result = ['a'];

describe('contacts.service', () => {
    let api, contactsTags;
    beforeEach(() => {
        angular.mock.module(service);
        inject((_api_, _contactsTags_) => {
            api = _api_;
            api.account_list_id = accountListId;
            contactsTags = _contactsTags_;
        });
        spyOn(api, 'get').and.callFake(() => Promise.resolve(result));
    });
    describe('load', () => {
        it('should query the api', (done) => {
            contactsTags.load().then(() => {
                expect(api.get).toHaveBeenCalledWith('contacts/tags', { filter: { account_list_id: accountListId } });
                done();
            });
        });
        it('should set and return data', (done) => {
            contactsTags.load().then((data) => {
                expect(contactsTags.data).toEqual(result);
                expect(data).toEqual(result);
                done();
            });
        });
    });
});