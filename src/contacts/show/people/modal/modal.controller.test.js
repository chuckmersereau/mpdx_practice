import mc from './modal.controller';

const person = { first_name: 'a', last_name: 'b' };
const contact = { id: 123 };

describe('contacts.show.personModal.controller', () => {
    let $ctrl, controller, alerts, people, gettextCatalog, rootScope, scope, modal, api;
    beforeEach(() => {
        angular.mock.module(mc);

        inject(($controller, $rootScope, _alerts_, _people_, _gettextCatalog_, _modal_, _api_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            scope.$hide = () => {};
            alerts = _alerts_;
            api = _api_;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            people = _people_;
            controller = $controller;
            loadController(person);
        });

        spyOn(alerts, 'addAlert').and.callFake((data) => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(scope, '$hide').and.callFake(() => {});
    });

    function loadController() {
        $ctrl = controller('personModalController as $ctrl', {
            $scope: scope,
            contact: contact,
            peopleForRelationship: null,
            person: null,
            userProfile: null
        });
    }
    describe('activate', () => {
        it('should set a translated title when adding a person', () => {
            $ctrl.activate();
            expect($ctrl.modalTitle).toEqual('Add Person');
            expect(gettextCatalog.getString).toHaveBeenCalledWith('Add Person');
        });

        it('should set a translated title when edting a person', () => {
            $ctrl.person = { id: 1 };
            $ctrl.activate();
            expect($ctrl.modalTitle).toEqual('Edit Person');
            expect(gettextCatalog.getString).toHaveBeenCalledWith('Edit Person');
        });

        it('should set a translated title when edting a user profile', () => {
            $ctrl.userProfile = 'true';
            $ctrl.person = { id: 1 };
            $ctrl.activate();
            expect($ctrl.modalTitle).toEqual('Edit My Profile');
            expect(gettextCatalog.getString).toHaveBeenCalledWith('Edit My Profile');
        });
    });
    describe('save', () => {
        beforeEach(() => {
            spyOn(rootScope, '$emit').and.callThrough();
        });
        it('should create on create', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve({ id: 987 }));
            $ctrl.activate();
            $ctrl.person.first_name = 'a';
            $ctrl.save().then(() => {
                expect(api.post).toHaveBeenCalledWith('contacts/123/people', {
                    email_addresses: [],
                    first_name: 'a',
                    phone_numbers: [],
                    family_relationships: [],
                    facebook_accounts: [],
                    twitter_accounts: [],
                    linkedin_accounts: [],
                    websites: []
                });
                done();
            });
        });

        it('should alert a translated message on create', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve({ id: 987 }));
            $ctrl.activate();
            $ctrl.person.first_name = 'a';
            $ctrl.save().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });

        it('should call personCreated on create', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve({ id: 987 }));
            $ctrl.activate();
            $ctrl.person.first_name = 'a';
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('personCreated', 987);
                done();
            });
        });

        it('should handle rejection', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.reject());
            $ctrl.save().catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger', null, 5, true);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });

        it('should call personUpdated on update', (done) => {
            spyOn(people, 'save').and.callFake(() => Promise.resolve());
            $ctrl.person = person;
            $ctrl.person.id = 123;
            $ctrl.activate();
            $ctrl.person.first_name = 'b';
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('personUpdated', 123);
                done();
            });
        });

        it('should handle rejection', (done) => {
            spyOn(people, 'save').and.callFake(() => Promise.reject(Error('')));
            $ctrl.person = person;
            $ctrl.person.id = 123;
            $ctrl.activate();
            $ctrl.person.first_name = 'b';
            $ctrl.save().catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger', null, 5, true);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
        });

        it('should confirm with a translated message', () => {
            $ctrl.delete();
            expect(modal.confirm).toHaveBeenCalledWith(jasmine.any(String));
            expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
        });

        it('should call people.remove', (done) => {
            $ctrl.person.id = 1;
            $ctrl.delete().then(() => {
                expect(api.delete).toHaveBeenCalledWith({
                    url: 'contacts/people/1',
                    data: {
                        id: 1
                    },
                    type: 'people'
                });
                done();
            });
        });

        it('should hide the modal', (done) => {
            $ctrl.person.id = 1;
            $ctrl.delete().then(() => {
                expect(scope.$hide).toHaveBeenCalledWith();
                done();
            });
        });
    });

    describe('changeTab', () => {
        describe('Form Valid', () => {
            const form = { $valid: true };

            it('should update activeTab', () => {
                $ctrl.activeTab = 'other';
                $ctrl.changeTab(form, 'test');
                expect($ctrl.activeTab).toEqual('test');
            });
        });

        describe('Form Invalid', () => {
            const form = { $valid: false };

            it('should translate alert', () => {
                $ctrl.activeTab = 'other';
                $ctrl.changeTab(form, 'test');
                expect(gettextCatalog.getString).toHaveBeenCalledWith('Please complete required fields before changing tabs');
            });

            it('should add alert', () => {
                $ctrl.activeTab = 'other';
                $ctrl.changeTab(form, 'test');
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger', null, 5, true);
            });
        });
    });
});
