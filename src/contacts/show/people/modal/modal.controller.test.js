import mc from './modal.controller';

const person = {first_name: 'a', last_name: 'b'};
const contact = {id: 123};

describe('contacts.show.personModal.controller', () => {
    let $ctrl, controller, alerts, people, gettextCatalog, modal, rootScope, scope;
    beforeEach(() => {
        angular.mock.module(mc);
        inject(($controller, $rootScope, _alerts_, _people_, _modal_, _gettextCatalog_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            scope.$hide = () => {};
            alerts = _alerts_;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            people = _people_;
            controller = $controller;
            loadController(person);
        });
        spyOn(alerts, 'addAlert').and.callFake(data => data);
        spyOn(gettextCatalog, 'getString').and.callFake(data => data);
    });
    function loadController() {
        $ctrl = controller('personModalController as $ctrl', {
            $scope: scope,
            contact: contact,
            peopleForRelationship: null,
            person: null
        });
    }
    describe('save', () => {
        beforeEach(() => {
            spyOn(people, 'create').and.callFake(() => Promise.resolve());
            spyOn(people, 'save').and.callFake(() => Promise.resolve());
            spyOn(rootScope, '$emit').and.callThrough();
            spyOn(scope, '$hide');
        });
        it('should call personUpdated on create', done => {
            $ctrl.activate();
            $ctrl.person.first_name = 'a';
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('personUpdated');
                done();
            });
        });
        it('should call personUpdated on update', done => {
            $ctrl.person = person;
            $ctrl.person.id = 123;
            $ctrl.activate();
            $ctrl.person.first_name = 'b';
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('personUpdated');
                done();
            });
        });
    });
});