import service from './people.service';

const accountListId = 123;

describe('contacts.service', () => {
    let api, modal, rootScope, people;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _people_, _api_, _modal_) => {
            rootScope = $rootScope;
            api = _api_;
            api.account_list_id = accountListId;
            modal = _modal_;
            people = _people_;
        });
        spyOn(api, 'get').and.callFake((data) => Promise.resolve(data));
        spyOn(api, 'put').and.callFake((data) => Promise.resolve(data));
        spyOn(api, 'delete').and.callFake((data) => Promise.resolve(data));
        spyOn(rootScope, '$emit').and.callThrough();
        spyOn(modal, 'open').and.callFake(() => Promise.resolve());
    });
    describe('openPeopleModal', () => {
        const contact = {id: 1};
        it('should call modal.open', () => {
            people.openPeopleModal(contact);
            expect(modal.open).toHaveBeenCalled();
        });
    });
    describe('openMergePeopleModal', () => {
        const contact = {id: 1};
        it('should call modal.open', () => {
            people.openMergePeopleModal(contact);
            expect(modal.open).toHaveBeenCalled();
        });
    });
});
