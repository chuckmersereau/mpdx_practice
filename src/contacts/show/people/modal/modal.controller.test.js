import mc from './modal.controller';

const person = {first_name: 'a', last_name: 'b'};
const contact = {id: 123};

describe('contacts.show.personModal.controller', () => {
    let $ctrl, controller, alerts, people, gettextCatalog, rootScope, scope;
    beforeEach(() => {
        angular.mock.module(mc);
        inject(($controller, $rootScope, _alerts_, _people_, _gettextCatalog_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            scope.$hide = () => {};
            alerts = _alerts_;
            gettextCatalog = _gettextCatalog_;
            people = _people_;
            controller = $controller;
            loadController(person);
        });
        spyOn(alerts, 'addAlert').and.callFake(data => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });
    function loadController() {
        $ctrl = controller('personModalController as $ctrl', {
            $scope: scope,
            contact: contact,
            peopleForRelationship: null,
            person: null
        });
    }
    describe('activate', () => {
        it('should set a translated title', () => {
            $ctrl.activate();
            expect($ctrl.modalTitle).toEqual('Add Person');
            expect(gettextCatalog.getString).toHaveBeenCalledWith('Add Person');
        });
        it('should set a translated title', () => {
            $ctrl.person = {id: 1};
            $ctrl.activate();
            expect($ctrl.modalTitle).toEqual('Edit Person');
            expect(gettextCatalog.getString).toHaveBeenCalledWith('Edit Person');
        });
    });
    describe('save', () => {
        beforeEach(() => {
            spyOn(rootScope, '$emit').and.callThrough();
            spyOn(scope, '$hide');
        });
        it('should call personUpdated on create', done => {
            spyOn(people, 'create').and.callFake(() => Promise.resolve());
            $ctrl.activate();
            $ctrl.person.first_name = 'a';
            $ctrl.save().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                expect(rootScope.$emit).toHaveBeenCalledWith('personUpdated');
                done();
            });
        });
        it('should handle rejection', done => {
            spyOn(people, 'create').and.callFake(() => Promise.reject(Error('')));
            $ctrl.save().catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger', null, 5, true);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should call personUpdated on update', done => {
            spyOn(people, 'save').and.callFake(() => Promise.resolve());
            $ctrl.person = person;
            $ctrl.person.id = 123;
            $ctrl.activate();
            $ctrl.person.first_name = 'b';
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('personUpdated');
                done();
            });
        });
        it('should handle rejection', done => {
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
