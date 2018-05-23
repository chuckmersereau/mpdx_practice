import service from './appeals.service';

const appealId = 'appeal_id';
const contactId = 'contact_id';
const contactRef = { contact: { id: contactId } };

describe('tools.appeals.service', () => {
    let appeals, accounts, api, q, rootScope;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _appeals_, _accounts_, _api_, $q) => {
            accounts = _accounts_;
            appeals = _appeals_;
            api = _api_;
            q = $q;
            rootScope = $rootScope;
        });
        spyOn(appeals, 'gettext').and.callThrough();
    });

    describe('appealSearch', () => {
        it('should query the api', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
            appeals.appealSearch('a');
            expect(api.get).toHaveBeenCalledWith({
                url: 'appeals',
                data: {
                    filter: {
                        account_list_id: api.account_list_id,
                        wildcard_search: 'a'
                    },
                    fields: {
                        appeals: 'name'
                    },
                    per_page: 6
                },
                overrideGetAsPost: true
            });
        });
    });

    describe('setPrimaryAppeal', () => {
        beforeEach(() => {
            accounts.current = { primary_appeal: null };
        });

        it('should add the contact to the appeal', () => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => q.resolve());
            const successMessage = 'Appeal successfully set to primary';
            const errorMessage = 'Unable to set Appeal as primary';
            appeals.setPrimaryAppeal({ id: 1 });
            expect(accounts.saveCurrent).toHaveBeenCalledWith(successMessage, errorMessage);
            expect(appeals.gettext).toHaveBeenCalledWith(successMessage);
            expect(appeals.gettext).toHaveBeenCalledWith(errorMessage);
        });
    });

    describe('removePledge', () => {
        const pledgeId = 123;
        it('should delete donation', (done) => {
            spyOn(api, 'delete').and.callFake(() => q.resolve());
            const successMessage = 'Successfully removed commitment from appeal';
            const errorMessage = 'Unable to remove commitment from appeal';
            appeals.removePledge(pledgeId).then(() => {
                expect(api.delete).toHaveBeenCalledWith(
                    `account_lists/${api.account_list_id}/pledges/123`, undefined, successMessage, errorMessage
                );
                expect(appeals.gettext).toHaveBeenCalledWith(successMessage);
                expect(appeals.gettext).toHaveBeenCalledWith(errorMessage);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('removeContact', () => {
        const successMessage = 'Contact removed from appeal';
        const errorMessage = 'Unable to remove contact from appeal';
        beforeEach(() => {
            spyOn(appeals, 'findContactRef').and.callFake(() => q.resolve(appealId));
            spyOn(api, 'delete').and.callFake(() => q.resolve());
        });

        it('should open confirm modal', () => {
            appeals.removeContact(appealId);
        });

        it('should translate response messages', () => {
            appeals.removeContact(appealId);
            expect(appeals.gettext).toHaveBeenCalledWith(successMessage);
            expect(appeals.gettext).toHaveBeenCalledWith(errorMessage);
        });

        it('should delete contact', (done) => {
            appeals.removeContact(appealId).then(() => {
                expect(api.delete).toHaveBeenCalledWith(
                    `appeals/${appealId}/appeal_contacts/undefined`,
                    undefined, successMessage, errorMessage);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('findContactRef', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => q.resolve([contactRef]));
        });

        it('should call api', () => {
            appeals.findContactRef(appealId, contactId);
            expect(api.get).toHaveBeenCalledWith(`appeals/${appealId}/appeal_contacts`, {
                per_page: 1000,
                include: 'contact',
                filter: {
                    pledged_to_appeal: false
                },
                fields: {
                    contact: ''
                }
            });
        });

        it('should return contact ref if found', (done) => {
            appeals.findContactRef(appealId, contactId).then((data) => {
                expect(data).toEqual(contactRef);
                done();
            });
            rootScope.$digest();
        });
    });
});
