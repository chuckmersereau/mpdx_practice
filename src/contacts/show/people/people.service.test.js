import service from './people.service';

const accountListId = 123;

describe('contacts.service', () => {
    let api, modal, rootScope, people, Upload;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _people_, _api_, _modal_, _Upload_) => {
            rootScope = $rootScope;
            api = _api_;
            api.account_list_id = accountListId;
            modal = _modal_;
            people = _people_;
            Upload = _Upload_;
        });
        spyOn(api, 'get').and.callFake((data) => Promise.resolve(data));
        spyOn(api, 'put').and.callFake((data) => Promise.resolve(data));
        spyOn(api, 'delete').and.callFake((data) => Promise.resolve(data));
        spyOn(rootScope, '$emit').and.callThrough();
        spyOn(modal, 'open').and.callFake(() => Promise.resolve());
    });

    describe('openPeopleModal', () => {
        const contact = { id: 1 };
        it('should call modal.open', () => {
            people.openPeopleModal(contact);
            expect(modal.open).toHaveBeenCalled();
        });
    });

    describe('openMergePeopleModal', () => {
        const contact = { id: 1 };
        it('should call modal.open', () => {
            people.openMergePeopleModal(contact);
            expect(modal.open).toHaveBeenCalled();
        });
    });

    describe('updateAvatar', () => {
        it('should call Upload.upload', () => {
            let person = { id: 'person_id' };
            let avatar = { id: 'avatar_id' };
            spyOn(Upload, 'upload');
            people.updateAvatar(person, avatar);
            expect(Upload.upload).toHaveBeenCalledWith({
                url: `/api/v1/contacts/people/${person.id}`,
                method: 'PUT',
                arrayKey: '[]',
                data: {
                    data: {
                        id: person.id,
                        type: 'people',
                        attributes: {
                            overwrite: true
                        },
                        relationships: {
                            pictures: {
                                data: [{
                                    id: jasmine.any(String),
                                    type: 'pictures'
                                }]
                            }
                        }
                    },
                    included: [
                        {
                            id: jasmine.any(String),
                            type: 'pictures',
                            attributes: {
                                image: avatar,
                                primary: true
                            }
                        }
                    ]
                }
            });
        });
    });
    describe('bulkMerge', () => {
        const winnersAndLosers = 'a';
        const errorMessage = 'b';
        const retVal = {
            success: () => 'c'
        };
        beforeEach(() => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve(retVal));
            spyOn(retVal, 'success').and.callFake(() => 'c');
        });
        it('should call the api', () => {
            people.bulkMerge(winnersAndLosers, errorMessage);
            expect(api.post).toHaveBeenCalledWith({
                url: 'contacts/people/merges/bulk',
                data: winnersAndLosers,
                type: 'people',
                errorMessage: errorMessage,
                fields: {
                    people: ''
                }
            });
        });
        it('should call the success fn', (done) => {
            people.bulkMerge(winnersAndLosers, errorMessage).then(() => {
                expect(retVal.success).toHaveBeenCalledWith();
                done();
            });
        });
        it('should pass the data', (done) => {
            people.bulkMerge(winnersAndLosers, errorMessage).then((data) => {
                expect(data).toEqual(retVal);
                done();
            });
        });
    });
    describe('bulkSave', () => {
        const peopleArr = ['a', 'b'];

        it('should call the api', () => {
            people.bulkSave(peopleArr);
            expect(api.put).toHaveBeenCalledWith({
                url: 'contacts/people/bulk',
                data: peopleArr,
                type: 'people',
                fields: {
                    people: ''
                }
            });
        });
    });
});
