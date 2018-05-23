import mc from './modal.controller';

const person = { first_name: 'a', last_name: 'b' };
const contact = { id: 123 };

describe('contacts.show.personModal.controller', () => {
    let $ctrl, alerts, people, gettextCatalog, rootScope, scope, modal, api, q;
    beforeEach(() => {
        angular.mock.module(mc);

        inject(($controller, $rootScope, _alerts_, _people_, _gettextCatalog_, _modal_, _api_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            scope.$hide = () => {};
            alerts = _alerts_;
            api = _api_;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            people = _people_;
            q = $q;
            $ctrl = $controller('personModalController as $ctrl', {
                $scope: scope,
                contact: contact,
                peopleForRelationship: null,
                person: null,
                userProfile: null
            });
        });
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(scope, '$hide').and.callFake(() => {});
    });

    describe('constructor', () => {
        it('should list title suggestions', () => {
            expect($ctrl.titles).toEqual([
                'Mr.', 'Mrs.', 'Miss', 'Ms.', 'Rev.', 'Hon.', 'Dr.', 'Frau', 'Mlle', 'Mr. and Mrs.', 'Mme', 'Rev', 'M.',
                'Esq.', 'Jr.', 'Messrs.', 'Mmes.', 'Msgr.', 'Prof.', 'Rt. Hon.', 'St.'
            ]);
        });

        it('should list suffix suggestions', () => {
            expect($ctrl.suffixes).toEqual(['Jr.', 'Sr.', 'MD.']);
        });
    });

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
            const errorMessage = 'Unable to save changes.';
            const successMessage = 'Changes saved successfully.';
            spyOn(api, 'post').and.callFake(() => q.resolve({ id: 987 }));
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
                }, successMessage, errorMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
                done();
            });
            rootScope.$digest();
        });

        it('should call personCreated on create', (done) => {
            spyOn(api, 'post').and.callFake(() => q.resolve({ id: 987 }));
            $ctrl.activate();
            $ctrl.person.first_name = 'a';
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('personCreated', 987);
                done();
            });
            rootScope.$digest();
        });

        it('should call personUpdated on update', (done) => {
            spyOn(people, 'save').and.callFake(() => q.resolve());
            $ctrl.person = person;
            $ctrl.person.id = 123;
            $ctrl.activate();
            $ctrl.person.first_name = 'b';
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('personUpdated', 123);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => q.resolve());
            spyOn(api, 'delete').and.callFake(() => q.resolve());
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
            rootScope.$digest();
        });

        it('should hide the modal', (done) => {
            $ctrl.person.id = 1;
            $ctrl.delete().then(() => {
                expect(scope.$hide).toHaveBeenCalledWith();
                done();
            });
            rootScope.$digest();
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
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger', 5);
            });
        });
    });
});
